import express from "express";
import { addOrder,getOrders } from "../controllers/OrderControllers.js";
import authmiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authmiddleware, addOrder);
router.get("/",authmiddleware,getOrders)

export default router;