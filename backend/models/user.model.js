import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 30,
      validate: {
        validator: (v) => /^[a-zA-Z\s]*$/.test(v),
        message: (props) =>
          `${props.value} is not a valid name! Only alphabets are allowed.`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format!",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^[0-9]{10}$/.test(v),
        message: (props) =>
          `${props.value} is not a valid phone number! It should be 10 digits long`,
      },
    },
    terms: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);
userSchema.statics.createUser = async function (userData) {
  const sanitizedData = {
    name: userData.name.replace(/<[^>]+>/g, ""),
    email: userData.email.replace(/<[^>]+>/g, ""),
    phone: userData.phone.replace(/<[^>]+>/g, ""),
    password: userData.password,
    terms: userData.terms,
  };

  const salt = await bcrypt.genSalt(10);
  sanitizedData.password = await bcrypt.hash(sanitizedData.password, salt);

  const newUser = new this(sanitizedData);

  try {
    await newUser.validate();
    await newUser.save();
    return newUser;
  } catch (error) {
    throw error;
  }
};

export const user = mongoose.model("user", userSchema);
