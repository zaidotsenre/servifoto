const express = require('express');
const { Collection, Image, CollectionImage } = require('../models');
const router = express.Router();
const upload = require('../config/upload'); // Use S3 upload configuration

// Fetch all images in a specific collection
router.get('/collections/:collectionId/images', async (req, res) => {
    try {
        const { collectionId } = req.params;
        const { paginate = 'false', limit = 10, offset = 0 } = req.query;

        if (paginate === 'true') {
            // Paginated response
            const { count, rows } = await CollectionImage.findAndCountAll({
                where: { collectionId },
                include: [
                    {
                        model: Image,
                        attributes: ['id', 'filePath', 'altText', 'title'],
                    },
                ],
                order: [['order', 'ASC']],
                limit: parseInt(limit, 10),
                offset: parseInt(offset, 10),
            });

            const imageDetails = rows.map((ci) => ({
                id: ci.Image.id,
                filePath: ci.Image.filePath,
                altText: ci.Image.altText,
                title: ci.Image.title,
                order: ci.order,
            }));

            return res.status(200).json({
                images: imageDetails,
                total: count,
            });
        } else {
            // Non-paginated response (return all images)
            const images = await CollectionImage.findAll({
                where: { collectionId },
                include: [
                    {
                        model: Image,
                        attributes: ['id', 'filePath', 'altText', 'title'],
                    },
                ],
                order: [['order', 'ASC']],
            });

            const imageDetails = images.map((ci) => ({
                id: ci.Image.id,
                filePath: ci.Image.filePath,
                altText: ci.Image.altText,
                title: ci.Image.title,
                order: ci.order,
            }));

            return res.status(200).json(imageDetails);
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Failed to fetch images for the collection' });
    }
});

// Upload multiple images to a collection
router.post('/collections/:collectionId/images', upload.array('images'), async (req, res) => {
    try {
        const { collectionId } = req.params;
        const { title, altText } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        if (!title || !altText) {
            return res.status(400).json({ error: 'Title and altText are required' });
        }

        const collection = await Collection.findByPk(collectionId);
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        // Save all images and associate them with the collection
        const createdImages = [];
        for (const file of req.files) {
            const filePath = file.location; // Correctly fetch S3 URL

            const newImage = await Image.create({
                filePath,
                title,
                altText,
            });

            await CollectionImage.create({
                collectionId,
                imageId: newImage.id,
            });

            createdImages.push(newImage);
        }

        res.status(201).json(createdImages); // Return all created images
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ error: 'Failed to upload images' });
    }
});

// Add an image to a collection
router.post('/collections/:collectionId/images/:imageId', async (req, res) => {
    try {
        const { collectionId, imageId } = req.params;
        const collection = await Collection.findByPk(collectionId);
        const image = await Image.findByPk(imageId);

        if (!collection || !image) {
            return res.status(404).json({ message: 'Collection or Image not found' });
        }

        // Add the image to the collection with an initial order value of 0
        await collection.addImage(image, { through: { order: 0 } });
        res.status(201).json({ message: 'Image added to collection' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove an image from a collection
router.delete('/collections/:collectionId/images/:imageId', async (req, res) => {
    try {
        const { collectionId, imageId } = req.params;
        const collection = await Collection.findByPk(collectionId);
        const image = await Image.findByPk(imageId);

        if (!collection || !image) {
            return res.status(404).json({ message: 'Collection or Image not found' });
        }

        // Remove the image from the collection
        await collection.removeImage(image);
        res.status(204).json({ message: 'Image removed from collection' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reorder images in a collection
router.post('/collections/:collectionId/reorder', async (req, res) => {
    try {
        const { collectionId } = req.params;
        const { orderData } = req.body; // [{ imageId: 1, order: 2 }, ...]

        const collection = await Collection.findByPk(collectionId);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        // Update the order of each image in the collection
        await Promise.all(
            orderData.map(({ imageId, order }) =>
                CollectionImage.update(
                    { order },
                    { where: { collectionId, imageId } }
                )
            )
        );

        res.status(200).json({ message: 'Images reordered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
