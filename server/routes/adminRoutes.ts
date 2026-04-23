import express from "express";
import { getDashboardStatus } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/auth.js";

const AdminRouter = express.Router();

// Pegar status do dashboard
AdminRouter.get("/stats", protect, authorize("admin"), getDashboardStatus);

export default AdminRouter;
