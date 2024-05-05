import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
import dotenv from 'dotenv';
dotenv.config();
import { imageValidator } from './helper.js';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });
export const uploadToCloudinary = async (req, res, next) => {
    try {
        const files = req.file;
        if (!files) {
            return next(new Error('No files provided'));
        }
        const message = imageValidator(files?.size, files?.mimetype);
        if (message !== null) {
            return res.status(400).json({
                "message": message
            });
        }
        const cloudinaryUrls = [];
        const resizedBuffer = await sharp(files.buffer)
            .resize({ width: 800, height: 600 })
            .toBuffer();
        const uploadStream = cloudinary.uploader.upload_stream({
            resource_type: 'auto',
            folder: 'profile-pictures',
        }, (err, result) => {
            if (err) {
                console.error('Cloudinary upload error:', err);
                return next(err);
            }
            if (!result) {
                console.error('Cloudinary upload error: Result is undefined');
                return next(new Error('Cloudinary upload result is undefined'));
            }
            cloudinaryUrls.push(result.secure_url);
            if (cloudinaryUrls.length === 1) {
                //All files processed now get your images here
                req.body.cloudinaryUrls = cloudinaryUrls;
                next();
            }
        });
        uploadStream.end(resizedBuffer);
    }
    catch (error) {
        console.error('Error in uploadToCloudinary middleware:', error);
        next(error);
    }
};
