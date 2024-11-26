import React, { useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { reorderImagesInCollection } from '../services/api';

const ItemType = 'IMAGE';

const DraggableImage = ({ image, index, moveImage }) => {
    const [, ref] = useDrag({
        type: ItemType,
        item: { index },
    });

    const [, drop] = useDrop({
        accept: ItemType,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveImage(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <div ref={(node) => ref(drop(node))} style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '5px' }}>
            <img src={`http://localhost:5000${image.filePath}`} alt={image.altText} style={{ maxWidth: '100px', display: 'block' }} />
            <p>{image.title}</p>
        </div>
    );
};

const ImageReorder = ({ collectionId, images }) => {
    const [orderedImages, setOrderedImages] = useState(images);

    const moveImage = (fromIndex, toIndex) => {
        const updatedImages = [...orderedImages];
        const [movedImage] = updatedImages.splice(fromIndex, 1);
        updatedImages.splice(toIndex, 0, movedImage);
        setOrderedImages(updatedImages);
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
        <DndProvider backend={HTML5Backend}>
            <h3>Reorder Images</h3>
            {orderedImages.map((image, index) => (
                <DraggableImage key={image.id} image={image} index={index} moveImage={moveImage} />
            ))}
            <button onClick={handleSaveOrder}>Save Order</button>
        </DndProvider>
    );
};

export default ImageReorder;
