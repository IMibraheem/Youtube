import jwt from "jsonwebtoken"
import ApiError from "../utils/errorHandler"
import { User } from "../models/user.model"

const checkAuthentication = async (req, res, next) =>{
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer " ,"")
    
        if (!token) {
            throw new ApiError(401 , 'Unathorized Request')
        }
    
        const decodeToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")

            if (!user) {
            throw new ApiError(401 , 'Invalid Access Token')
        }
    
    
        req.user = user
    } catch (error) {
        throw new ApiError(500 , 'Something Went Wrong')
    }

    
}