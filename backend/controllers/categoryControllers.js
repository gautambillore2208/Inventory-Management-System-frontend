

import Category from "../models/Category.js";

const addCategory = async (req, res) => {
  try {
    const { categoryName, categoryDescription } = req.body;

    if (!categoryName || !categoryDescription) {
      return res.status(400).json({
        success: false,
        message: "Both categoryName and categoryDescription are required",
      });
    }

    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const newCategory = new Category({
      categoryName,
      categoryDescription,
    });

    await newCategory.save();

    return res.status(201).json({
      success: true,
      message: "Category added successfully",
      category: newCategory, // ✅ Send back the category
    });
  } catch (error) {
    console.log("Error adding category:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({
      success: true,
      categories, // ✅ proper key
    });
  } catch (error) {
    console.log("Error fetching categories", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error in getting categories" });
  }
};



const  updateCategories = async (req,res)=>{

  try {
    const {id} = req.params;
    const {categoryName,categoryDescription} = req.body;


    const existingCategory = await Category.findById(id);
    if(!existingCategory){
      return res.status(404).json({success:false,message: "category is not found"});
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {categoryName,categoryDescription},
      {new:true}
    )

    return res.status(200).json({success:true,message:"category updated succcessfull"})
  } catch (error) {
    console.log("error updated category ",error);
    return res.status(500).json({success:false,message:"server Error"})
    
  }

}






const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    await Category.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};







export { addCategory, getCategories,updateCategories,deleteCategory };
