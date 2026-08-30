import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCloude = async (localFilePath) => {
    try {
        if (!localFilePath) return;

        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        if (!uploadResult) return
        fs.unlinkSync(localFilePath)
        console.log('File Uploaded Successfully' , uploadResult.secure_url)
        return uploadResult
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null 
    }
};


const optimizedUrl = async (publicId , options ={})=>{
return cloudinary.url(publicId,{
quality: 'auto',
fetch_format : 'auto',
...options
})
}

export {uploadOnCloude , optimizedUrl}