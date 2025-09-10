import Product from "../models/Products.js";
import Suppliers from "../models/suppliers.js";
import Category from "../models/Category.js";



 const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false })
      .populate("categoryId", "categoryName")
      .populate("supplierId", "name"); 

    const suppliers = await Suppliers.find();
    const categories = await Category.find();

    return res.status(200).json({
      success: true,
      products,
      suppliers,
      categories,
    });
  } catch (error) {
    console.log("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Server error in getting products",
    });
  }
};









 const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, supplierId } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: "Name and price are required" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      categoryId,
      supplierId,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding product",
      error: error.message,
    });
  }
};


const updateProduct = async (req,res)=>{
  try {
    
  
  const {id} = req.params;
  const {name,description,price,stock,categoryId,supplierId} = req.body
    const updateProduct = await Product.findByIdAndUpdate(id,{
      name,
      description,
      price,
      stock,
      categoryId,
      supplierId
    },{new:true});
    if(!updateProduct){
      return res.status(404).json({success:false,message:"Products not found"})
    }
    return res.status(200).json({success:true,message:"Products updated successfully",product:updateProduct})

  }

 catch (error) {

     return res.status(500).json({success:false,message:"Products not server found"})
  }
};



const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const ProductCount= await Product.countDocuments({categoryId:id});

    if(ProductCount>0){
      res.status(400).json({success:false,message:"Can not delete category associated with Product"})
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
if(existingProduct.isDeleted){
    return res.status(400).json({success:false,message:"Products is already deleted"})
}
await Product.findByIdAndUpdate(id,{isDeleted:true},{new:true})

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting Product:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error Product" });
  }
};


export { getProducts,addProduct,updateProduct ,deleteProduct};
