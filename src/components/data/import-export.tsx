'use client'

import { useState } from 'react'
import { Upload, Download, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'

interface ImportExportProps {
  onImportComplete?: (data: any[]) => void
}

export function ImportExport({ onImportComplete }: ImportExportProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [importResult, setImportResult] = useState<{
    success: boolean
    message: string
    data?: any[]
  } | null>(null)

  const handleExport = async (format: 'csv' | 'excel') => {
    setIsExporting(true)
    try {
      const response = await fetch(`/api/data/export?format=${format}`)
      
      if (!response.ok) {
        throw new Error('Export failed')
      }

      // Get filename from headers or create default
      const contentDisposition = response.headers.get('content-disposition')
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `leaf_data.${format === 'excel' ? 'xlsx' : 'csv'}`

      // Create blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export error:', error)
      setImportResult({
        success: false,
        message: 'Failed to export data'
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/data/import', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        setImportResult({
          success: true,
          message: `Successfully imported ${result.imported} records`,
          data: result.data
        })
        onImportComplete?.(result.data)
      } else {
        setImportResult({
          success: false,
          message: result.error || 'Import failed'
        })
      }
    } catch (error) {
      console.error('Import error:', error)
      setImportResult({
        success: false,
        message: 'Failed to import data'
      })
    } finally {
      setIsImporting(false)
      // Reset file input
      event.target.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Export Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleExport('csv')}
          disabled={isExporting}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </button>
        <button
          onClick={() => handleExport('excel')}
          disabled={isExporting}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileText className="w-4 h-4" />
          {isExporting ? 'Exporting...' : 'Export Excel'}
        </button>
      </div>

      {/* Import Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Import Data</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload CSV or Excel files with leaf monitoring data
          </p>
          
          <label className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            {isImporting ? 'Importing...' : 'Choose File'}
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleImport}
              disabled={isImporting}
              className="hidden"
            />
          </label>
          
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: CSV, XLSX, XLS
          </p>
        </div>
      </div>

      {/* Import Result */}
      {importResult && (
        <div className={`rounded-lg p-4 ${
          importResult.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {importResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                importResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {importResult.success ? 'Success' : 'Error'}
              </p>
              <p className={`text-sm ${
                importResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {importResult.message}
              </p>
              {importResult.data && (
                <div className="mt-2">
                  <p className="text-xs text-green-600 mb-1">Imported data preview:</p>
                  <div className="bg-white rounded border border-green-200 p-2 max-h-32 overflow-y-auto">
                    <pre className="text-xs text-gray-700">
                      {JSON.stringify(importResult.data.slice(0, 3), null, 2)}
                      {importResult.data.length > 3 && '\n...'}
                    </pre>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setImportResult(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Template Download */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Need a template?</h4>
        <p className="text-sm text-blue-700 mb-3">
          Download our template file to see the required format for importing data.
        </p>
        <button
          onClick={() => handleExport('csv')}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
        >
          Download Template
        </button>
      </div>
    </div>
  )
}