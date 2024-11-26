const express = require('express');
const { Collection } = require('../models');
const router = express.Router();

// Create a new collection
router.post('/collections', async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCollection = await Collection.create({ name, description });
        res.status(201).json(newCollection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all collections
router.get('/collections', async (req, res) => {
    try {
        const collections = await Collection.findAll();
        res.status(200).json(collections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get collection by ID
router.get('/collections/:id', async (req, res) => {
    try {
        const collection = await Collection.findByPk(req.params.id);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        res.status(200).json(collection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update collection by ID
router.put('/collections/:id', async (req, res) => {
    try {
        const { name, description } = req.body;
        const collection = await Collection.findByPk(req.params.id);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        collection.name = name || collection.name;
        collection.description = description || collection.description;
        await collection.save();
        res.status(200).json(collection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete collection by ID
router.delete('/collections/:id', async (req, res) => {
    try {
        const collection = await Collection.findByPk(req.params.id);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        await collection.destroy();
        res.status(204).json({ message: 'Collection deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
