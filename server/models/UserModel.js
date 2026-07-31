import mongoose from "mongoose";
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["Admin","HR","Employee"],
        default:"Employee",
    },
},
{
    timestamps: true,
}
);
export default mongoose.model("Employees",UserSchema);