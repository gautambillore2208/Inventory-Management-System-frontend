import mongoose from "mongoose";

const suppliersSchema = new mongoose.Schema({
   name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const supplierModel = mongoose.model('supplier',suppliersSchema);
export default supplierModel;