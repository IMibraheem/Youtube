import jwt from "jsonwebtoken"
import ApiError from "../utils/errorHandler.js"
import { User } from "../models/user.model.js"

const checkAuthentication = async (req, res , next) =>{
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer " ,"")

        console.log(token , 'token')
    
        if (!token) {
            throw new ApiError(401 , 'Unathorized Request')
        }
    
        const decodeToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")

            if (!user) {
            throw new ApiError(401 , 'Invalid Access Token')
        }
    
    
        req.user = user
        next()
    } catch (error) {
         console.log("AUTH ERROR:", error);
    throw error;
    }

    
}

export {checkAuthentication}