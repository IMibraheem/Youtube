import dotenv from 'dotenv'
import { mongoDbConnection } from "./db/index.js";
dotenv.config({path: './env'})

mongoDbConnection(process.env.MONGODB_URI)