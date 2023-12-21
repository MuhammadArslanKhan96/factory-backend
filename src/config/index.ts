import dotenv from "dotenv";

require('dotenv').config();
dotenv.config({
    path: "./.env.local",
});
export const PORT = process.env.PORT
export const accessKeyId = process.env.ACESS_KEY_ID;
export const secretAccessKey = process.env.SECRET_ACESS_KEY;
export const region = process.env.RERIGION
export const bucketName = process.env.BUCKET_NAME;
