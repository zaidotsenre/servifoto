import React, { useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { reorderImagesInCollection } from '../services/api';

const DraggableImage = ({ image, index, moveImage }) => {
    const [, ref] = useDrag({
        type: 'IMAGE',
        item: { index },
    });

    const [, drop] = useDrop({
        accept: 'IMAGE',
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveImage(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <div
            ref={(node) => ref(drop(node))}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #ccc',
                padding: '10px',
                marginBottom: '5px',
                backgroundColor: '#f9f9f9',
            }}
        >
            <img
                src={`http://localhost:5000${image.filePath}`}
                alt={image.altText}
                style={{ maxWidth: '100px', marginRight: '10px' }}
            />
            <span>{image.title}</span>
        </div>
    );
};

const ImageReorder = ({ collectionId, images = [], onOrderChange }) => {
    const [orderedImages, setOrderedImages] = useState(images);

    const moveImage = (fromIndex, toIndex) => {
        const updatedImages = [...orderedImages];
        const [movedImage] = updatedImages.splice(fromIndex, 1);
        updatedImages.splice(toIndex, 0, movedImage);
        setOrderedImages(updatedImages);
        onOrderChange(updatedImages);
    };

    const handleSaveOrder = async () => {
        const orderData = orderedImages.map((image, index) => ({
            imageId: image.id,
            order: index + 1,
        }));

        try {
            await reorderImagesInCollection(collectionId, orderData);
            alert('Image order saved successfully!');
        } catch (error) {
            console.error('Error saving order:', error);
        }
    };

    return (
        <div>
            <h3>Reorder Images</h3>
            <DndProvider backend={HTML5Backend}>
                {orderedImages.map((image, index) => (
                    <DraggableImage
                        key={image.id}
                        image={image}
                        index={index}
                        moveImage={moveImage}
                    />
                ))}
            </DndProvider>
            <button onClick={handleSaveOrder} style={{ marginTop: '10px' }}>
                Save Order
            </button>
        </div>
    );
};

export default ImageReorder;
