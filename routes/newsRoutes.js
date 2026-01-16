const express = require('express');
const router = express.Router();
const multer = require('multer');
const {storage, cloudinary} = require('../cloudConfig'); // Import the Cloudinary storage configuration
const mongoose = require('mongoose');
const News = require('../models/news');
const { isAuthenticated, isReceptionist,isDoctor } = require("../middleware/middleware");

const upload = multer({ storage }); // Use the Cloudinary storage

// Upload route
router.post('/upload-news', upload.single('newsImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imageUrl = req.file.path; // Cloudinary URL

        const newNews = new News({
            imageUrl: imageUrl
        });

        const savedImage = await newNews.save();

        res.status(200).json({
            imageUrl: savedImage.imageUrl,
            imageId: savedImage._id.toString()
        });
    } catch (error) {
        console.error('Error saving image to database:', error);
        res.status(500).json({ error: 'Error saving image to database' });
    }
});

module.exports = router;

// Get all images route
router.get('/get-news-images', async (req, res) => {
    try {
        const news = await News.find();
        res.json({
            images: news.map(item => ({
                imageUrl: item.imageUrl,
                imageId: item._id.toString()
            }))
        });
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Error fetching images' });
    }
});

// Delete image route
router.delete('/delete-news/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id === 'undefined') {
            return res.status(400).json({ error: 'Image ID is undefined or invalid' });
        }

        const deletedNews = await News.findByIdAndDelete(id);

        if (!deletedNews) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Extract public_id from the image URL
        const publicId = deletedNews.imageUrl.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);

        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image: ' + error.message });
    }
});

// Route for patients to view news
router.get('/news', async (req, res) => {
    try {
        const newsList = await News.find({}).sort({ createdAt: -1 }); // Sort by creation date in descending order
        res.render('news', { newsList });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;