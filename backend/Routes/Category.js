import express from 'express'
import { addCategory,getCategories,updateCategories,deleteCategory } from '../controllers/categoryControllers.js'
import authmiddleware from '../middleware/authmiddleware.js';

const router = express.Router()
router.post("/add",authmiddleware,addCategory);
router.get("/",authmiddleware,getCategories);
router.put("/:id",authmiddleware,updateCategories);
router.delete("/:id",authmiddleware,deleteCategory);

export default router;