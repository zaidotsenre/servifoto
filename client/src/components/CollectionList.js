import React from 'react';
import { Link } from 'react-router-dom';

const CollectionList = ({ collections, onDelete }) => {
    return (
        <ul>
            {collections.map((collection) => (
                <li key={collection.id}>
                    <Link to={`/collections/${collection.id}`}>{collection.name}</Link>
                    <button onClick={() => onDelete(collection.id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
};

export default CollectionList;
