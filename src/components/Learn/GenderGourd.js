import React, { useEffect } from 'react';
import './GenderGourd.css'; // Ensure the CSS file is imported
import LearnMenu from './LearnMenu';

const GenderGourd = () => {
    const backgroundImage = '/images/pngtree-a-green-colour-bottle-gourd-tip-on-the-sunny-day-in-image_15673491.jpg';
    const maleFlowerImage = '/content/MaleFlower.jpg'; // Update with the correct path
    const femaleFlowerImage = '/content/FemaleFlower.jpg'; // Update with the correct path

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.gender-body-text, .male-card, .female-card');
        elements.forEach(element => observer.observe(element));

        return () => {
            elements.forEach(element => observer.unobserve(element));
        };
    }, []);

    return (
        <>
            <LearnMenu>
                <div className="flower-home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
                    <h1>Understanding Flower Gender in Gourds</h1>
                </div>
                <div className="gender-content-container">
                    <h2 className="gender-subtitle">Male vs. Female Flowers</h2>
                    <p className="gender-body-text">
                        Gourd plants are unique in having distinct male and female flowers on the same plant,
                        a feature that plays a critical role in fruit production:
                    </p>
                    <div className="gender-body-text">
                        <div className="gender-section male-card">
                            <h3>Male Flowers</h3>
                            <img src={maleFlowerImage} alt="Male Flower" className="gender-image" />
                            <p>
                                These flowers are typically smaller and grow on long, slender stems. They produce pollen but do not bear fruit. Male flowers tend to bloom first and in greater numbers than female flowers, ensuring ample pollen is available for pollination.
                            </p>
                        </div>
                        <div className="gender-section female-card">
                            <h3>Female Flowers</h3>
                            <img src={femaleFlowerImage} alt="Female Flower" className="gender-image" />
                            <p>
                                Female flowers are distinguishable by the small, immature fruit (ovary) visible at the base of the bloom. This ovary will develop into a full-sized gourd if the flower is successfully pollinated. Female flowers are often slightly larger and bloom after the initial appearance of male flowers.
                            </p>
                        </div>
                    </div>
                    <p className="gender-body-text">
                        The visual differences between male and female flowers make it easy to identify each type,
                        which can be beneficial for both natural and hand-pollination efforts.
                    </p>
                </div>
            </LearnMenu>
        </>
    );
}

export default GenderGourd;