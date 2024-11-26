import React, { useState } from 'react';
import { uploadImage } from '../services/api';

const ImageUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [altText, setAltText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);
        formData.append('altText', altText);

        try {
            const response = await uploadImage(formData);
            onUploadSuccess(response.data); // Notify parent component of new image
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Image File:
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            </label>
            <label>
                Title:
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label>
                Alt Text:
                <input value={altText} onChange={(e) => setAltText(e.target.value)} />
            </label>
            <button type="submit">Upload</button>
        </form>
    );
};

export default ImageUpload;
