import axios from 'axios';
import AWS from 'aws-sdk';

// const AcessKey = "AKIAQ6JHZEUQHWSUJ2EN";
// const secretKey = "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";
AWS.config.update({
    accessKeyId: 'AKIAQ6JHZEUQHWSUJ2EN',
    secretAccessKey: '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',
    region: 'us-east-1',
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


