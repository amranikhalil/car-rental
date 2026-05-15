import "dotenv/config";
import express from "express";
import cors from "cors";
import carRoutes from "./routes/car.routes";
import authRoutes from "./routes/auth.routes";
import airportRoutes from "./routes/airport.routes";
import reservationRoutes from "./routes/reservation.routes";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL ?? '*',
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/airports", airportRoutes);
app.use("/api/reservations", reservationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
