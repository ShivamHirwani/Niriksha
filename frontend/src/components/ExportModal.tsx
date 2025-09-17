import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Database, Calendar, CheckSquare, Square, Eye, Settings } from 'lucide-react';
import DataExportService, { ExportOptions, ExportProgress, ExportResult } from '../services/DataExportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  dataType: 'students' | 'alerts';
  title?: string;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  data,
  dataType,
  title = 'Export Data'
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeHeaders: true,
    fields: [],
    filename: '',
  });

  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const exportService = DataExportService.getInstance();
  const availableFields = dataType === 'students' 
    ? exportService.getStudentFields() 
    : exportService.getAlertFields();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setExportResult(null);
      setExportProgress(null);
      setIsExporting(false);
      setShowPreview(false);
      setSelectedFields(new Set(availableFields.map(f => f.key)));
      setExportOptions(prev => ({
        ...prev,
        fields: availableFields.map(f => f.key),
        filename: '',
      }));
    }
  }, [isOpen, dataType]);

  // Update export options when fields change
  useEffect(() => {
    setExportOptions(prev => ({
      ...prev,
      fields: Array.from(selectedFields),
    }));
  }, [selectedFields]);

  const handleFieldToggle = (fieldKey: string) => {
    const newSelected = new Set(selectedFields);
    if (newSelected.has(fieldKey)) {
      newSelected.delete(fieldKey);
    } else {
      newSelected.add(fieldKey);
    }
    setSelectedFields(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedFields.size === availableFields.length) {
      setSelectedFields(new Set());
    } else {
      setSelectedFields(new Set(availableFields.map(f => f.key)));
    }
  };

  const generatePreview = () => {
    const fieldsToShow = Array.from(selectedFields);
    const sampleData = data.slice(0, 5).map(item => {
      const filtered: any = {};
      fieldsToShow.forEach(field => {
        if (item.hasOwnProperty(field)) {
          filtered[field] = item[field];
        }
      });
      return filtered;
    });
    setPreviewData(sampleData);
    setShowPreview(true);
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportResult(null);

    const options: ExportOptions = {
      ...exportOptions,
      filename: exportOptions.filename || undefined,
    };

    try {
      let result: ExportResult;
      
      if (dataType === 'students') {
        result = await exportService.exportStudents(data, options, setExportProgress);
      } else {
        result = await exportService.exportAlerts(data, options, setExportProgress);
      }

      setExportResult(result);
    } catch (error) {
      setExportResult({
        success: false,
        filename: '',
        size: 0,
        recordCount: 0,
        error: error instanceof Error ? error.message : 'Export failed',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    return exportService.formatFileSize(bytes);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm transition-opacity"
        style={{ backgroundColor: 'var(--bg-overlay)' }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-xl transition-all transform animate-scale-in"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b" style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          borderColor: 'var(--border-primary)' 
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl" style={{ background: 'var(--gradient-primary)' }}>
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-heading-3 font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </h2>
                <p className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>
                  Export {data.length} {dataType} records
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-xl transition-smooth hover:scale-101 active:scale-98"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
              aria-label="Close export modal"
            >
              <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          {!showPreview ? (
            <div className="space-y-6">
              {/* Export Format */}
              <div>
                <h3 className="text-body font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Export Format
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => setExportOptions(prev => ({ ...prev, format: 'csv' }))}
                    className={`
                      flex items-center space-x-3 p-4 rounded-xl border transition-smooth hover:scale-101
                      ${exportOptions.format === 'csv' ? 'shadow-glass' : ''}
                    `}
                    style={{
                      backgroundColor: exportOptions.format === 'csv' ? 'var(--color-primary-50)' : 'var(--bg-secondary)',
                      borderColor: exportOptions.format === 'csv' ? 'var(--color-primary-200)' : 'var(--border-primary)',
                      color: exportOptions.format === 'csv' ? 'var(--color-primary-700)' : 'var(--text-primary)'
                    }}
                  >
                    <FileText className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-medium">CSV Format</p>
                      <p className="text-body-sm opacity-70">Comma-separated values, works with Excel</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setExportOptions(prev => ({ ...prev, format: 'json' }))}
                    className={`
                      flex items-center space-x-3 p-4 rounded-xl border transition-smooth hover:scale-101
                      ${exportOptions.format === 'json' ? 'shadow-glass' : ''}
                    `}
                    style={{
                      backgroundColor: exportOptions.format === 'json' ? 'var(--color-primary-50)' : 'var(--bg-secondary)',
                      borderColor: exportOptions.format === 'json' ? 'var(--color-primary-200)' : 'var(--border-primary)',
                      color: exportOptions.format === 'json' ? 'var(--color-primary-700)' : 'var(--text-primary)'
                    }}
                  >
                    <Database className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-medium">JSON Format</p>
                      <p className="text-body-sm opacity-70">Structured data with metadata</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* CSV Options */}
              {exportOptions.format === 'csv' && (
                <div>
                  <h3 className="text-body font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    CSV Options
                  </h3>
                  <label className="flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-smooth hover:scale-101"
                         style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <input
                      type="checkbox"
                      checked={exportOptions.includeHeaders !== false}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, includeHeaders: e.target.checked }))}
                      className="rounded border-2 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Include Headers</p>
                      <p className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>Add column names as first row</p>
                    </div>
                  </label>
                </div>
              )}

              {/* Field Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-body font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Fields to Export ({selectedFields.size} of {availableFields.length})
                  </h3>
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center space-x-2 px-3 py-1 rounded-lg transition-smooth hover:scale-101"
                    style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}
                  >
                    {selectedFields.size === availableFields.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    <span className="text-body-sm">
                      {selectedFields.size === availableFields.length ? 'Deselect All' : 'Select All'}
                    </span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {availableFields.map((field) => (
                    <label
                      key={field.key}
                      className="flex items-start space-x-3 p-3 rounded-xl cursor-pointer transition-smooth hover:scale-101"
                      style={{ backgroundColor: 'var(--bg-secondary)' }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFields.has(field.key)}
                        onChange={() => handleFieldToggle(field.key)}
                        className="mt-0.5 rounded border-2 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{field.label}</p>
                        <p className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>{field.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Filename */}
              <div>
                <h3 className="text-body font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Custom Filename (Optional)
                </h3>
                <input
                  type="text"
                  value={exportOptions.filename}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, filename: e.target.value }))}
                  placeholder={`${dataType}-export-${new Date().toISOString().slice(0, 10)}`}
                  className="w-full px-4 py-3 rounded-xl border transition-smooth focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--color-primary-500)'
                  } as React.CSSProperties}
                />
              </div>
            </div>
          ) : (
            /* Preview Section */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-body font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Export Preview (First 5 records)
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex items-center space-x-2 px-3 py-1 rounded-lg transition-smooth hover:scale-101"
                  style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-body-sm">Back to Settings</span>
                </button>
              </div>
              
              <div className="overflow-auto rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                <table className="w-full text-body-sm">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      {Array.from(selectedFields).map(field => (
                        <th key={field} className="px-4 py-3 text-left font-medium" style={{ color: 'var(--text-primary)' }}>
                          {availableFields.find(f => f.key === field)?.label || field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index} className="border-t" style={{ borderColor: 'var(--border-primary)' }}>
                        {Array.from(selectedFields).map(field => (
                          <td key={field} className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                            {String(row[field] || '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Export Progress */}
          {isExporting && exportProgress && (
            <div className="mt-6 p-4 rounded-xl border" style={{ 
              backgroundColor: 'var(--color-primary-50)',
              borderColor: 'var(--color-primary-200)'
            }}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium" style={{ color: 'var(--color-primary-700)' }}>
                  {exportProgress.message}
                </p>
                <span className="text-body-sm" style={{ color: 'var(--color-primary-600)' }}>
                  {exportProgress.percentage}%
                </span>
              </div>
              <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${exportProgress.percentage}%`,
                    background: 'var(--gradient-primary)'
                  }}
                />
              </div>
              <p className="text-body-sm mt-2" style={{ color: 'var(--color-primary-600)' }}>
                {exportProgress.recordsProcessed} of {exportProgress.totalRecords} records processed
              </p>
            </div>
          )}

          {/* Export Result */}
          {exportResult && (
            <div className={`mt-6 p-4 rounded-xl border ${exportResult.success ? '' : 'animate-shake'}`} style={{ 
              backgroundColor: exportResult.success ? 'var(--color-success-50)' : 'var(--color-danger-50)',
              borderColor: exportResult.success ? 'var(--color-success-200)' : 'var(--color-danger-200)'
            }}>
              {exportResult.success ? (
                <div>
                  <p className="font-medium mb-2" style={{ color: 'var(--color-success-700)' }}>
                    Export completed successfully!
                  </p>
                  <div className="text-body-sm space-y-1" style={{ color: 'var(--color-success-600)' }}>
                    <p>• File: {exportResult.filename}</p>
                    <p>• Size: {formatFileSize(exportResult.size)}</p>
                    <p>• Records: {exportResult.recordCount}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-medium mb-2" style={{ color: 'var(--color-danger-700)' }}>
                    Export failed
                  </p>
                  <p className="text-body-sm" style={{ color: 'var(--color-danger-600)' }}>
                    {exportResult.error}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 border-t" style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          borderColor: 'var(--border-primary)' 
        }}>
          <div className="flex items-center justify-between">
            <p className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>
              {selectedFields.size} fields selected • {data.length} records
            </p>
            <div className="flex items-center space-x-3">
              {!showPreview && selectedFields.size > 0 && (
                <button
                  onClick={generatePreview}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-smooth hover:scale-101 active:scale-99"
                  style={{ 
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
              )}
              <button
                onClick={handleExport}
                disabled={isExporting || selectedFields.size === 0}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-xl font-medium 
                  transition-smooth transform hover:scale-101 active:scale-99
                  ${isExporting || selectedFields.size === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                style={{ 
                  background: 'var(--gradient-primary)',
                  color: 'white'
                }}
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export {exportOptions.format.toUpperCase()}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;