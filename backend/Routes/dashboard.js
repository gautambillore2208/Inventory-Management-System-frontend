import express from "express";
import { getData } from "../controllers/dashboardControllers.js";
import authmiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/",authmiddleware,getData)

export default router;