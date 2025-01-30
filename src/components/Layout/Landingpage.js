import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css'; // Import the CSS file

const Landing = ({ isAuthenticated }) => {
    return (
        <>
            <div className="landing-container">
                <div className="background-collage">
                    <div className="background-image" style={{ backgroundImage: "url('/landing/landing1.jpg')" }}></div>
                    <div className="background-image" style={{ backgroundImage: "url('/landing/landing2.jpg')" }}></div>
                    <div className="background-image" style={{ backgroundImage: "url('/landing/landing3.jpg')" }}></div>
                </div>
                <div className="content">
                    <h1 className="main-title">Gourdtify</h1>
                    <p className="sub-title">Be knowledgeable in the world of gourds.</p>
                    {!isAuthenticated && (
                        <div className="cta-button-container">
                            <Link to="/login">
                                <button className="cta-button">Get Started</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div className="about-us-container">
                <h2>About Us</h2>
                <p>Gourdify is dedicated to providing comprehensive information and resources about gourds. Join us to explore the fascinating world of gourds and enhance your knowledge.</p>
            </div>
        </>
    );
};

export default Landing;