import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CollectionView from './pages/CollectionView';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/collections/:id" element={<CollectionView />} />
            </Routes>
        </Router>
    );
};

export default App;
