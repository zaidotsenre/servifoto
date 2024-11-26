import React, { useState, useEffect } from 'react';
import { fetchCollections, fetchImages, addImageToCollection, removeImageFromCollection } from '../services/api';
import ImageReorder from './ImageReorder';

const CollectionManager = () => {
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [allImages, setAllImages] = useState([]);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [newCollectionDescription, setNewCollectionDescription] = useState('');

    useEffect(() => {
        const loadCollections = async () => {
            const response = await fetchCollections();
            setCollections(response.data);
        };

        const loadImages = async () => {
            const response = await fetchImages();
            setAllImages(response.data);
        };

        loadCollections();
        loadImages();
    }, []);

    const handleAddImageToCollection = async (imageId) => {
        if (!selectedCollection) {
            alert('Please select a collection first.');
            return;
        }

        try {
            await addImageToCollection(selectedCollection.id, imageId);
            const updatedCollection = {
                ...selectedCollection,
                images: [...selectedCollection.images, allImages.find((img) => img.id === imageId)],
            };
            setSelectedCollection(updatedCollection);
        } catch (error) {
            console.error('Error adding image to collection:', error);
        }
    };

    const handleRemoveImageFromCollection = async (imageId) => {
        if (!selectedCollection) {
            alert('Please select a collection first.');
            return;
        }

        try {
            await removeImageFromCollection(selectedCollection.id, imageId);
            const updatedCollection = {
                ...selectedCollection,
                images: selectedCollection.images.filter((img) => img.id !== imageId),
            };
            setSelectedCollection(updatedCollection);
        } catch (error) {
            console.error('Error removing image from collection:', error);
        }
    };

    const handleReorderImages = (reorderedImages) => {
        if (selectedCollection) {
            setSelectedCollection({
                ...selectedCollection,
                images: reorderedImages,
            });
        }
    };

    return (
        <div>
            <h2>Manage Collections</h2>
            <div>
                <h3>Create a New Collection</h3>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const newCollection = {
                        name: newCollectionName,
                        description: newCollectionDescription,
                    };
                    // Handle collection creation logic here
                }}>
                    <label>
                        Name:
                        <input
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                        />
                    </label>
                    <label>
                        Description:
                        <input
                            value={newCollectionDescription}
                            onChange={(e) => setNewCollectionDescription(e.target.value)}
                        />
                    </label>
                    <button type="submit">Create Collection</button>
                </form>
            </div>

            <div>
                <h3>Existing Collections</h3>
                <ul>
                    {collections.map((collection) => (
                        <li
                            key={collection.id}
                            onClick={() => setSelectedCollection(collection)}
                            style={{
                                cursor: 'pointer',
                                textDecoration: selectedCollection?.id === collection.id ? 'underline' : 'none',
                            }}
                        >
                            {collection.name}
                        </li>
                    ))}
                </ul>
            </div>

            {selectedCollection && (
                <div>
                    <h3>{selectedCollection.name}</h3>
                    <p>{selectedCollection.description}</p>
                    <h4>Manage Images</h4>
                    <div>
                        <label>Add Image to Collection:</label>
                        <select
                            onChange={(e) => handleAddImageToCollection(parseInt(e.target.value))}
                        >
                            <option value="">-- Select Image --</option>
                            {allImages.map((image) => (
                                <option key={image.id} value={image.id}>
                                    {image.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <h4>Images in Collection</h4>
                    <ImageReorder
                        collectionId={selectedCollection.id}
                        images={selectedCollection.images || []}
                        onOrderChange={handleReorderImages}
                    />
                </div>
            )}
        </div>
    );
};

export default CollectionManager;
