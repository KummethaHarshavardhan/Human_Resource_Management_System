import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["Admin", "HR", "Employee"],
      default: "Employee",
    },

    phone: {
      type: Number,
    },

    department: {
      type: String,
      default: "General",
    },

    googleId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Employees", UserSchema);