import { z } from "zod";
import bcrypt from "bcrypt";
import { user } from "../models/user.model.js";
import sanitizeHtml from "sanitize-html"

const registerUser = async (req, res) => {
  try {
    const {name,email,password,phone, terms} = req.body
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

    const newUser = await user.createUser({
      name,
      email,
      password,
      phone,
      terms,
    });
    return res.status(201).json({
      newUser,
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
      const errors = Object.values(error.errors).map(e => ({message:  e.message}))
      return res.status(400).json({ errors });
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
    const comparedPassword = await  bcrypt.compare(
      data.password,
      findUser.password
    );
    if (!comparedPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }
    const LoginUser = await user.findOne({
      _id: findUser._id,
      email: data.email,
      password: comparedPassword,
    });
    return res
      .status(200)
      .json({ success: true, message: "User loggedIn successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong",error });
  }
};

export { registerUser, loginUser };
