import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchCollection,
    fetchCollectionImages,
    reorderImagesInCollection,
    uploadImage,
    removeImageFromCollection,
} from '../services/api';
import {
    Box,
    Typography,
    Container,
    Card,
    CardMedia,
    CardActions,
    Button,
} from '@mui/material';
import ImageUploadForm from '../components/ImageUploadForm';

const CollectionView = () => {
    const { id } = useParams(); // Collection ID from route
    const navigate = useNavigate(); // For navigation
    const [collection, setCollection] = useState(null);
    const [images, setImages] = useState([]); // Store images
    const [draggedIndex, setDraggedIndex] = useState(null);

    // Load collection details and images on mount
    useEffect(() => {
        const loadCollection = async () => {
            try {
                const response = await fetchCollection(id);
                setCollection(response.data);
            } catch (error) {
                console.error('Error fetching collection:', error);
            }
        };

        const loadImages = async () => {
            try {
                const response = await fetchCollectionImages(id);
                // Ensure images are sorted by `order`
                const sortedImages = response.data.sort((a, b) => a.order - b.order);
                setImages(sortedImages);
            } catch (error) {
                console.error('Error fetching collection images:', error);
            }
        };

        loadCollection();
        loadImages();
    }, [id]);

    const handleImageUpload = async (formData) => {
        try {
            const response = await uploadImage(id, formData);
            // Add all new images to the current list
            setImages((prev) => [...prev, ...response.data]);
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    };

    const handleRemoveImage = async (imageId) => {
        try {
            await removeImageFromCollection(id, imageId);
            setImages((prev) => prev.filter((image) => image.id !== imageId));
        } catch (error) {
            console.error('Error removing image:', error);
        }
    };

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (index) => {
        if (draggedIndex === null || draggedIndex === index) return;

        const updatedImages = [...images];
        const [draggedImage] = updatedImages.splice(draggedIndex, 1);
        updatedImages.splice(index, 0, draggedImage);

        // Update the order locally
        updatedImages.forEach((image, idx) => (image.order = idx));
        setImages(updatedImages);

        // Send the new order to the backend
        const orderData = updatedImages.map((image) => ({
            imageId: image.id,
            order: image.order,
        }));

        try {
            await reorderImagesInCollection(id, orderData);
        } catch (error) {
            console.error('Error reordering images:', error);
        }
    };

    if (!collection) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                }}
            >
                <Typography variant="h3">{collection.name}</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/')}
                >
                    Back to Homepage
                </Button>
            </Box>
            <Typography variant="body1" color="textSecondary" gutterBottom>
                {collection.description}
            </Typography>

            {/* Upload Form */}
            <ImageUploadForm onUpload={handleImageUpload} />

            {/* Image List with Drag-and-Drop */}
            {images.length === 0 ? (
                <Typography>No images in this collection</Typography>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 3,
                    }}
                >
                    {images.map((image, index) => (
                        <Box
                            key={image.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(index)}
                            sx={{ cursor: 'move' }}
                        >
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="150"
                                    image={`${image.filePath}`}
                                    alt={image.altText}
                                />
                                <CardActions>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleRemoveImage(image.id)}
                                    >
                                        Remove
                                    </Button>
                                </CardActions>
                            </Card>
                        </Box>
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default CollectionView;
