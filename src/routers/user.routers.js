import { Router } from "express";
import { loginUser, logOutUser, refreshToken, registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { checkAuthentication } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register" , 
     upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),

     registerUser )

     router.post( '/login' , loginUser )
     router.post( '/logout' , checkAuthentication , logOutUser )
     router.post( '/refreshToken' , refreshToken )


export default router;
