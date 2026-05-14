import { Router } from 'express'
import {
  getReservations,
  getReservationById,
  createReservation,
  updateReservationStatus,
} from '../controllers/reservation.controller'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.get('/', requireAuth, getReservations)
router.get('/:id', requireAuth, getReservationById)
router.post('/', createReservation)
router.patch('/:id/status', requireAuth, updateReservationStatus)

export default router
