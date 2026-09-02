import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/errorHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloude } from "../utils/cloudinary.js";
import { ApiRespons } from "../utils/apiResponse.js";
import { option } from "../constants.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = checkIfUserRegister.generateAccessToken();
        const refreshToken = checkIfUserRegister.generateRefreshToken();
        user.refreshToken = refreshToken
       await user.save({validateBeforeSave: false})
        return {accessToken , refreshToken}
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong will generating access and refresh token"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, fullName, password } = req.body;

    if ([userName, email, fullName, password].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    const isUserExist = await User.findOne({
        $or: [{ userName }, { email }],
    });

    if (isUserExist) {
        throw new ApiError(409, "User Already Exist");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatarUploadResult = await uploadOnCloude(avatarLocalPath);
    const coverImageUploadResult = await uploadOnCloude(coverImageLocalPath);

    if (!avatarUploadResult) {
        throw new ApiError(400, "Avatar file is required");
    }

    const createUserResult = await User.create({
        fullName,
        email,
        password,
        userName: userName?.toLowerCase(),
        avatar: avatarUploadResult?.url,
        coverImage: coverImageUploadResult?.url || "",
    });

    const checkIsUserCreated = await User.findById(
        createUserResult?._id
    ).select("-password -refreshToken");

    if (!checkIsUserCreated) {
        throw new ApiError("500", "User Not Created");
    }

    return res
        .status(200)
        .json(
            new ApiRespons(201, checkIsUserCreated, "User Created Successfully")
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body;
    if (!(userName || email)) {
        throw new ApiError(400, " userName and email is required");
    }

    const checkIfUserRegister = await User.findOne({
        $or: [{ userName }, { email }],
    });

    if (!checkIfUserRegister) {
        throw new ApiError(404, "User not found please register first");
    }

    const checkIsPasswordCorrect =
        await checkIfUserRegister.isPasswordCorrect(password);

    if (!checkIsPasswordCorrect) {
        throw new ApiError(400, "Password is incorrect ");
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(checkIfUserRegister?._id);

    
    const loggedInUser =await User.findById(checkIfUserRegister?._id).select("-password -refreshToken")

    
    
    return res.status(200)
    .cookie("accessToken" , accessToken , option)
    .cookie("refreshToken" , refreshToken , option)
    .json(
        new ApiRespons(200 , 
            {user : loggedInUser , accessToken , refreshToken},
            "LoggedIn Successfully"
        )
    )
});


const logOutUser = asyncHandler(async (req, res)=>{

})

export { registerUser, loginUser ,logOutUser};
