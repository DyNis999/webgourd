import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css'; // Import the CSS file

const Landing = () => {
    return (
        <div className="landing-container">
            <div className="content">
                <h1 className="main-title">Welcome to Gourdify</h1>
                <p className="sub-title">Cultivate your gourd garden and connect with nature.</p>
                <Link to="/login">
                    <button className="cta-button">Get Started</button>
                </Link>
            </div>
        </div>
    );
};

export default Landing;
