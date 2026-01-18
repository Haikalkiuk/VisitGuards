'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { 
  Download, Upload, FileText, Calendar, Filter, Search, TrendingUp, 
  AlertCircle, CheckCircle, AlertTriangle, XCircle, Eye, X
} from 'lucide-react'
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import { ImportExport } from '@/components/data/import-export'
import { getLeafData, type LeafData } from '@/lib/data-sync'
import { useSearchParams } from 'next/navigation'

// Mock data untuk tabel
const tableData = [
  {
    id: '1',
    date: new Date('2024-01-15T08:30:00'),
    plantId: 'VINE-001',
    status: 'healthy' as const,
    confidence: 0.95,
    location: 'Area A - Plot 1'
  },
  {
    id: '2',
    date: new Date('2024-01-15T09:15:00'),
    plantId: 'VINE-002',
    status: 'diseased' as const,
    confidence: 0.87,
    location: 'Area B - Plot 2'
  },
  {
    id: '3',
    date: new Date('2024-01-15T10:00:00'),
    plantId: 'VINE-003',
    status: 'pest' as const,
    confidence: 0.92,
    location: 'Area A - Plot 3'
  },
  {
    id: '4',
    date: new Date('2024-01-15T10:45:00'),
    plantId: 'VINE-004',
    status: 'nutrient_deficient' as const,
    confidence: 0.83,
    location: 'Area C - Plot 1'
  },
  {
    id: '5',
    date: new Date('2024-01-14T14:20:00'),
    plantId: 'VINE-005',
    status: 'healthy' as const,
    confidence: 0.96,
    location: 'Area B - Plot 1'
  },
]

