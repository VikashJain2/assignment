import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true,
        unique: true
    },
    terms:{
        type: Boolean,
        required:true
    }

},{timestamps:true})

export const user = mongoose.model("user",userSchema)