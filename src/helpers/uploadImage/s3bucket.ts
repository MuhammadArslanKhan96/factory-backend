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

export const uploadImageToS3 = async (imageUrl: string, key: string): Promise<string> => {
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const fileContent = Buffer.from(response.data, 'binary');

        await s3.upload({
            Bucket: bucketName,
            Key: key,
            Body: fileContent,
            ACL: 'public-read',
        }).promise();

        const uploadedImageUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
        return uploadedImageUrl;
    } catch (error) {
        throw error;
    }
};


