import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const ImageUploadForm = ({ onUpload }) => {
    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState('');
    const [altText, setAltText] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

        const invalidFiles = selectedFiles.filter(
            (file) => !validTypes.includes(file.type)
        );

        if (invalidFiles.length > 0) {
            setError('Some files are invalid. Only JPEG, PNG, and WEBP are allowed.');
            return;
        }

        setError(''); // Clear previous errors
        setFiles(selectedFiles);
    };

    const handleUpload = (e) => {
        e.preventDefault();

        if (files.length === 0 || !title || !altText) {
            setError('Please provide all required fields and select valid files.');
            return;
        }

        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file); // Append each file
        });
        formData.append('title', title);
        formData.append('altText', altText);

        // Pass FormData to the parent component's onUpload function
        onUpload(formData);

        // Reset the form
        setFiles([]);
        setTitle('');
        setAltText('');
    };

    return (
        <Box
            component="form"
            onSubmit={handleUpload}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}
        >
            <TextField
                type="file"
                inputProps={{ multiple: true }} // Allow multiple file selection
                onChange={handleFileChange}
                required
            />
            {error && (
                <Box sx={{ color: 'red', fontSize: '0.875rem' }}>{error}</Box>
            )}
            <TextField
                label="Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <TextField
                label="Alt Text"
                variant="outlined"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                required
            />
            <Button type="submit" variant="contained" color="primary">
                Upload
            </Button>
        </Box>
    );
};

export default ImageUploadForm;
