import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv";

dotenv.config();


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "Youtube"
        })
        console.log("file is uploaded on cloudinary ", response.url);
         fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        return null;
    }
}




export const deleteFromCloudinary = async (publicUrl) => {
    try {
        if (!publicUrl) return null;
        
        // Extract public_id from the Cloudinary URL
        const urlParts = publicUrl.split('/');
        const publicIdWithExtension = urlParts.slice(-2).join('/'); // Gets "Youtube/filename.ext"
        const publicId = publicIdWithExtension.split('.')[0]; // Removes the extension
        
        const response = await cloudinary.uploader.destroy(publicId);
        console.log("File deleted from Cloudinary:", response);
        return response;
    } catch (error) {
        console.error("Cloudinary deletion error:", error);
        return null;
    }
}

export default uploadOnCloudinary;

