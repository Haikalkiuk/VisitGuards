'use client'

import { useState, useEffect, useRef } from 'react'
import { Layout } from '@/components/layout'
import { MapPin, Navigation, Filter, Search, Info, Activity, Camera, Loader2 } from 'lucide-react'
import { monitoringPoints, type MonitoringPoint } from '@/lib/monitoring-data'

export default function MapsPage() {
  const [selectedPoint, setSelectedPoint] = useState<typeof monitoringPoints[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [mapLoading, setMapLoading] = useState(true)
  const [mapError, setMapError] = useState<string | null>(null)
  const [navigatingPoint, setNavigatingPoint] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  // Function to center map on specific point
  const centerMapOnPoint = (point: typeof monitoringPoints[0]) => {
    if (mapInstanceRef.current && window.L) {
      const L = window.L as any
      
      // Set navigating state for visual feedback
      setNavigatingPoint(point.id)
      
      // Add smooth pan animation
      mapInstanceRef.current.flyTo([point.latitude, point.longitude], 18, {
        duration: 1.5
      })
      
      // Find and open the popup for this marker after pan completes
      setTimeout(() => {
        const marker = markersRef.current.find(m => m.pointId === point.id)
        if (marker) {
          marker.openPopup()
        }
        // Clear navigating state
        setNavigatingPoint(null)
      }, 1500)
    }
  }

  // Handle point selection from list
  const handlePointSelect = (point: typeof monitoringPoints[0]) => {
    setSelectedPoint(point)
    centerMapOnPoint(point)
  }

  // Handle view detailed analytics
  const handleViewAnalytics = (point: typeof monitoringPoints[0]) => {
    // Navigate to Data Daun page with filter for this location
    const searchParams = new URLSearchParams({
      location: point.description,
      pointId: point.id
    })
    
    // Navigate to data page with filters
    window.location.href = `/data?${searchParams.toString()}`
  }

  useEffect(() => {
    // Initialize map after component mounts
    const initializeMap = async () => {
      try {
        setMapLoading(true)
        setMapError(null)

        // Load Leaflet CSS
        const leafletCss = document.createElement('link')
        leafletCss.rel = 'stylesheet'
        leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(leafletCss)

        // Load Leaflet JS
        const leafletScript = document.createElement('script')
        leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        leafletScript.onload = () => {
          // Initialize map after Leaflet loads
          if (mapRef.current && window.L) {
            try {
              const L = window.L as any
              
              // Create map
              const map = L.map(mapRef.current).setView([-6.4025, 106.7942], 16)
              mapInstanceRef.current = map
              
              // Add tile layer
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }).addTo(map)

              // Custom icon function
              const getMarkerIcon = (status: string) => {
                const color = status === 'active' ? '#10b981' : 
                             status === 'maintenance' ? '#f59e0b' : 
                             status === 'offline' ? '#ef4444' : '#6b7280'
                
                return L.divIcon({
                  html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                  iconSize: [12, 12],
                  className: 'custom-marker'
                })
              }

              // Clear existing markers
              markersRef.current = []

              // Add markers
              monitoringPoints.forEach((point) => {
                const marker = L.marker([point.latitude, point.longitude], { icon: getMarkerIcon(point.status) })
                  .addTo(map)
                  .bindPopup(`
                    <div style="min-width: 200px; padding: 8px;">
                      <h3 style="margin: 0 0 8px 0; font-weight: bold;">${point.name}</h3>
                      <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${point.description}</p>
                      <div style="font-size: 12px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                          <span>Status:</span>
                          <span style="background-color: ${point.status === 'active' ? '#10b981' : point.status === 'maintenance' ? '#f59e0b' : '#ef4444'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">
                            ${point.status}
                          </span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                          <span>Plants:</span>
                          <span>${point.totalPlants}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                          <span>Healthy:</span>
                          <span style="color: #10b981;">${point.healthyPlants}</span>
                        </div>
                      </div>
                    </div>
                  `)
                  .on('click', () => {
                    setSelectedPoint(point)
                  })

                // Store marker reference with point ID
                marker.pointId = point.id
                markersRef.current.push(marker)
              })

              setMapLoading(false)
            } catch (error) {
              console.error('Error initializing map:', error)
              setMapError('Failed to initialize map')
              setMapLoading(false)
            }
          }
        }
        leafletScript.onerror = () => {
          setMapError('Failed to load map library')
          setMapLoading(false)
        }
        document.head.appendChild(leafletScript)
      } catch (error) {
        console.error('Error loading map:', error)
        setMapError('Failed to load map')
        setMapLoading(false)
      }
    }

    initializeMap()
  }, [])

  const filteredPoints = monitoringPoints.filter(point => {
    const matchesStatus = filterStatus === 'all' || point.status === filterStatus
    const matchesSearch = point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         point.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'maintenance':
        return 'bg-yellow-500'
      case 'offline':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getCameraStatusColor = (status: string) => {
    return status === 'online' ? 'text-green-600' : 'text-red-600'
  }

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Current location:', position.coords)
          // In a real app, you would center the map on this location
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Peta Monitoring</h1>
              <p className="text-gray-600 mt-2">
                Lokasi titik koordinat pemantauan di STT Terpadu Nurul Fikri, Depok
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleGetCurrentLocation}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Current Location
              </button>
              <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                <Activity className="w-4 h-4" />
                Live View
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">{monitoringPoints.length}</p>
              </div>
              <MapPin className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {monitoringPoints.filter(p => p.status === 'active').length}
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
                <p className="text-sm text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {monitoringPoints.filter(p => p.status === 'maintenance').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Plants</p>
                <p className="text-2xl font-bold text-gray-900">
                  {monitoringPoints.reduce((acc, p) => acc + p.totalPlants, 0)}
                </p>
              </div>
              <Camera className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-96 lg:h-[600px] relative">
                {mapLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
                      <p className="text-gray-600">Loading map...</p>
                    </div>
                  </div>
                )}
                
                {mapError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-red-600" />
                      </div>
                      <p className="text-red-800 font-medium mb-2">Map Error</p>
                      <p className="text-red-600 text-sm">{mapError}</p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}
                
                <div 
                  ref={mapRef}
                  className="w-full h-full"
                  style={{ minHeight: '400px' }}
                >
                  {/* Fallback static map if Leaflet fails */}
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-64 h-64 bg-gray-200 rounded-lg mx-auto mb-4 relative overflow-hidden">
                        {/* Static map representation */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="relative">
                              {/* Map center point */}
                              <div className="w-4 h-4 bg-red-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                              {/* Monitoring points with correct colors - showing first 10 points */}
                              {/* A-1 (active) */}
                              <div className="w-2 h-2 bg-green-600 rounded-full absolute -top-8 -left-6"></div>
                              {/* B-2 (active) */}
                              <div className="w-2 h-2 bg-green-600 rounded-full absolute -top-4 left-8"></div>
                              {/* C-3 (maintenance) - YELLOW */}
                              <div className="w-2 h-2 bg-yellow-600 rounded-full absolute top-6 -left-8"></div>
                              {/* D-4 (active) */}
                              <div className="w-2 h-2 bg-green-600 rounded-full absolute -top-6 left-10"></div>
                              {/* E-5 (active) */}
                              <div className="w-2 h-2 bg-green-600 rounded-full absolute top-4 left-4"></div>
                              {/* F-6 (active) */}
                              <div className="w-2 h-2 bg-green-600 rounded-full absolute -top-10 left-2"></div>
                              {/* G-7 (active) */}
                              <div className="w-2 h-2 bg-green-600 rounded-full absolute top-2 left-12"></div>
                              {/* H-8 (maintenance) - YELLOW */}
                              <div className="w-2 h-2 bg-yellow-600 rounded-full absolute top-8 left-6"></div>
                              {/* I-9 (active) */}
                              <div className="w-2 h-2 bg-green-600 rounded-full absolute -top-2 left-14"></div>
                              {/* J-10 (active) */}
                              <div className="w-2 h-2 bg-green-600 rounded-full absolute top-10 left-10"></div>
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 text-xs text-gray-600">
                          STT Terpadu Nurul Fikri
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">Interactive Map</p>
                      <p className="text-sm text-gray-500">Showing {filteredPoints.length} monitoring points</p>
                      
                      {/* Legend */}
                      <div className="flex justify-center gap-4 mt-4">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                          <span className="text-xs text-gray-600">Active</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                          <span className="text-xs text-gray-600">Maintenance</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                          <span className="text-xs text-gray-600">Offline</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Location
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Filter
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Monitoring Points</h2>
                <div className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">
                  Klik untuk navigasi
                </div>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredPoints.map((point) => (
                  <div
                    key={point.id}
                    onClick={() => handlePointSelect(point)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all relative ${
                      selectedPoint?.id === point.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${
                      navigatingPoint === point.id
                        ? 'ring-2 ring-blue-400 ring-opacity-50'
                        : ''
                    }`}
                  >
                    {navigatingPoint === point.id && (
                      <div className="absolute top-2 right-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{point.name}</h3>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(point.status)}`}></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{point.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{point.totalPlants} plants</span>
                      <span className={getCameraStatusColor(point.cameraStatus)}>
                        <Camera className="w-3 h-3 inline mr-1" />
                        {point.cameraStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Point Details */}
            {selectedPoint && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Point Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedPoint.name}</h3>
                    <p className="text-sm text-gray-600">{selectedPoint.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Plants:</span>
                      <p className="font-medium">{selectedPoint.totalPlants}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Healthy:</span>
                      <p className="font-medium text-green-600">{selectedPoint.healthyPlants}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Diseased:</span>
                      <p className="font-medium text-red-600">{selectedPoint.diseasedPlants}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Pest:</span>
                      <p className="font-medium text-yellow-600">{selectedPoint.pestPlants}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => handleViewAnalytics(selectedPoint)}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Activity className="w-4 h-4" />
                      View Detailed Analytics
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}