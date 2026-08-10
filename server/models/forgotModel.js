import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {

    email: {
      type: String,
      required: true,
      unique: true,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },
    newPassword:{
        type:String,
        minlength:6,
    },
    confirmPassword:{
        type:String,
        minlength:6,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("FORGOT", UserSchema);