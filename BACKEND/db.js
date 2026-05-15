import mongoose  from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

const connectdb=async ()=>{
    try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("DB is connected")
    }
    catch (error) {
    console.log("ERROR-->",error)
    }

}
export default connectdb;