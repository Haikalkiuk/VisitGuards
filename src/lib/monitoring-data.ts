// Shared monitoring data for consistency across IoT Monitor and Maps pages

export interface MonitoringPoint {
  id: string
  name: string
  plantId: string
  latitude: number
  longitude: number
  description: string
  status: 'active' | 'maintenance' | 'offline'
  lastUpdate: Date
  totalPlants: number
  healthyPlants: number
  diseasedPlants: number
  pestPlants: number
  cameraStatus: 'online' | 'offline'
}

export const monitoringPoints: MonitoringPoint[] = [
  {
    id: '1',
    name: 'Sensor Point A-1',
    plantId: 'VINE-001',
    latitude: -6.4025,
    longitude: 106.7942,
    description: 'Area Utama - Plot 1',
    status: 'active',
    lastUpdate: new Date('2024-01-15T08:30:00'),
    totalPlants: 25,
    healthyPlants: 23,
    diseasedPlants: 1,
    pestPlants: 1,
    cameraStatus: 'online'
  },
  {
    id: '2',
    name: 'Sensor Point B-2',
    plantId: 'VINE-002',
    latitude: -6.4035,
    longitude: 106.7952,
    description: 'Area Tengah - Plot 2',
    status: 'active',
    lastUpdate: new Date('2024-01-15T09:15:00'),
    totalPlants: 30,
    healthyPlants: 28,
    diseasedPlants: 0,
    pestPlants: 2,
    cameraStatus: 'online'
  },
  {
    id: '3',
    name: 'Sensor Point C-3',
    plantId: 'VINE-003',
    latitude: -6.4015,
    longitude: 106.7932,
    description: 'Area Selatan - Plot 3',
    status: 'maintenance',
    lastUpdate: new Date('2024-01-14T16:45:00'),
    totalPlants: 20,
    healthyPlants: 18,
    diseasedPlants: 1,
    pestPlants: 1,
    cameraStatus: 'offline'
  },
  {
    id: '4',
    name: 'Sensor Point D-4',
    plantId: 'VINE-004',
    latitude: -6.4045,
    longitude: 106.7962,
    description: 'Area Barat - Plot 4',
    status: 'active',
    lastUpdate: new Date('2024-01-15T10:00:00'),
    totalPlants: 28,
    healthyPlants: 25,
    diseasedPlants: 2,
    pestPlants: 1,
    cameraStatus: 'online'
  },
  {
    id: '5',
    name: 'Sensor Point E-5',
    plantId: 'VINE-005',
    latitude: -6.4005,
    longitude: 106.7922,
    description: 'Area Timur - Plot 5',
    status: 'active',
    lastUpdate: new Date('2024-01-15T11:30:00'),
    totalPlants: 22,
    healthyPlants: 20,
    diseasedPlants: 1,
    pestPlants: 1,
    cameraStatus: 'online'
  },
  {
    id: '6',
    name: 'Sensor Point F-6',
    plantId: 'VINE-006',
    latitude: -6.4055,
    longitude: 106.7972,
    description: 'Area Utara - Plot 6',
    status: 'active',
    lastUpdate: new Date('2024-01-15T12:15:00'),
    totalPlants: 26,
    healthyPlants: 24,
    diseasedPlants: 1,
    pestPlants: 1,
    cameraStatus: 'online'
  },
  {
    id: '7',
    name: 'Sensor Point G-7',
    plantId: 'VINE-007',
    latitude: -6.3995,
    longitude: 106.7912,
    description: 'Area Tenggara - Plot 7',
    status: 'active',
    lastUpdate: new Date('2024-01-15T13:00:00'),
    totalPlants: 24,
    healthyPlants: 22,
    diseasedPlants: 1,
    pestPlants: 1,
    cameraStatus: 'online'
  },
  {
    id: '8',
    name: 'Sensor Point H-8',
    plantId: 'VINE-008',
    latitude: -6.4065,
    longitude: 106.7982,
    description: 'Area Barat Laut - Plot 8',
    status: 'maintenance',
    lastUpdate: new Date('2024-01-15T13:45:00'),
    totalPlants: 21,
    healthyPlants: 19,
    diseasedPlants: 1,
    pestPlants: 1,
    cameraStatus: 'offline'
  },
  {
    id: '9',
    name: 'Sensor Point I-9',
    plantId: 'VINE-009',
    latitude: -6.3985,
    longitude: 106.7902,
    description: 'Area Timur Laut - Plot 9',
    status: 'active',
    lastUpdate: new Date('2024-01-15T14:30:00'),
    totalPlants: 23,
    healthyPlants: 21,
    diseasedPlants: 1,
    pestPlants: 1,
    cameraStatus: 'online'
  },
  {
    id: '10',
    name: 'Sensor Point J-10',
    plantId: 'VINE-010',
    latitude: -6.4075,
    longitude: 106.7992,
    description: 'Area Pusat - Plot 10',
    status: 'active',
    lastUpdate: new Date('2024-01-15T15:15:00'),
    totalPlants: 27,
    healthyPlants: 25,
    diseasedPlants: 1,
    pestPlants: 1,
    cameraStatus: 'online'
  }
]