import api from './axios'
import type { Reservation } from './reservations'

export interface DashboardStats {
  totalCars: number
  availableCars: number
  totalReservations: number
  reservationsByStatus: {
    PENDING: number
    CONFIRMED: number
    RETURNED: number
    CANCELLED: number
  }
  revenue: number
  recentReservations: Reservation[]
}

export const statsApi = {
  get: () => api.get<DashboardStats>('/stats').then((r) => r.data),
}
