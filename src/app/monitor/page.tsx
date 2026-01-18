'use client'

import { useState } from 'react'
import { Layout } from '@/components/layout'
import { Camera, Download, RefreshCw, Calendar, Filter, Search, Eye, Grid, List, CameraIcon, ImageIcon } from 'lucide-react'
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import { addLeafData, createLeafDataFromCapture, getLeafData, type LeafData } from '@/lib/data-sync'
import { monitoringPoints, type MonitoringPoint } from '@/lib/monitoring-data'
import Image from 'next/image'

// Convert monitoring points to image data format
const mockImages = monitoringPoints.map((point, index) => ({
  id: point.id,
  plantId: point.plantId,
  date: point.lastUpdate,
  status: point.healthyPlants === point.totalPlants ? 'healthy' as const : 
         point.diseasedPlants > 0 ? 'diseased' as const : 
         'pest' as const,
  confidence: 0.8 + Math.random() * 0.2,
  imageUrl: '/api/placeholder/400/300',
  location: point.description
}))

export default function MonitorPage() {
  const [images, setImages] = useState(mockImages)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedImage, setSelectedImage] = useState<typeof mockImages[0] | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [capturingImageId, setCapturingImageId] = useState<string | null>(null)
  const [lastCaptureTime, setLastCaptureTime] = useState<Date | null>(null)

  const filteredImages = images.filter(image => {
    const matchesStatus = filterStatus === 'all' || image.status === filterStatus
    const matchesSearch = image.plantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleRefresh = () => {
    // Simulasi refresh data
    setImages([...images])
  }

  const handleCapture = async (cameraId?: string) => {
    const captureId = cameraId || `CAM-${Date.now()}`
    setCapturingImageId(captureId)
    
    try {
      // Simulasi proses capture gambar dengan kamera
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate status dan lokasi acak dari monitoring points
      const statuses: Array<'healthy' | 'diseased' | 'pest' | 'nutrient_deficient'> = ['healthy', 'diseased', 'pest', 'nutrient_deficient']
      const randomPoint = monitoringPoints[Math.floor(Math.random() * monitoringPoints.length)]
      
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const confidence = 0.8 + Math.random() * 0.2
      const location = randomPoint.description
      
      // Create leaf data using the sync utility
      const newLeafData = createLeafDataFromCapture(captureId, status, confidence, location, 'manual')
      
      // Save to shared storage
      addLeafData(newLeafData)
      
      // Generate image data for gallery display
      const newImage: typeof mockImages[0] = {
        id: newLeafData.id,
        plantId: newLeafData.plantId,
        date: newLeafData.date,
        status: newLeafData.status,
        confidence: newLeafData.confidence,
        imageUrl: '/api/placeholder/400/300',
        location: newLeafData.location
      }
      
      // Add new image to the beginning of the array
      setImages(prev => [newImage, ...prev])
      setLastCaptureTime(new Date)
      
      // Show success message dengan detail
      const statusText = getStatusLabel(newLeafData.status)
      const cameraInfo = cameraId ? ` dari kamera ${cameraId}` : ''
      alert(`✅ Gambar berhasil ditangkap${cameraInfo}!\n\n📊 Detail:\n• Plant ID: ${newLeafData.plantId}\n• Lokasi: ${newLeafData.location}\n• Status: ${statusText}\n• Confidence: ${(newLeafData.confidence * 100).toFixed(1)}%\n• Waktu: ${new Date().toLocaleString('id-ID')}\n\n💾 Data otomatis tersimpan ke Data Daun`)
      
    } catch (error) {
      console.error('Error capturing image:', error)
      alert('❌ Gagal menangkap gambar. Silakan coba lagi.')
    } finally {
      setCapturingImageId(null)
    }
  }

  const handleDownload = (image: typeof mockImages[0]) => {
    // Simulasi download
    console.log('Downloading image:', image.id)
    alert(`Mengunduh gambar ${image.plantId}...`)
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">IoT Monitor</h1>
              <p className="text-gray-600 mt-2">
                Galeri foto hasil tangkapan kamera sensor untuk monitoring perkembangan daun anggur. 
                Sistem dilengkapi penjadwalan otomatis dan fungsi capture manual real-time.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              {lastCaptureTime && (
                <div className="text-sm text-gray-600">
                  Last capture: {lastCaptureTime.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan ID atau lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
              >
                <option value="all">Semua Status</option>
                <option value="healthy">Sehat</option>
                <option value="diseased">Sakit</option>
                <option value="pest">Hama</option>
                <option value="nutrient_deficient">Kekurangan Nutrisi</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Images</p>
                <p className="text-2xl font-bold text-gray-900">{images.length}</p>
              </div>
              <Camera className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Healthy</p>
                <p className="text-2xl font-bold text-green-600">
                  {images.filter(img => img.status === 'healthy').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Need Attention</p>
                <p className="text-2xl font-bold text-red-600">
                  {images.filter(img => img.status !== 'healthy').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-red-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Confidence</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(images.reduce((acc, img) => acc + img.confidence, 0) / images.length * 100).toFixed(1)}%
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Capture Schedule Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CameraIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Penjadwalan Otomatis & Manual Capture</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Otomatis:</strong> Sistem menangkap gambar secara otomatis setiap jam pada siang hari (08:00 - 17:00) untuk monitoring rutin.</p>
                <p><strong>Manual:</strong> Gunakan tombol "Capture" pada setiap kamera untuk mengambil gambar secara real-time dari kamera spesifik jika terdapat kejadian penting.</p>
                {lastCaptureTime && (
                  <p><strong>Capture Terakhir:</strong> {lastCaptureTime.toLocaleString('id-ID')}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Images Gallery */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div key={image.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-w-16 aspect-h-12 bg-gray-100">
                  <div className="w-full h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{image.plantId}</h3>
                        {image.id.startsWith('CAP-') && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            Manual
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{image.location}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(image.status)}`}>
                      {getStatusLabel(image.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tanggal:</span>
                      <span className="text-gray-900">{formatDate(image.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confidence:</span>
                      <span className="text-gray-900">{(image.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setSelectedImage(image)}
                      className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Detail
                    </button>
                    <button
                      onClick={() => handleCapture(image.id)}
                      disabled={capturingImageId === image.id}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg transition-colors text-sm ${
                        capturingImageId === image.id
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {capturingImageId === image.id ? (
                        <>
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                          Capturing
                        </>
                      ) : (
                        <>
                          <CameraIcon className="w-4 h-4" />
                          Capture
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDownload(image)}
                      className="flex-1 flex items-center justify-center gap-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plant ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredImages.map((image) => (
                    <tr key={image.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded flex items-center justify-center">
                          <Camera className="w-6 h-6 text-gray-400" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          {image.plantId}
                          {image.id.startsWith('CAP-') && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                              Manual
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {image.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(image.status)}`}>
                          {getStatusLabel(image.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(image.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(image.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-1">
                          <button
                            onClick={() => setSelectedImage(image)}
                            className="p-1 text-green-600 hover:text-green-700"
                            title="Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCapture(image.id)}
                            disabled={capturingImageId === image.id}
                            className={`p-1 ${
                              capturingImageId === image.id
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-blue-600 hover:text-blue-700'
                            }`}
                            title="Capture"
                          >
                            {capturingImageId === image.id ? (
                              <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <CameraIcon className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDownload(image)}
                            className="p-1 text-gray-600 hover:text-gray-700"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Image Detail Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedImage.plantId}</h2>
                    <p className="text-gray-600">{selectedImage.location}</p>
                  </div>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="w-full h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                      <Camera className="w-16 h-16 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Detection Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedImage.status)}`}>
                            {getStatusLabel(selectedImage.status)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Confidence:</span>
                          <span className="font-medium">{(selectedImage.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Capture Date:</span>
                          <span className="font-medium">{formatDate(selectedImage.date)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDownload(selectedImage)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download Image
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}