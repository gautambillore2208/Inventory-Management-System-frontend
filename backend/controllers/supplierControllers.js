


import Product from "../models/Products.js";
import Suppliers from "../models/suppliers.js";

const addSupplier = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const existingSupplier = await Suppliers.findOne({ name });
    if (existingSupplier) {
      return res
        .status(400)
        .json({ success: false, message: "Supplier already exists" });
    }

    const newSupplier = new Suppliers({
      name,
      email,
      phone,
      address,
    });

    await newSupplier.save();

    return res.status(201).json({
      success: true,
      message: "Supplier added successfully",
      supplier: newSupplier, 
    });
  } catch (error) {
    console.log("Error adding supplier:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};



const getSupplier = async (req, res) => {
  try {
    const supplier = await Suppliers.find();
    return res.status(200).json({
      success: true,
      supplier, 
    });
  } catch (error) {
    console.log("Error fetching Supplier", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error in getting supplier" });
  }
};


const  updateSupplier = async (req,res)=>{

  try {
    const {id} = req.params;
    const {name,email,phone,address} = req.body;


    const existingSupplier = await Suppliers.findById(id);
    if(!existingSupplier){
      return res.status(404).json({success:false,message: "supplier is not found"});
    }

    const updatedSupplier = await Suppliers.findByIdAndUpdate(
      id,
      {name,email,phone,address},
      {new:true}
    )

    return res.status(200).json({success:true,message:"supplier updated succcessfull"})
  } catch (error) {
    console.log("error updated category ",error);
    return res.status(500).json({success:false,message:"server Error"})
    
  }

};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
     const ProductCount= await Product.countDocuments({supplierId:id});

    if(ProductCount>0){
      res.status(400).json({success:false,message:"Can not delete supplier associated with category"})
    }

    const existingCategory = await Suppliers.findById(id);
    if (!existingCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    await Suppliers.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("Error deleting Supplier:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error Supplier" });
  }
};






export { addSupplier,getSupplier ,updateSupplier,deleteSupplier};
