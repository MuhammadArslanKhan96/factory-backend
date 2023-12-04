import axios from 'axios';
//@ts-ignore
import * as cloudinary from 'cloudinary';
import dotenv from 'dotenv';
require('dotenv').config();

const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;

cloudinary.v2.config({
    cloud_name,
    api_key,
    api_secret,
});

const uploadImage = async (image: string) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };

    try {
        // Upload the image
        const response = await axios.get(image, {
            responseType: "arraybuffer",
            headers: {
                "Cookie": "LastSite=gb-en-001; JHYSESSIONID=Y14-fe3a42fd-9068-40c6-9a33-f00f93d7b72b; ROUTE=.accstorefront-595b85f95c-5d28z",
                "Cache-Control": "no-cache",
                "User-Agent": "Your-User-Agent",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
            },
        });

        const buffer = Buffer.from(response.data);

        const imageDataString = buffer.toString('base64');
        //@ts-ignore
        const result: any = await cloudinary.uploader.upload(`data:image/png;base64,${imageDataString}`, options); // Using 'any' to bypass TypeScript error
        const secureURL = result.secure_url;
        return secureURL;
    } catch (error: any) {
        throw error;
    }
};

export default uploadImage;
