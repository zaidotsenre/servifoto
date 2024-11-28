import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Update for production

const api = axios.create({
    baseURL: API_BASE_URL,
});

// API Functions
export const uploadImage = (collectionId, formData) => {
    return api.post(`/collections/${collectionId}/images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};




export const fetchImages = () => api.get('/images');

export const createCollection = (collectionData) => api.post('/collections', collectionData);

export const fetchCollections = () => api.get('/collections');

// Fetch a specific collection by ID
export const fetchCollection = (id) => {
    return api.get(`/collections/${id}`);
};

export const addImageToCollection = (collectionId, imageId) =>
    api.post(`/collections/${collectionId}/images/${imageId}`);

export const reorderImagesInCollection = (collectionId, orderData) =>
    api.post(`/collections/${collectionId}/reorder`, { orderData });

export const removeImageFromCollection = (collectionId, imageId) =>
    api.delete(`/collections/${collectionId}/images/${imageId}`);

export const deleteImage = (imageId) => api.delete(`/images/${imageId}`);

export const deleteCollection = (collectionId) => api.delete(`/collections/${collectionId}`);

// Fetch images for a specific collection
export const fetchCollectionImages = (collectionId) => {
    return api.get(`/collections/${collectionId}/images`, {
        params: {
            paginate: false,
        },
    });
};



export default api;
