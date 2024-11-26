import React from 'react';
import ImageUpload from './components/ImageUpload';
import ImageGallery from './components/ImageGallery';
import CollectionManager from './components/CollectionManager';

const App = () => {
    return (
        <div>
            <h1>Servifoto</h1>
            <ImageUpload onUploadSuccess={() => window.location.reload()} />
            <ImageGallery />
            <CollectionManager />
        </div>
    );
};

export default App;
