const express = require('express');
const upload = require('../config/upload'); // Multer configuration for storage
const { Image } = require('../models');
const router = express.Router();

// Create a new image
router.post('/images', upload.single('image'), async (req, res) => {
    try {
        const { title, altText } = req.body; // Metadata from the request body
        const filePath = process.env.NODE_ENV === 'production'
            ? req.file.location // S3 URL in production
            : `/uploads/${req.file.filename}`; // Local file path in development

        // Save the image metadata and file path to the database
        const newImage = await Image.create({
            title,
            altText,
            filePath,
        });

        res.status(201).json(newImage); // Return the created record
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Get all images
router.get('/images', async (req, res) => {
    try {
        const images = await Image.findAll();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get image by ID
router.get('/images/:id', async (req, res) => {
    try {
        const image = await Image.findByPk(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update image by ID
router.put('/images/:id', async (req, res) => {
    try {
        const { title, altText, filePath } = req.body;
        const image = await Image.findByPk(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        image.title = title || image.title;
        image.altText = altText || image.altText;
        image.filePath = filePath || image.filePath;
        await image.save();
        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete image by ID
router.delete('/images/:id', async (req, res) => {
    try {
        const image = await Image.findByPk(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        await image.destroy();
        res.status(204).json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
