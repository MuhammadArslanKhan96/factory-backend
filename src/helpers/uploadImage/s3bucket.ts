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
        // Fetch the image from the URL using Axios
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const fileContent = Buffer.from(response.data, 'binary');

        // Upload the image to S3
        const result = await s3.upload({
            Bucket: bucketName,
            Key: key,
            Body: fileContent,
            ACL: 'public-read', // Set ACL to public-read for public access
        }).promise();

        // Construct the URL of the uploaded image
        const uploadedImageUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
        return uploadedImageUrl;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
};