import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
export const mongoDbConnection = async ()=>{
    try {
        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDb Connected SuccessFully on Host : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error('Error' , error)
        process.exit(1)
    }
}
