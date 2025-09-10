

import express from "express";
import {addProduct,getProducts,updateProduct,deleteProduct} from "../controllers/Products.Controllers.js"
import authmiddleware from "../middleware/authmiddleware.js"

const router = express.Router();
router.get("/", authmiddleware, getProducts);
router.put("/:id",authmiddleware,updateProduct)
router.delete("/:id",authmiddleware,deleteProduct)
router.post("/add", authmiddleware, addProduct);

export default router;
