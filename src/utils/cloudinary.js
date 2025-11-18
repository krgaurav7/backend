import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config() // Load environment variables from .env file

import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadonCloudinary = async (localfilePath) => {
    try {
        if (!localfilePath) {
            console.log("No path specified");
            return null;
        }

        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "image", 
        });

        console.log("Cloudinary response:", response);

        // delete local file AFTER upload
        if (fs.existsSync(localfilePath)) {
            fs.unlinkSync(localfilePath);
        }

        return response;

    } catch (error) {
        console.log("Cloudinary Upload Failed:", error.message);

        if (fs.existsSync(localfilePath)) {
            fs.unlinkSync(localfilePath);
        }

        return null;
    }
};


export { uploadonCloudinary };