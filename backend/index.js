
import express from "express";
import cors from "cors";
import connectDB from "./db/connection.js";
import authRouter from "./Routes/auth.js";
import categoryRoutes from "./Routes/Category.js";
import supplierRoutes from "./Routes/supplier.js";
import productsRoutes from "./Routes/Products.js";
import userRoute from "./Routes/users.js"
import OrderRouter from'./Routes/order.js'
import dashboardRouter from "./Routes/dashboard.js"
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/category", categoryRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/products", productsRoutes); 
app.use("/api/users",userRoute);
app.use("/api/orders",OrderRouter);
app.use("/api/dashboard",dashboardRouter)

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});
