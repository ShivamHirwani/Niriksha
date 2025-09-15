import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, Download } from 'lucide-react';

const DataImport: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [importResults, setImportResults] = useState<any>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    setImportStatus('processing');
    
    // Simulate file processing
    setTimeout(() => {
      setImportStatus('success');
      setImportResults({
        processed: 150,
        updated: 145,
        errors: 5,
        newStudents: 12
      });
    }, 2000);
  };

  const downloadTemplate = (type: string) => {
    // In a real app, this would download actual templates
    const templates = {
      attendance: 'attendance_template.csv',
      grades: 'grades_template.csv',
      students: 'students_template.csv'
    };
    
    alert(`Downloading ${templates[type as keyof typeof templates]} template...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Import</h1>
        <p className="text-gray-600 mt-1">Import student data from spreadsheets and external systems</p>
      </div>

      {/* Templates Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Templates</h3>
        <p className="text-gray-600 mb-4">
          Use these templates to ensure your data is formatted correctly before importing.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { type: 'students', title: 'Student Information', description: 'Basic student details and contact info' },
            { type: 'attendance', title: 'Attendance Records', description: 'Daily attendance tracking data' },
            { type: 'grades', title: 'Academic Records', description: 'Test scores and grade information' }
          ].map((template) => (
            <div key={template.type} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <FileSpreadsheet className="w-8 h-8 text-green-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{template.title}</h4>
                  <p className="text-sm text-gray-500">{template.description}</p>
                </div>
              </div>
              <button
                onClick={() => downloadTemplate(template.type)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                <span>Download Template</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Data Files</h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="mx-auto">
              {importStatus === 'processing' ? (
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              ) : (
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              )}
            </div>
            
            {importStatus === 'idle' && (
              <>
                <div>
                  <p className="text-lg font-medium text-gray-900">Drop files here or click to upload</p>
                  <p className="text-gray-500">Supports CSV, Excel (.xlsx), and JSON files</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".csv,.xlsx,.json"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  Select Files
                </label>
              </>
            )}

            {importStatus === 'processing' && (
              <div>
                <p className="text-lg font-medium text-gray-900">Processing files...</p>
                <p className="text-gray-500">Please wait while we import your data</p>
              </div>
            )}

            {importStatus === 'success' && importResults && (
              <div className="space-y-4">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">Import Successful!</p>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="font-medium text-blue-900">{importResults.processed}</p>
                      <p className="text-blue-600">Records Processed</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="font-medium text-green-900">{importResults.updated}</p>
                      <p className="text-green-600">Successfully Updated</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="font-medium text-purple-900">{importResults.newStudents}</p>
                      <p className="text-purple-600">New Students</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="font-medium text-red-900">{importResults.errors}</p>
                      <p className="text-red-600">Errors</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setImportStatus('idle');
                    setImportResults(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Import More Files
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Import History */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Imports</h3>
        
        <div className="space-y-3">
          {[
            { file: 'attendance_november.csv', date: '2024-01-15', status: 'success', records: 1250 },
            { file: 'student_grades_q4.xlsx', date: '2024-01-14', status: 'success', records: 890 },
            { file: 'new_students.csv', date: '2024-01-13', status: 'error', records: 45 }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileSpreadsheet className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{item.file}</p>
                  <p className="text-sm text-gray-500">{item.records} records • {item.date}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {item.status === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataImport;