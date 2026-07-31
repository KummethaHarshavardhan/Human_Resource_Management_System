import Employees from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import FORGOT from "../models/forgotModel.js";
import transporter from "../config/mail.js";
import dotenv from "dotenv";
dotenv.config();

import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const EmpRegister = async (req, res) => {
    try {
        const {name,email,password,confirm_password,role,phone,department} = req.body;
        if (password !== confirm_password) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match"
            });
        }
        const userExists = await Employees.findOne({ email });
        if (userExists) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new Employees({
            name,
            email,
            password: hashPassword,
            role,
            phone,
            department
        });
        await newUser.save();
        return res.status(201).json({
            success: true,
            message: "Employee Registered Successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


export const EmpLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Employees.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );
        return res.status(200).json({
            success: true,
            message: "Login Success",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                department: user.department
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID

        });
        const payload = ticket.getPayload();
        const { email, name, sub } = payload;
        let user = await Employees.findOne({ email });
        if (!user) {
            const randomPassword = await bcrypt.hash(sub, 10);
            user = await Employees.create({
                name,
                email,
                password: randomPassword,
                googleId: sub,
                role: "Employee"
            });
        }
        const jwtToken = jwt.sign({
            id: user._id,
            email: user.email,
            role: user.role
        },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );
        return res.status(200).json({
            success: true,
            message: "Google Login Success",
            token: jwtToken,
            user
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Google Login Failed"
        });
    }
};

//empotp

export const EmpOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Employees.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await FORGOT.findOneAndUpdate(
            { email },
            {
                email,
                otp,
                otpExpiry: Date.now() + 5 * 60 * 1000
            },
            {
                upsert: true,
                returnDocument: "after"
            }
        );
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP is ${otp}`
        });
        return res.status(200).json({

            success: true,
            message: "OTP Sent"

        });

    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message

        });
    }

};


export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpData = await FORGOT.findOne({
            email,
            otp
        });
        if (!otpData) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        if (otpData.otpExpiry < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP Expired"
            });
        }
        return res.status(200).json({
            success: true,
            message: "OTP Verified"
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};



export const resetPassword = async (req, res) => {
    try {
        const {
            email,
            newPassword,
            confirmPassword
        } = req.body;
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }
        const user = await Employees.findOne({
            email
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        await FORGOT.findOneAndDelete({
            email
        });
        return res.status(200).json({
            success: true,
            message: "Password Updated"
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


