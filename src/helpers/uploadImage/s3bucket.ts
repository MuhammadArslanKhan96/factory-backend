import axios from 'axios';
import AWS from 'aws-sdk';
import dotenv from "dotenv";
//@ts-ignore
dotenv.config("dotnev");
const accessKeyId = process.env.ACESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACESS_KEY;
const region = process.env.RERIGION

AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region,
});
const s3 = new AWS.S3();
const bucketName = 'factoryhelp-backend';

export const uploadImageToS3 = async (imageUrl: any, key: any) => {
    try {
        const response = await axios.get(imageUrl, {
            headers: {
                "Cookie": "LastSite=gb-en-001; JHYSESSIONID=Y14-fe3a42fd-9068-40c6-9a33-f00f93d7b72b; ROUTE=.accstorefront-595b85f95c-5d28z",
                "Cache-Control": "no-cache",
                "User-Agent": "Your-User-Agent",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
            },
            responseType: 'arraybuffer'
        });
        const fileContent = Buffer.from(response.data, 'binary');

        const result = await s3.upload({
            Bucket: bucketName,
            Key: key,
            Body: fileContent,
            ACL: 'public-read',
        }).promise();

        const uploadedImageUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
        return uploadedImageUrl;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
};