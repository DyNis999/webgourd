import React, { useEffect } from 'react';
import './CommonType.css'; // Ensure the CSS file is imported
import LearnMenu from './LearnMenu';


const CommonType = () => {
    const backgroundImage = '/images/pngtree-a-green-colour-bottle-gourd-tip-on-the-sunny-day-in-image_15673491.jpg';

    useEffect(() => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                    }
                });
            }, { threshold: 0.1 });
    
            const elements = document.querySelectorAll('.type-body-text, .definition-body-text');
            elements.forEach(element => observer.observe(element));
    
            return () => {
                elements.forEach(element => observer.unobserve(element));
            };
        }, []);

    return (
        <LearnMenu  >
            <div className="type-home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <h1>3 Common Gourds</h1>
            </div>
            <div className='definition-content-container'>
                <p className='definition-body-text'>
                    The Philippines is home to several gourd varieties, each with unique characteristics, culinary uses, and cultural importance.
                    Here are the most common types of gourds grown and used in Filipino cuisine and traditional practices:
                </p>
            </div>
            <div className='example-content-container'>
                
            </div>

        </LearnMenu>
    )
}

export default CommonType