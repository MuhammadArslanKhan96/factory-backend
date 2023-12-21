import axios from 'axios';
import AWS from 'aws-sdk';
import { accessKeyId, bucketName, region, secretAccessKey } from '../../config';


AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region,
});
const s3 = new AWS.S3();

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
            //@ts-ignore
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