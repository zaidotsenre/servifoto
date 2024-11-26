const express = require('express');
const { Collection, Image, CollectionImage } = require('../models');
const router = express.Router();

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
