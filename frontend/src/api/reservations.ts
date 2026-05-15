import api from './axios'
import type { Car } from './cars'

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'RETURNED' | 'CANCELLED'
export type Protection = 'BASIC' | 'NONE'

export interface Reservation {
  id: number
  clientName: string
  clientEmail: string
  clientPhone: string
  carId: number
  car: Car
  startDate: string
  endDate: string
  totalPrice: string
  protection: Protection
  status: ReservationStatus
  createdAt: string
}

export const reservationsApi = {
  getAll: (status?: ReservationStatus) =>
    api.get<Reservation[]>('/reservations', { params: status ? { status } : {} }).then((r) => r.data),
  getById: (id: number) =>
    api.get<Reservation>(`/reservations/${id}`).then((r) => r.data),
  updateStatus: (id: number, status: ReservationStatus) =>
    api.patch<Reservation>(`/reservations/${id}/status`, { status }).then((r) => r.data),
  delete: (id: number) =>
    api.delete(`/reservations/${id}`),
}
