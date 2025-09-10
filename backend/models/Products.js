




import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    isDeleted:{type:Boolean,default:false},
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "supplier" },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
