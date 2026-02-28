import { Router } from "express";
import {
  createReservationRecord,
  getReservations,
  deleteReservation,
  restoreReservation
} from "./reservation.controller.js";
import { validateCreateReservation } from '../../middleware/reservation-validator.js';

const router = Router();

router.get('/', getReservations);
router.post(
  '/',
  validateCreateReservation,
  createReservationRecord
);
router.patch('/delete/:id', deleteReservation);
router.patch('/restore/:id', restoreReservation);

export default router;