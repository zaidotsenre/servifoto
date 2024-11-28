import React from 'react';

const ImageGrid = ({ images, onRemove }) => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {images.map((image) => (
                <div key={image.id} style={{ position: 'relative' }}>
                    <img
                        src={`http://localhost:5000${image.filePath}`}
                        alt={image.altText}
                        style={{ maxWidth: '150px', maxHeight: '150px' }}
                    />
                    <button
                        onClick={() => onRemove(image.id)}
                        style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                        }}
                    >
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ImageGrid;
