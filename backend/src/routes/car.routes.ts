import { Router } from "express";
import { getCars, getCarById, createCar, updateCar, deleteCar } from "../controllers/car.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", getCars);
router.get("/:id", getCarById);
router.post("/", requireAuth, createCar);
router.put("/:id", requireAuth, updateCar);
router.delete("/:id", requireAuth, deleteCar);

export default router;
