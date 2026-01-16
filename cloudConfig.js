const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
if(process.env.NODE_KEY != "production"){
    require('dotenv').config();
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, // Replace with your Cloudinary cloud name
    api_key: process.env.CLOUD_API_KEY,       // Replace with your Cloudinary API key
    api_secret: process.env.CLOUD_API_SECRET  // Replace with your Cloudinary API secret
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'news', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed file formats
    },
});

module.exports = {
    cloudinary,
    storage
};