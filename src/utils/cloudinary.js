import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (filePath) => {
    try{
        if (!filePath){
            console.log("No file path provided for upload.");
            return null;
        }
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto'
        })
        console.log("Uploaded to Cloudinary: ", response.secure_url);
        return response.url;
    }catch(err){
        fs.unlinkSync(filePath);
        console.error("Cloudinary upload error: ", err);
        return null;
    }
}

export {uploadToCloudinary};