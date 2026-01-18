export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface LeafData {
  id: string;
  plantId: string;
  date: Date;
  status: 'healthy' | 'diseased' | 'pest' | 'nutrient_deficient';
  confidence: number;
  imageUrl?: string;
  notes?: string;
}

export interface MonitoringPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  isActive: boolean;
}

export interface ChartData {
  date: string;
  healthy: number;
  diseased: number;
  pest: number;
  nutrient_deficient: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}