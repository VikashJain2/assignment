import express from "express";
import { fetchUserInfo, loginUser, registerUser, set2FA, verifyOTP } from "../controller/user.controller.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login",loginUser)
userRouter.post("/verifyOtp",verifyOTP)
userRouter.post("/user-info",fetchUserInfo)
userRouter.post("/set2FA",set2FA)


export default userRouter;
