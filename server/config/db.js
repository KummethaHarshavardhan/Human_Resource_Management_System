import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connctDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDb connected successfully");
    } catch (err) {
        console.log(`MongoDB is not connected: ${err.message}`);
    }
};

export default connctDB;