import { sendOtp,verifyOtp,updateProfile } from "../controllers/User/Login/index.js";
import express from 'express'
import { upload,uploadToCloudinary } from '../controllers/User/Login/upload_profile.js';


const userRouter = express.Router();
userRouter.route('/send/otp').post(sendOtp)
userRouter.route('/verify/otp').post(verifyOtp);
userRouter.route('/update/profile').post(upload.single('image'),uploadToCloudinary,updateProfile)


export default userRouter;