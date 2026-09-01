import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from '../utils/errorHandler.js'
import {User} from '../models/user.model.js'
import {uploadOnCloude} from '../utils/cloudinary.js'
import { ApiRespons } from "../utils/apiResponse.js";


const registerUser = asyncHandler(async(req, res)=>{
    const {userName , email , fullName , password} = req.body

    if ([userName, email, fullName, password]
    .some(field => !field?.trim())) {
        throw new ApiError(400 , 'All fields are required');
    }

    const isUserExist = await User.findOne({
        $or:[{userName} , {email}]
    })

    if (isUserExist) {
        throw new ApiError(409 , 'User Already Exist')
    }
    
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
    if (!avatarLocalPath) {
        throw new ApiError(400 , 'Avatar file is required')
    }
    
    const avatarUploadResult = await uploadOnCloude(avatarLocalPath)
    const coverImageUploadResult = await uploadOnCloude(coverImageLocalPath)
    
    if (avatarUploadResult) {
        throw new ApiError(400 , 'Avatar file is required')
    }

    const createUserResult= await User.create({
        fullName,
        email,
        password,
        userName: userName?.toLowerCase(),
        avatar: avatarLocalPath?.url, 
        coverImage: coverImageLocalPath?.url || "", 
    })

    const checkIsUserCreated = await User.findById(createUserResult?._id).select("-password -refreshToken")

    if (!checkIsUserCreated) {
        throw new ApiError('500' , 'User Not Created')
    }
    
    return res.status(200).json(
        new ApiRespons(201 , checkIsUserCreated , 'User Created Successfully')
    )
})

export {registerUser}