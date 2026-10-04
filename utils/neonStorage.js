const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const path = require("path");

// Configure the S3 Client for Neon Object Storage
const s3 = new S3Client({
    region: process.env.NEON_STORAGE_REGION || "auto",
    endpoint: process.env.NEON_STORAGE_ENDPOINT,
    forcePathStyle: true, // Required for Neon Object Storage
    credentials: {
        accessKeyId: process.env.NEON_STORAGE_ACCESS_KEY,
        secretAccessKey: process.env.NEON_STORAGE_SECRET_KEY,
    }
});

/**
 * Uploads a file buffer to Neon Object Storage and returns the public URL
 * @param {Buffer} fileBuffer - The file buffer from multer
 * @param {string} originalName - The original file name
 * @param {string} mimeType - The mime type of the file
 * @returns {Promise<string>} The public URL of the uploaded image
 */
async function uploadToNeon(fileBuffer, originalName, mimeType) {
    if (!process.env.NEON_STORAGE_BUCKET || !process.env.NEON_PUBLIC_DOMAIN) {
        throw new Error("Missing Neon Storage environment variables. Please check your .env file.");
    }

    // Generate a unique filename
    const uniqueSuffix = crypto.randomBytes(16).toString("hex");
    const extension = path.extname(originalName);
    const fileName = `campgrounds/${uniqueSuffix}${extension}`;

    const command = new PutObjectCommand({
        Bucket: process.env.NEON_STORAGE_BUCKET,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
    });

    try {
        await s3.send(command);
        // Return the public URL for the image
        return `${process.env.NEON_PUBLIC_DOMAIN}/${fileName}`;
    } catch (error) {
        console.error("Error uploading to Neon Storage:", error);
        throw error;
    }
}

module.exports = { uploadToNeon };
