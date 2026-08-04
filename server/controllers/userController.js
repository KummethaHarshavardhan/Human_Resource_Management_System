import Employees from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import FORGOT from '../models/forgotModel.js';
import transporter from '../config/mail.js';
import dotenv from 'dotenv';
dotenv.config()


export const EmpRegister=async(req,res)=>{
    console.log(req.body);
    
    try{
        const {name,email,password,confirm_password,role}=req.body;
        if(password!==confirm_password){
            return res.status(400).json({success:false,message:"password and confirma password does not matched"})
        }
        const UserExists=await Employees.findOne({email});
        if(UserExists){
            return res.status(409).json({success:false,message:"Email Already Exist Try another One"});
        }
        const hashpass=await bcrypt.hash(password,10);
        const newuser=new Employees({
            name,
            email,
            password:hashpass,
            role
        });
        await newuser.save();
        return res.status(200).json({success:true,message:"Employee Details Store SuccessFully"})
    }catch(err){
        return res.status(500).json({success:false,message:`Invalid Request ${err.message}`});

    }
}

export const EmpLogin=async(req,res)=>{
    try{
        const { email, password } = req.body;
        const empdata=await Employees.findOne({email});
        const user = await Employees.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Check your Email & Password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Check your Email & Password" });
        }
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
             process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );
        return res.status(200).cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            })
            .json({
                success: true,
                message: "Employee Logged In",
                token,
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
            });
    }catch(err){
        console.log("LOGIN ERROR:", err);
        return res.status(500).json({success:false,message:"Sorry Invalid Request"});
    }
}

export const EmpOtp=async(req ,res)=>{
    try{
        const {email}=req.body;
        console.log("Email:", email);
        const userExist=await Employees.findOne({email});
        if(!userExist){
            return res.status(404).json({success:false,message:"User doesnot have any account"});
        }

        const otp=Math.floor(1000 + Math.random()*9000).toString();

        await FORGOT.findOneAndUpdate(
            {email},{
                email,
                otp,
                otpExpiry:Date.now()+5*60*1000
            },
            {
                upsert:true,
                returnDocument:"after"
            }
        );
        await transporter.verify();
        await transporter.sendMail({
            from:process.env.EMAIL,
            to:email,
            subject:"password Reset OTP",
            text:`Your OTP is ${otp}.It is valid for 5 min`
        });
        return res.status(200).json({success:true,message:"OTP send Successfully"})

    }catch(err){
        console.log(err)
        return res.status(500).json({success:false,message:"Invalid Request"})
    }
};

export const verifyOtp=async(req ,res)=>{
    try{
        const { email, otp }=req.body;
        const otpdata=await FORGOT.findOne({email, otp});
        if(!otpdata){
            return res.status(404).json({success:true,message:"Invalid OTP"})
        }
        if(otpdata.otpExpiry<Date.now()){
            return res.status(400).json({success:false,message:'OTP Expired'});
        }
        return res.status(200).json({success:true,message:"OTP verified SuccessFully"});
    
    }catch(err){
        return res.status(500).json({success:false,message:"Internal server is error"})
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        if (newPassword != confirmPassword) {
            return res.status(400).json({ success: false, message: "Password Not Match" });
        }
        const user = await Employees.findOne({ email }); // fixed: was undefined "USER"
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();
        await FORGOT.findOneAndDelete({ email });
        return res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Invalid server error" });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await Employees.findById(req.user.id).select("-password -confirm_password");
        return res.status(200).json({ success: true, user });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Error fetching profile" });
    }
};