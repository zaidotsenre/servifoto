import React, { useState, useEffect } from 'react';
import { fetchCollections, fetchCollectionImages, createCollection, deleteCollection } from '../services/api';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    CardMedia,
    TextField,
    Container,
} from '@mui/material';

const HomePage = () => {
    const [collections, setCollections] = useState([]);
    const [thumbnails, setThumbnails] = useState({}); // Store thumbnails for collections
    const [newCollectionName, setNewCollectionName] = useState('');
    const [newCollectionDescription, setNewCollectionDescription] = useState('');

    useEffect(() => {
        const loadCollections = async () => {
            const collectionsResponse = await fetchCollections();
            setCollections(collectionsResponse.data);

            // Fetch thumbnails for each collection
            collectionsResponse.data.forEach(async (collection) => {
                try {
                    const imagesResponse = await fetchCollectionImages(collection.id);
                    if (imagesResponse.data.length > 0) {
                        // Use the first image as the thumbnail
                        setThumbnails((prev) => ({
                            ...prev,
                            [collection.id]: `http://localhost:5000/${imagesResponse.data[0]?.filePath}`,
                        }));
                    }
                } catch (error) {
                    console.error(`Error fetching images for collection ${collection.id}:`, error);
                }
            });
        };

        loadCollections();
    }, []);

    const handleCreateCollection = async () => {
        const newCollection = { name: newCollectionName, description: newCollectionDescription };
        const response = await createCollection(newCollection);
        setCollections([...collections, response.data]);
        setNewCollectionName('');
        setNewCollectionDescription('');
    };

    const handleDeleteCollection = async (collectionId) => {
        await deleteCollection(collectionId);
        setCollections(collections.filter((collection) => collection.id !== collectionId));
    };

    return (
        <Container>
            <Typography variant="h3" gutterBottom>
                My Collections
            </Typography>
            <Box
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateCollection();
                }}
                sx={{ display: 'flex', gap: 2, mb: 4 }}
            >
                <TextField
                    label="Collection Name"
                    variant="outlined"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    value={newCollectionDescription}
                    onChange={(e) => setNewCollectionDescription(e.target.value)}
                    required
                    fullWidth
                />
                <Button type="submit" variant="contained" color="primary">
                    Create
                </Button>
            </Box>
            <Grid container spacing={3}>
                {collections.map((collection) => (
                    <Grid item xs={12} sm={6} md={4} key={collection.id}>
                        <Card>
                            {thumbnails[collection.id] ? (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={thumbnails[collection.id]} // Thumbnail from state
                                    alt={collection.name}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        height: 140,
                                        backgroundColor: '#f0f0f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography variant="subtitle1" color="textSecondary">
                                        No Images
                                    </Typography>
                                </Box>
                            )}
                            <CardContent>
                                <Typography variant="h5">{collection.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {collection.description}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        href={`/collections/${collection.id}`}
                                    >
                                        View
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleDeleteCollection(collection.id)}
                                        sx={{ ml: 2 }}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default HomePage;