export default function DataPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showDetailModal, setShowDetailModal] = useState<LeafData | null>(null)
  const [showInfoModal, setShowInfoModal] = useState<LeafData | null>(null)
  const [tableData, setTableData] = useState<LeafData[]>([])

  // Load URL parameters on component mount
  useEffect(() => {
    const locationParam = searchParams.get('location')
    const pointIdParam = searchParams.get('pointId')
    
    if (locationParam) {
      setSearchTerm(locationParam)
      // Show info message about filter
      setError(`🔍 Menampilkan data untuk lokasi: ${locationParam}`)
      setTimeout(() => setError(null), 5000)
    }
  }, [searchParams])

  // Load data from shared storage on component mount
  useEffect(() => {
    const loadData = () => {
      try {
        const data = getLeafData()
        setTableData(data.length > 0 ? data : [
          // Fallback to mock data if no data exists
          {
            id: '1',
            date: new Date('2024-01-15T08:30:00'),
            plantId: 'VINE-001',
            status: 'healthy' as const,
            confidence: 0.95,
            location: 'Area A - Plot 1'
          },
          {
            id: '2',
            date: new Date('2024-01-15T09:15:00'),
            plantId: 'VINE-002',
            status: 'diseased' as const,
            confidence: 0.87,
            location: 'Area B - Plot 2'
          },
          {
            id: '3',
            date: new Date('2024-01-15T10:00:00'),
            plantId: 'VINE-003',
            status: 'pest' as const,
            confidence: 0.92,
            location: 'Area A - Plot 3'
          },
          {
            id: '4',
            date: new Date('2024-01-15T10:45:00'),
            plantId: 'VINE-004',
            status: 'nutrient_deficient' as const,
            confidence: 0.83,
            location: 'Area C - Plot 1'
          },
          {
            id: '5',
            date: new Date('2024-01-14T14:20:00'),
            plantId: 'VINE-005',
            status: 'healthy' as const,
            confidence: 0.96,
            location: 'Area B - Plot 1'
          }
        ])
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Gagal memuat data')
      }
    }

    loadData()

    // Set up interval to refresh data (simulating real-time updates)
    const interval = setInterval(loadData, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const filteredTableData = useMemo(() => {
    try {
      return tableData.filter(item => {
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus
        const matchesSearch = item.plantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.location.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesStatus && matchesSearch
      })
    } catch (err) {
      console.error('Error filtering data:', err)
      return tableData
    }
  }, [filterStatus, searchTerm])

  const handleImportComplete = (data: any[]) => {
    try {
      console.log('Import completed:', data)
    } catch (err) {
      console.error('Import error:', err)
      setError('Gagal mengimpor data')
    }
  }

  const handleRowClick = (id: string) => {
    try {
      setSelectedRow(id)
      console.log('Row clicked:', id)
    } catch (err) {
      console.error('Row click error:', err)
    }
  }

  const handleActionClick = (action: string, id: string) => {
    try {
      const item = tableData.find(item => item.id === id)
      if (!item) return

      switch (action) {
        case 'view':
          setShowDetailModal(item)
          break
        case 'download':
          downloadSingleItem(item)
          break
        case 'info':
          setShowInfoModal(item)
          break
        default:
          console.log('Unknown action:', action, id)
      }
    } catch (err) {
      console.error('Action click error:', err)
      setError('Gagal menjalankan aksi')
    }
  }

  const downloadSingleItem = (item: LeafData) => {
    try {
      // Create CSV content for single item
      const csvContent = [
        'ID,Tanggal,Plant ID,Status,Confidence,Lokasi,Sumber',
        `${item.id},${formatDate(item.date)},${item.plantId},${item.status},${(item.confidence * 100).toFixed(1)}%,${item.location},${item.source || 'auto'}`
      ].join('\n')

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      const href = url

      link.setAttribute('href', href)
      link.setAttribute('download', `leaf_data_${item.plantId}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up
      window.URL.revokeObjectURL(url)

      // Show success message
      setError(`✅ Berhasil mendownload data ${item.plantId}`)
      setTimeout(() => setError(null), 3000)
    } catch (error) {
      console.error('Download error:', error)
      setError('Gagal mendownload data')
    }
  }

  const downloadSelectedItems = () => {
    try {
      const selectedItems = selectedRow 
        ? tableData.filter(item => item.id === selectedRow)
        : filteredTableData

      if (selectedItems.length === 0) {
        setError('⚠ Tidak ada data yang dipilih untuk di-download')
        setTimeout(() => setError(null), 3000)
        return
      }

      // Create CSV content for multiple items
      const csvContent = [
        'ID,Tanggal,Plant ID,Status,Confidence,Lokasi,Sumber',
        ...selectedItems.map(item => 
          `${item.id},${formatDate(item.date)},${item.plantId},${item.status},${(item.confidence * 100).toFixed(1)}%,${item.location},${item.source || 'auto'}`
        )
      ].join('\n')

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      const href = url

      link.setAttribute('href', href)
      link.setAttribute('download', `leaf_data_batch_${selectedItems.length}_items.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up
      window.URL.revokeObjectURL(url)

      // Show success message
      setError(`✅ Berhasil mendownload ${selectedItems.length} data`)
      setTimeout(() => setError(null), 3000)
    } catch (error) {
      console.error('Batch download error:', error)
      setError('Gagal mendownload data batch')
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className={`mb-6 rounded-lg p-4 flex items-center gap-3 ${
            error.includes('✅') 
              ? 'bg-green-50 border border-green-200' 
              : error.includes('🔍') 
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className={`w-5 h-5 flex-shrink-0 ${
              error.includes('✅') 
                ? 'text-green-600' 
                : error.includes('🔍')
                ? 'text-blue-600'
                : 'text-red-600'
            }`}>
              {error.includes('✅') ? '✓' : error.includes('🔍') ? '🔍' : '⚠'}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${
                error.includes('✅') 
                  ? 'text-green-800' 
                  : error.includes('🔍')
                  ? 'text-blue-800'
                  : 'text-red-800'
              }`}>
                {error.includes('✅') ? 'Sukses' : error.includes('🔍') ? 'Filter Aktif' : 'Terjadi Kesalahan'}
              </p>
              <p className={`text-sm ${
                error.includes('✅') 
                  ? 'text-green-700' 
                  : error.includes('🔍')
                  ? 'text-blue-700'
                  : 'text-red-600'
              }`}>
                {error}
              </p>
            </div>
            <button
              onClick={() => setError(null)}
              className={`${
                error.includes('✅') 
                  ? 'text-green-400 hover:text-green-600' 
                  : error.includes('🔍')
                  ? 'text-blue-400 hover:text-blue-600'
                  : 'text-red-400 hover:text-red-600'
              }`}
            >
              ×
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Data Daun</h1>
              <p className="text-gray-600 mt-2">
                Analisis komprehensif perkembangan daun anggur dengan tabel terstruktur
              </p>
            </div>
            <div className="flex items-center gap-3">
              {searchParams.get('location') && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    window.history.pushState({}, '', '/data')
                  }}
                  className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear Filter
                </button>
              )}
              <button
                onClick={() => setSelectedRow(null)}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear Selection
              </button>
              <button
                onClick={downloadSelectedItems}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Selected ({selectedRow ? '1' : filteredTableData.length})
              </button>
              <ImportExport onImportComplete={handleImportComplete} />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Data</p>
                <p className="text-2xl font-bold text-gray-900">{tableData.length}</p>
                <p className="text-xs text-green-600 mt-1">+12% dari bulan lalu</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tanaman Sehat</p>
                <p className="text-2xl font-bold text-green-600">
                  {tableData.filter(item => item.status === 'healthy').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">{Math.round(tableData.filter(item => item.status === 'healthy').length / tableData.length * 100)}% total</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Perlu Perhatian</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {tableData.filter(item => item.status === 'pest' || item.status === 'nutrient_deficient').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Memerlukan tindakan</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terdeteksi Sakit</p>
                <p className="text-2xl font-bold text-red-600">
                  {tableData.filter(item => item.status === 'diseased').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Perlu treatment</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Simple Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Status Distribution</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                  <span className="font-medium">Sehat</span>
                </div>
                <span className="text-green-700 font-bold">
                  {tableData.filter(item => item.status === 'healthy').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                  <span className="font-medium">Sakit</span>
                </div>
                <span className="text-red-700 font-bold">
                  {tableData.filter(item => item.status === 'diseased').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
                  <span className="font-medium">Hama</span>
                </div>
                <span className="text-yellow-700 font-bold">
                  {tableData.filter(item => item.status === 'pest').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
                  <span className="font-medium">Kekurangan Nutrisi</span>
                </div>
                <span className="text-orange-700 font-bold">
                  {tableData.filter(item => item.status === 'nutrient_deficient').length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Stats</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Confidence Rata-rata</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(tableData.reduce((acc, item) => acc + item.confidence, 0) / tableData.length * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Lokasi Termonitor</p>
                <p className="text-2xl font-bold text-gray-900">
                  {[...new Set(tableData.map(item => item.location))].length}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Update Terakhir</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatDate(new Date())}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Data Detail</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari Plant ID atau lokasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="all">Semua Status</option>
                    <option value="healthy">Sehat</option>
                    <option value="diseased">Sakit</option>
                    <option value="pest">Hama</option>
                    <option value="nutrient_deficient">Kekurangan Nutrisi</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Results count */}
            <div className="mt-4 text-sm text-gray-600">
              Menampilkan {filteredTableData.length} dari {tableData.length} data
            </div>
          </div>
          
          <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Tanaman
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Deteksi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sumber
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTableData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-gray-400" />
                        <p>Tidak ada data yang ditemukan</p>
                        <p className="text-sm">Coba ubah filter atau kata kunci pencarian</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTableData.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedRow === item.id ? 'bg-green-50 border-l-4 border-green-500' : ''
                      }`}
                      onClick={() => handleRowClick(item.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.plantId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-500 ease-out" 
                              style={{ width: `${item.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="font-medium text-xs">{(item.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.source === 'manual' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {item.source === 'manual' ? 'Manual' : 'Otomatis'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <button 
                            className={`p-2 rounded-lg transition-all ${
                              selectedRow === item.id 
                                ? 'bg-green-100 text-green-700' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            onClick={() => handleActionClick('view', item.id)}
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className={`p-2 rounded-lg transition-all ${
                              selectedRow === item.id 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'text-blue-600 hover:bg-blue-50'
                            }`}
                            onClick={() => handleActionClick('download', item.id)}
                            title="Download Data"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            className={`p-2 rounded-lg transition-all ${
                              selectedRow === item.id 
                                ? 'bg-gray-100 text-gray-700' 
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                            onClick={() => handleActionClick('info', item.id)}
                            title="Info Lengkap"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Detail Data Tanaman</h3>
                    <p className="text-gray-600">{showDetailModal.plantId}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Informasi Umum</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID Tanaman:</span>
                        <span className="font-medium">{showDetailModal.plantId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lokasi:</span>
                        <span className="font-medium">{showDetailModal.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tanggal:</span>
                        <span className="font-medium">{formatDate(showDetailModal.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sumber:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          showDetailModal.source === 'manual' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {showDetailModal.source === 'manual' ? 'Manual' : 'Otomatis'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Status Deteksi</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(showDetailModal.status)}`}>
                          {getStatusLabel(showDetailModal.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confidence:</span>
                        <span className="font-medium">{(showDetailModal.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => downloadSingleItem(showDetailModal)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Data
                  </button>
                  <button
                    onClick={() => setShowDetailModal(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Modal */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Informasi Lengkap</h3>
                    <p className="text-gray-600">{showInfoModal.plantId}</p>
                  </div>
                  <button
                    onClick={() => setShowInfoModal(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Data Monitoring</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">ID:</span> {showInfoModal.id}</p>
                      <p><span className="font-medium">Plant ID:</span> {showInfoModal.plantId}</p>
                      <p><span className="font-medium">Status:</span> {getStatusLabel(showInfoModal.status)}</p>
                      <p><span className="font-medium">Confidence:</span> {(showInfoModal.confidence * 100).toFixed(1)}%</p>
                      <p><span className="font-medium">Lokasi:</span> {showInfoModal.location}</p>
                      <p><span className="font-medium">Tanggal:</span> {formatDate(showInfoModal.date)}</p>
                      <p><span className="font-medium">Sumber:</span> 
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          showInfoModal.source === 'manual' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {showInfoModal.source === 'manual' ? 'Manual' : 'Otomatis'}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Rekomendasi</h4>
                    <p className="text-sm text-gray-700">
                      {showInfoModal.status === 'healthy' 
                        ? 'Tanaman dalam kondisi baik. Lanjutkan perawatan rutin.'
                        : showInfoModal.status === 'diseased'
                        ? 'Tanaman terdeteksi penyakit. Segera lakukan treatment.'
                        : showInfoModal.status === 'pest'
                        ? 'Tanaman terdeteksi hama. Segera lakukan pest control.'
                        : 'Tanaman kekurangan nutrisi. Tambahkan pupuk yang sesuai.'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowInfoModal(null)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}