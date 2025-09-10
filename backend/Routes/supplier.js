import express from 'express'
import authmiddleware from '../middleware/authmiddleware.js';
import { addSupplier,getSupplier,updateSupplier,deleteSupplier } from '../controllers/supplierControllers.js';

const router = express.Router()
router.post("/add",authmiddleware,addSupplier);
router.get("/",authmiddleware,getSupplier);
router.put("/:id",authmiddleware,updateSupplier);
router.delete("/:id",authmiddleware,deleteSupplier);

export default router;