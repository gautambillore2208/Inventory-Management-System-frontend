


import Product from "../models/Products.js";
import Order from "../models/Order.js"; 

const addOrder = async (req, res) => {
  try {
    const { productId, quantity, total } = req.body;
    const userId = req.user._id;

    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

  
    if (quantity > product.stock) {
      return res.status(400).json({ success: false, error: "Not enough stock available" });
    }


    product.stock -= parseInt(quantity);
    await product.save();

    const orderObj = new Order({
      customer: userId,
      product: productId,
      quantity,
      totalPrice: total,
    });

    await orderObj.save();

    return res.status(200).json({ success: true, message: "Order added successfully", order: orderObj });
  } catch (error) {
    console.error("Error adding order:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    let query = {};

 
    if (req.user.role === "customer") {
      query = { customer: userId };
    }

    const orders = await Order.find(query)
      .populate({
        path: "product",         
        select: "name price",     
        populate: {
          path: "categoryId",     
          select: "categoryName",
        },
      })
      .populate({
        path: "customer",         
        select: "name email",     
      });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(" Error in getOrders:", error);
    return res.status(500).json({
      success: false,
      error: "Server error fetching orders",
    });
  }
};

export default getOrders;



export { addOrder ,getOrders};
