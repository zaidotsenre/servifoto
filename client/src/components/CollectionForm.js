import React, { useState } from 'react';

const CollectionForm = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, description });
        setName('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}
                placeholder="Collection Name"
                onChange={(e) => setName(e.target.value)}
                required
            />
            <textarea
                value={description}
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button type="submit">Create Collection</button>
        </form>
    );
};

export default CollectionForm;
