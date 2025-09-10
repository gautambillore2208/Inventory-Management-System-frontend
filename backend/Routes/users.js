import express from 'express'
import { addUser,getUser,deleteUser,getUsers ,UpdateUsersProfile} from '../controllers/userControllers.js';

import authmiddleware from '../middleware/authmiddleware.js';

const router = express.Router()
router.post("/add",authmiddleware,addUser);
router.get("/",authmiddleware,getUser);
router.delete("/:id",authmiddleware,deleteUser);
router.get("/profile",authmiddleware,getUsers);
router.put("/profile",authmiddleware,UpdateUsersProfile);


export default router;