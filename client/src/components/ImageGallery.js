import React, { useEffect, useState } from 'react';
import { fetchImages } from '../services/api';

const ImageGallery = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const loadImages = async () => {
            try {
                const response = await fetchImages();
                setImages(response.data);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        loadImages();
    }, []);

    return (
        <div>
            <h2>Image Gallery</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {images.map((image) => (
                    <div key={image.id}>
                        <img
                            src={`http://localhost:5000${image.filePath}`}
                            alt={image.altText}
                            style={{ maxWidth: '150px', maxHeight: '150px' }}
                        />
                        <p>{image.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
