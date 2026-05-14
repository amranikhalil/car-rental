import api from './axios'

export interface Airport {
  id: number
  name: string
  city: string
  code: string
}

export interface Car {
  id: number
  brand: string
  model: string
  year: number
  pricePerDay: string
  transmission: 'MANUAL' | 'AUTOMATIC'
  fuel: 'ESSENCE' | 'DIESEL' | 'ELECTRIQUE'
  seats: number
  photos: string[]
  isAvailable: boolean
  airportId: number
  airport: Airport
  createdAt: string
}

export interface CarPayload {
  brand: string
  model: string
  year: number
  pricePerDay: number
  transmission: 'MANUAL' | 'AUTOMATIC'
  fuel: 'ESSENCE' | 'DIESEL' | 'ELECTRIQUE'
  seats: number
  photos: string[]
  airportId: number
  isAvailable: boolean
}

export const carsApi = {
  getAll: () => api.get<Car[]>('/cars').then((r) => r.data),
  create: (data: CarPayload) => api.post<Car>('/cars', data).then((r) => r.data),
  update: (id: number, data: Partial<CarPayload>) => api.put<Car>(`/cars/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/cars/${id}`),
}

export const airportsApi = {
  getAll: () => api.get<Airport[]>('/airports').then((r) => r.data),
}
