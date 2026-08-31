import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async(req, res)=>{
    console.log('runn controller')
   return res.status(200).json({
        message: 'Post Request work successfully'
    })
})

export {registerUser}