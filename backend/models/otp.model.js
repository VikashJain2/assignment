import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    otp:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date
    },
    expiresAt:{type: Date}
})

export const userOTP = mongoose.model("userOTP",otpSchema)
