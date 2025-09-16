export interface ExportOptions {
  format: 'csv' | 'json';
  includeHeaders?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  fields?: string[];
  filename?: string;
  compressed?: boolean;
}

export interface ExportResult {
  success: boolean;
  filename: string;
  size: number;
  recordCount: number;
  downloadUrl?: string;
  error?: string;
}

export interface ExportProgress {
  percentage: number;
  stage: 'preparing' | 'processing' | 'generating' | 'complete' | 'error';
  message: string;
  recordsProcessed: number;
  totalRecords: number;
}

class DataExportService {
  private static instance: DataExportService;
  private progressCallbacks: Map<string, (progress: ExportProgress) => void> = new Map();

  public static getInstance(): DataExportService {
    if (!DataExportService.instance) {
      DataExportService.instance = new DataExportService();
    }
    return DataExportService.instance;
  }

  // Export students data
  async exportStudents(
    students: any[],
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<ExportResult> {
    const exportId = this.generateExportId();
    if (onProgress) {
      this.progressCallbacks.set(exportId, onProgress);
    }

    try {
      this.reportProgress(exportId, {
        percentage: 0,
        stage: 'preparing',
        message: 'Preparing student data export...',
        recordsProcessed: 0,
        totalRecords: students.length,
      });

      // Filter students by date range if specified
      let filteredStudents = students;
      if (options.dateRange) {
        filteredStudents = students.filter(student => {
          const createdDate = new Date(student.createdAt || student.enrollmentDate);
          return createdDate >= options.dateRange!.start && createdDate <= options.dateRange!.end;
        });
      }

      this.reportProgress(exportId, {
        percentage: 25,
        stage: 'processing',
        message: 'Processing student records...',
        recordsProcessed: 0,
        totalRecords: filteredStudents.length,
      });

      // Filter fields if specified
      const processedStudents = this.processStudentData(filteredStudents, options.fields);

      this.reportProgress(exportId, {
        percentage: 50,
        stage: 'generating',
        message: `Generating ${options.format.toUpperCase()} file...`,
        recordsProcessed: processedStudents.length,
        totalRecords: filteredStudents.length,
      });

      // Generate file content
      let content: string;
      let mimeType: string;
      let fileExtension: string;

      if (options.format === 'csv') {
        content = this.generateCSV(processedStudents, options.includeHeaders !== false);
        mimeType = 'text/csv';
        fileExtension = 'csv';
      } else {
        content = this.generateJSON(processedStudents);
        mimeType = 'application/json';
        fileExtension = 'json';
      }

      this.reportProgress(exportId, {
        percentage: 75,
        stage: 'generating',
        message: 'Creating download file...',
        recordsProcessed: processedStudents.length,
        totalRecords: filteredStudents.length,
      });

      // Create and download file
      const filename = options.filename || this.generateFilename('students', options.format);
      const blob = new Blob([content], { type: mimeType });
      const downloadUrl = this.createDownloadUrl(blob, filename);

      this.reportProgress(exportId, {
        percentage: 100,
        stage: 'complete',
        message: 'Export completed successfully!',
        recordsProcessed: processedStudents.length,
        totalRecords: filteredStudents.length,
      });

      return {
        success: true,
        filename,
        size: blob.size,
        recordCount: processedStudents.length,
        downloadUrl,
      };

    } catch (error) {
      this.reportProgress(exportId, {
        percentage: 0,
        stage: 'error',
        message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        recordsProcessed: 0,
        totalRecords: students.length,
      });

      return {
        success: false,
        filename: '',
        size: 0,
        recordCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      this.progressCallbacks.delete(exportId);
    }
  }

  // Export alerts data
  async exportAlerts(
    alerts: any[],
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<ExportResult> {
    const exportId = this.generateExportId();
    if (onProgress) {
      this.progressCallbacks.set(exportId, onProgress);
    }

    try {
      this.reportProgress(exportId, {
        percentage: 0,
        stage: 'preparing',
        message: 'Preparing alerts data export...',
        recordsProcessed: 0,
        totalRecords: alerts.length,
      });

      // Filter alerts by date range
      let filteredAlerts = alerts;
      if (options.dateRange) {
        filteredAlerts = alerts.filter(alert => {
          const alertDate = new Date(alert.timestamp);
          return alertDate >= options.dateRange!.start && alertDate <= options.dateRange!.end;
        });
      }

      this.reportProgress(exportId, {
        percentage: 50,
        stage: 'generating',
        message: `Generating ${options.format.toUpperCase()} file...`,
        recordsProcessed: filteredAlerts.length,
        totalRecords: filteredAlerts.length,
      });

      // Process alert data
      const processedAlerts = this.processAlertData(filteredAlerts, options.fields);

      // Generate content
      let content: string;
      let mimeType: string;

      if (options.format === 'csv') {
        content = this.generateCSV(processedAlerts, options.includeHeaders !== false);
        mimeType = 'text/csv';
      } else {
        content = this.generateJSON(processedAlerts);
        mimeType = 'application/json';
      }

      const filename = options.filename || this.generateFilename('alerts', options.format);
      const blob = new Blob([content], { type: mimeType });
      const downloadUrl = this.createDownloadUrl(blob, filename);

      this.reportProgress(exportId, {
        percentage: 100,
        stage: 'complete',
        message: 'Export completed successfully!',
        recordsProcessed: processedAlerts.length,
        totalRecords: filteredAlerts.length,
      });

      return {
        success: true,
        filename,
        size: blob.size,
        recordCount: processedAlerts.length,
        downloadUrl,
      };

    } catch (error) {
      return {
        success: false,
        filename: '',
        size: 0,
        recordCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      this.progressCallbacks.delete(exportId);
    }
  }

  // Generate CSV content
  private generateCSV(data: any[], includeHeaders: boolean = true): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvLines: string[] = [];

    if (includeHeaders) {
      csvLines.push(headers.map(h => this.escapeCSVField(h)).join(','));
    }

    data.forEach(row => {
      const csvRow = headers.map(header => {
        const value = row[header];
        return this.escapeCSVField(value);
      }).join(',');
      csvLines.push(csvRow);
    });

    return csvLines.join('\n');
  }

  // Generate JSON content
  private generateJSON(data: any[]): string {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        recordCount: data.length,
        source: 'AI Counselling System',
      },
      data: data,
    };

    return JSON.stringify(exportData, null, 2);
  }

  // Process student data for export
  private processStudentData(students: any[], fields?: string[]): any[] {
    return students.map(student => {
      const processedStudent: any = {
        id: student.id,
        name: student.name,
        email: student.email,
        grade: student.grade,
        riskLevel: student.riskLevel,
        lastActive: student.lastActive,
        enrollmentDate: student.enrollmentDate || student.createdAt,
        gpa: student.gpa,
        attendanceRate: student.attendanceRate,
        behaviorScore: student.behaviorScore,
        alertCount: student.alerts?.length || 0,
      };

      // Filter fields if specified
      if (fields && fields.length > 0) {
        const filteredStudent: any = {};
        fields.forEach(field => {
          if (processedStudent.hasOwnProperty(field)) {
            filteredStudent[field] = processedStudent[field];
          }
        });
        return filteredStudent;
      }

      return processedStudent;
    });
  }

  // Process alert data for export
  private processAlertData(alerts: any[], fields?: string[]): any[] {
    return alerts.map(alert => {
      const processedAlert: any = {
        id: alert.id,
        studentId: alert.studentId,
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        timestamp: alert.timestamp,
        resolved: alert.resolved,
        category: alert.category || 'general',
        source: alert.source || 'system',
      };

      if (fields && fields.length > 0) {
        const filteredAlert: any = {};
        fields.forEach(field => {
          if (processedAlert.hasOwnProperty(field)) {
            filteredAlert[field] = processedAlert[field];
          }
        });
        return filteredAlert;
      }

      return processedAlert;
    });
  }

  // Escape CSV field values
  private escapeCSVField(value: any): string {
    if (value === null || value === undefined) return '';
    
    const stringValue = String(value);
    
    // If the value contains comma, newline, or double quote, wrap in quotes
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      // Escape existing double quotes by doubling them
      const escapedValue = stringValue.replace(/"/g, '""');
      return `"${escapedValue}"`;
    }
    
    return stringValue;
  }

  // Generate filename with timestamp
  private generateFilename(type: string, format: string): string {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    return `${type}-export-${timestamp}.${format}`;
  }

  // Create download URL and trigger download
  private createDownloadUrl(blob: Blob, filename: string): string {
    const url = URL.createObjectURL(blob);
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
    return url;
  }

  // Generate unique export ID
  private generateExportId(): string {
    return `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Report progress to callback
  private reportProgress(exportId: string, progress: ExportProgress): void {
    const callback = this.progressCallbacks.get(exportId);
    if (callback) {
      callback(progress);
    }
  }

  // Get available fields for students
  getStudentFields(): { key: string; label: string; description: string }[] {
    return [
      { key: 'id', label: 'Student ID', description: 'Unique identifier' },
      { key: 'name', label: 'Full Name', description: 'Student full name' },
      { key: 'email', label: 'Email', description: 'Contact email address' },
      { key: 'grade', label: 'Grade', description: 'Current grade level' },
      { key: 'riskLevel', label: 'Risk Level', description: 'Current risk assessment' },
      { key: 'lastActive', label: 'Last Active', description: 'Last activity timestamp' },
      { key: 'enrollmentDate', label: 'Enrollment Date', description: 'Date of enrollment' },
      { key: 'gpa', label: 'GPA', description: 'Grade point average' },
      { key: 'attendanceRate', label: 'Attendance Rate', description: 'Attendance percentage' },
      { key: 'behaviorScore', label: 'Behavior Score', description: 'Behavioral assessment score' },
      { key: 'alertCount', label: 'Alert Count', description: 'Number of active alerts' },
    ];
  }

  // Get available fields for alerts
  getAlertFields(): { key: string; label: string; description: string }[] {
    return [
      { key: 'id', label: 'Alert ID', description: 'Unique alert identifier' },
      { key: 'studentId', label: 'Student ID', description: 'Associated student ID' },
      { key: 'title', label: 'Title', description: 'Alert title' },
      { key: 'message', label: 'Message', description: 'Alert description' },
      { key: 'severity', label: 'Severity', description: 'Alert severity level' },
      { key: 'timestamp', label: 'Timestamp', description: 'When alert was created' },
      { key: 'resolved', label: 'Resolved', description: 'Resolution status' },
      { key: 'category', label: 'Category', description: 'Alert category' },
      { key: 'source', label: 'Source', description: 'Alert source system' },
    ];
  }

  // Format file size for display
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default DataExportService;