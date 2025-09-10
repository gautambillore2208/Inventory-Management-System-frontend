import bcrypt from "bcrypt";
import User from "../models/User.js";

// Add User
const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exUser = await User.findOne({ email });
    if (exUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

 
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User added successfully ✅",
      user: newUser,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error while adding user" });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error while fetching users" });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found " });
    }

    await User.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully " });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error while deleting user" });
  }
};



const getUsers = async (req, res) => {
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    
    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error in getting user profile",
    });
  }
};

const UpdateUsersProfile =  async (req,res)=>{
  try {
    const userId = req.user._id;
    const {name,email,address,password} = req.body
    const  updateddata= {name,email,address};
    if(password&&password.trim()!==""){
      const hashedPassword = await bcrypt.hash(password,10);
      updateddata.password= hashedPassword
    }
    const user= await User.findByIdAndUpdate(userId,updateddata,{new:true}).select('-password') ;
    if(!user){
      return res.status(404).json({success:false,message:"USer not found"})
    }
         return res.status(200).json({success:true,message:"Profile updated succesfully",user})

  } catch (error) {
      return res.status(500).json({success:false,message:"USer server not found"})
  }
}

export { addUser, deleteUser, getUser,getUsers,UpdateUsersProfile };
