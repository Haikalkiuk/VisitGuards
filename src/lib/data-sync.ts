// Shared data types and utilities for IoT Monitor and Data Daun integration

export interface LeafData {
  id: string
  date: Date
  plantId: string
  status: 'healthy' | 'diseased' | 'pest' | 'nutrient_deficient'
  confidence: number
  location: string
  source?: 'auto' | 'manual' // Tambahkan source tracking
  cameraId?: string // ID kamera sumber
}

const STORAGE_KEY = 'visitguard_leaf_data'

// Fungsi untuk menyimpan data ke localStorage
export const saveLeafData = (data: LeafData[]): void => {
  try {
    const serializedData = data.map(item => ({
      ...item,
      date: item.date.toISOString()
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedData))
  } catch (error) {
    console.error('Error saving leaf data:', error)
  }
}

// Fungsi untuk mengambil data dari localStorage
export const getLeafData = (): LeafData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const parsed = JSON.parse(stored)
    return parsed.map((item: any) => ({
      ...item,
      date: new Date(item.date)
    }))
  } catch (error) {
    console.error('Error loading leaf data:', error)
    return []
  }
}

// Fungsi untuk menambahkan data baru
export const addLeafData = (newData: LeafData): void => {
  try {
    const existingData = getLeafData()
    const updatedData = [newData, ...existingData]
    saveLeafData(updatedData)
  } catch (error) {
    console.error('Error adding leaf data:', error)
  }
}

// Fungsi untuk menghapus data berdasarkan ID
export const removeLeafData = (id: string): void => {
  try {
    const existingData = getLeafData()
    const updatedData = existingData.filter(item => item.id !== id)
    saveLeafData(updatedData)
  } catch (error) {
    console.error('Error removing leaf data:', error)
  }
}

// Fungsi untuk membersihkan semua data
export const clearLeafData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing leaf data:', error)
  }
}

// Fungsi untuk generate Plant ID dari camera ID
export const generatePlantIdFromCamera = (cameraId: string): string => {
  const cameraNumber = cameraId.split('-')[1] || '001'
  return `VINE-${cameraNumber.padStart(3, '0')}`
}

// Fungsi untuk membuat data baru dari capture
export const createLeafDataFromCapture = (
  cameraId: string,
  status: LeafData['status'],
  confidence: number,
  location: string,
  source: 'auto' | 'manual' = 'manual'
): LeafData => {
  return {
    id: `CAP-${Date.now()}`,
    date: new Date(),
    plantId: generatePlantIdFromCamera(cameraId),
    status,
    confidence,
    location,
    source,
    cameraId
  }
}