const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const bucketName = process.env.AWS_BUCKET_NAME;

// Function to upload a profile picture
const uploadProfilePicture = async (userId, filePath) => {
    const fileContent = fs.readFileSync(filePath);
    const keyPrefix = `users/${userId}/profile-picture/`;
    const params = {
        Bucket: bucketName,
        Key: `${keyPrefix}${path.basename(filePath)}`,
        Body: fileContent,
        ContentType: 'image/jpeg',
        ACL: 'public-read'
    };

    try {
        const data = await s3.upload(params).promise();
        const profilePictureUrl = data.Location;
        const updateQuery = `
            UPDATE users
            SET "profilePictureUrl" = $1
            WHERE id = $2
        `;
        await pool.query(updateQuery, [profilePictureUrl, userId]);

        return profilePictureUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Error uploading file');
    }
};