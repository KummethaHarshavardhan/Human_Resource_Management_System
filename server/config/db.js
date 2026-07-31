import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

const connectDB=async(req ,res)=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDb connected successFully');
    }catch(err){
        console.log(`mongodb is not connected ${err}`);
    }
}

export default connectDB;



