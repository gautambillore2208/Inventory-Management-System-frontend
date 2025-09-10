import bcrypt from "bcrypt"
import User from "./models/User.js"
import connectDB from "./db/connection.js"
import dotenv from "dotenv";
dotenv.config();


const register = async ()=>{
    try {
        connectDB()
         const hashpassword = await bcrypt.hash("admin",10);
         const newUser = new User({
            name: "admin",
            email:"admin@gmail.com",
            password:hashpassword,
            address:"admin address",
            role:"admin"

         });

         await newUser.save()
         console.log("admin user  created succefully");
         
    } catch (error) {
        console.log(error);
        
    }
}


register()

