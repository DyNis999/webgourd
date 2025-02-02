import React, { useEffect } from 'react';
import './Botany.css'; // Ensure the CSS file is imported
import LearnMenu from './LearnMenu';

const Botany = () => {
    const backgroundImage = '/images/pngtree-a-green-colour-bottle-gourd-tip-on-the-sunny-day-in-image_15673491.jpg';
    const anatomyImage = '/content/anatomy.jpg'; // Update with the correct path
    const lifeImage = '/content/lifecycle.jpg'; // Update with the correct path

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.anatomy-body-text, .life-body-text');
        elements.forEach(element => observer.observe(element));

        return () => {
            elements.forEach(element => observer.unobserve(element));
        };
    }, []);

    return (
        <LearnMenu>
            <div className="botany-home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <h1>Botany of Gourd</h1>
            </div>
            <div className="anatomy-content-container">
                <h2 className="anatomy-subtitle">Anatomy of Gourd</h2>
                <div className="anatomy-body-text">
                    <ul>
                        <li><strong>Roots:</strong> Absorb water and nutrients, anchoring the plant.</li>
                        <li><strong>Stems & Tendrils:</strong> Long, flexible vines that climb and spread.</li>
                        <li><strong>Leaves:</strong> Large, lobed leaves that maximize sunlight absorption.</li>
                        <li><strong>Flowers:</strong> Male and female flowers, essential for reproduction.</li>
                        <li><strong>Fruits:</strong> Develop from fertilized female flowers, varying in shape and size.</li>
                    </ul>
                    <div className="image-container">
                        <img src={anatomyImage} alt="Anatomy of Gourd" className="anatomy-image" />
                        <p className="image-source">Source: <a href="https://designbundles.net/plant-world/1249214-parts-of-momordica-charantia-bitter-melon-plant-on" target="_blank" rel="noopener noreferrer">Plant World</a></p>
                    </div>
                </div>
            </div>
            <div className="life-content-container">
                <h2 className="life-subtitle">Life Cycle of a Gourd</h2>
                <div className="life-body-text">
                    <ul>
                        <li><strong>Germination:</strong> Seeds sprout in warm, moist conditions.</li>
                        <li><strong>Vegetative Growth:</strong> The plant develops vines, leaves, and tendrils.</li>
                        <li><strong>Flowering:</strong> Male flowers appear first, followed by female flowers.</li>
                        <li><strong>Pollination & Fruiting:</strong> Pollen transfer allows fruit development.</li>
                    </ul>
                    <div className="image-container">
                        <img src={lifeImage} alt="Life Cycle of Gourd" className="life-image" />
                        <p className="image-source">Source: <a href="https://www.dreamstime.com/growth-cycle-momordica-charantia-bitter-melon-plant-white-background-growth-cycle-momordica-charantia-bitter-melon-image179870976" target="_blank" rel="noopener noreferrer">Plant World</a></p>
                    </div>
                </div>
            </div>
        </LearnMenu>
    );
}

export default Botany;