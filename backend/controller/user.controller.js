import { z } from "zod";
import bcrypt from "bcrypt";
import { user } from "../models/user.model.js";
import sanitizeHtml from "sanitize-html";
import axios from "axios";
import jwt from "jsonwebtoken";
import { userOTP } from "../models/otp.model.js";
import nodemailer from 'nodemailer'
const generateToken = async (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1hr" });
  return token;
};

const sendMail = async(toEmail,otp)=>{
  const testAccount = await nodemailer.createTestAccount()

  const transport = await nodemailer.createTransport({
  
    service:"gmail",
    secure:true,
    port:456,
    auth:{
      user:"vikashjain2205@gmail.com",
      pass:"efzivaqahqhuclvl"
    }
  })

  const info = await transport.sendMail({
    from: '"vikash jain"  "<maddison53@ethereal.email>"',
    to:toEmail,
    subject: "Your OTP for login",
    html: `
    <p>This is the otp for your login process. Please fill this otp for login</p>
    <b>${otp}</b>`
  })

 
}
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, terms, device, browser, ipAddress } =
      req.body;
    const existingUser = await user.findOne({
      email,
    });
    const existingNumber = await user.findOne({
      phone,
    });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User with this email already exists",
      });
    }
    if (existingNumber) {
      return res.json({
        success: false,
        message: "User with this Number already exists",
      });
    }
    let location = "unknown";

    try {
      const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
      if (response.data.status === "success") {
        // console.log(response.data);

        location = `${response.data.city}, ${response.data.regionName}, ${response.data.country}`;
        // console.log(location);
      }
    } catch (error) {
      console.error("Error fetching location from geolocation API:", error);
    }

    const sessionDetails = {
      device,
      location,
      browser,
    };
    const newUser = await user.createUser({
      name,
      email,
      password,
      phone,
      terms,
    });

    await user.findByIdAndUpdate(newUser._id, {
      $push: { session: sessionDetails },
    });
    const token = await generateToken(newUser);

    return res
      .cookie("token", token, { httpOnly: true, secure: true })
      .status(201)
      .json({
        newUser,
        success: true,
        message: "User registered successfully",
      });
  } catch (error) {
    console.log(error);

    return res.status(400).json({ error });
  }
};

const loginUser = async (req, res) => {
  try {
    const data = req.body;

    const findUser = await user.findOne({
      email: data.email,
    });

    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "User with this email doesn't exist",
      });
    }
    const comparedPassword = await bcrypt.compare(
      data.password,
      findUser.password
    );
    if (!comparedPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }

    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    await sendMail(findUser.email, otp);
    //  res.json({success:true, message:"OTP has been send to your email.Please check your inbox"})
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);
    const otpModel = await userOTP.create({
      userId: findUser._id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    const token = await generateToken(findUser);
    return res
      .cookie("token", token, { httpOnly: true, secure: true })
      .status(200)
      .json({ success: true, findUser, message: "User loggedIn successfully" });
  } catch (error) {
    console.log(error);
    // console.log(error);

    return res
      .status(500)
      .json({ success: false, message: "Something went wrong", error });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { userId, pin } = req.body;
   
    
    if (!pin) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide otp" });
    }

    const UserOTPVerification = await userOTP.find({
      userId,
    }).sort({createdAt:-1});
    const { expiresAt } = UserOTPVerification[0];
    const hashedOTP = UserOTPVerification[0].otp;

    if (expiresAt < Date.now()) {
      await userOTP.deleteMany({ userId });
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    } else {
      const validOtp = await bcrypt.compare(pin, hashedOTP);
      if (!validOtp) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
      } else {
        await userOTP.deleteMany({ userId });
        return res.status(200).json({ success: true });
      }
    }
  } catch (error) {
    console.log(error);
    
    return res.json({ success: false, message: "Something went wrong" });
  }
};

const fetchUserInfo = async(req,res)=>{
  try {
    const {userId} = req.body;
   
    
    const fetchUser = await user.findById(userId).select("-password")

    if(!fetchUser){
      return res.json({success:false,message:"User not found"})
    }

    
    return res.json({success:true, fetchUser})
  } catch (error) {
    console.log(error);
    
    return res.json({success: false, message:"Something went wrong"})
  }
}

const set2FA = async(req,res)=>{
  try {
    const {userId,set2FA} = req.body;

    await user.findByIdAndUpdate(userId,{
      is2FAEnable: set2FA
    })

    return res.json({success: true,message:"2FA updated",set2FA})
    
  } catch (error) {
    console.log(error);
    
    return res.json({success:false,message:"Something went wrong"})
  }
}
export { registerUser, loginUser, verifyOTP,fetchUserInfo,set2FA };
