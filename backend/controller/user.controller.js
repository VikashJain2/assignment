import { z } from "zod";
import bcrypt from "bcrypt";
import { user } from "../models/user.model.js";
import sanitizeHtml from "sanitize-html"
const userSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 4 characters long" })
    .max(30, { message: "Name must be less than 30 characters" })
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password should be minimum 6 character long")
    .max(15, "Password must be less than 15 characters"),
  phone: z
    .string()
    .length(10, "Phone number must be 10 digits")
    .regex(/^\d+$/, "Phone number can only contain numbers"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});
const registerUser = async (req, res) => {
  try {

    const sanitizedData = {
      name: sanitizeHtml(req.body.name, { allowedTags: [], allowedAttributes: {} }),
      email: sanitizeHtml(req.body.email, { allowedTags: [], allowedAttributes: {} }),
      password: sanitizeHtml(req.body.password, {allowedTags:[], allowedAttributes:[]}),
      phone: sanitizeHtml(req.body.phone, { allowedTags: [], allowedAttributes: {} }),
      terms: req.body.terms // This is a boolean, no need to sanitize
  };
    const parseData = userSchema.parse(sanitizedData);

    const hashPassword = await bcrypt.hash(parseData.password, 10);

    const existingUser = await user.findOne({
      email: parseData.email,
    });
    const existingNumber = await user.findOne({
      phone: parseData.phone,
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

    const newUser = new user({
      name: parseData.name,
      email: parseData.email,
      password: hashPassword,
      phone: parseData.phone,
      terms: parseData.terms,
    });

    await newUser.save();
    return res.status(201).json({
      newUser,
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));
      return res.status(400).json({ errors });
    }
    console.log(error);

    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
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
      .json({ success: false, message: "Something went wrong" });
  }
};

export { registerUser, loginUser };
