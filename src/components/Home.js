import React from 'react';
import Socialmedia from './Post/Socialmedia'; // Adjust the import path as necessary

const Home = () => {
    return (
        <div>
            <div className="container mt-4">
                <h1>Welcome to Gourdtify</h1>
                <p>Navbar with Login button is now implemented!</p>
            </div>
            <Socialmedia />
        </div>
    );
};

export default Home;