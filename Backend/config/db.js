const mongoose=require("mongoose");
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb Connected")

    }
    catch(error){
        console.error("Mongodb connection failed",err);

    }
}
module.exports=connectDB;