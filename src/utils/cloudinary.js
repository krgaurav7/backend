import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs/promises'; // use promises API

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadonCloudinary = async (localfilePath) => {
    if (!localfilePath) {
        console.log("No path specified");
        return null;
    }

    try {
        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "image", 
        });

        // delete local file after upload
        await fs.unlinkSync(localfilePath).catch(() => {});
        return response;
    } catch (error) {
        console.log("Cloudinary Upload Failed:", error.message);

        await fs.unlink(localfilePath).catch(() => {});
        return null;
    }
};

export { uploadonCloudinary };