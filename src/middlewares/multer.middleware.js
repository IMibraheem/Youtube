import multer from "multer";

const storage = multer.diskStorage({
    destination : function (req, file , cb){
        cb(null , 'public/temp')
    },
    filename: function (req, file , cb){
        const number = Math.random()

        cb(null , file.originalname + number)
    }
})

export const upload = multer({storage}) 