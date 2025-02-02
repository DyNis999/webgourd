import React, { useEffect } from 'react';
import './GenderGourd.css'; // Ensure the CSS file is imported
import LearnMenu from './LearnMenu';

const GenderGourd = () => {
    const backgroundImage = '/images/pngtree-a-green-colour-bottle-gourd-tip-on-the-sunny-day-in-image_15673491.jpg';
    const maleFlowerImage = '/content/MaleFlower.jpg'; // Update with the correct path
    const femaleFlowerImage = '/content/FemaleFlower.jpg'; // Update with the correct path
    const handPollinationImage = '/content/hand.jpg'; // Update with the correct path
    const beePollinationImage = '/content/bee.jpg'; // Update with the correct path

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.gender-body-text, .male-card, .female-card, .importance-body-text, .process-body-text, .challenge-body-text');
        elements.forEach(element => observer.observe(element));

        return () => {
            elements.forEach(element => observer.unobserve(element));
        };
    }, []);

    return (
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
            <div className='importance-content-container'>
                <h2 className="importance-subtitle">Importance of Gender in Pollination and Fruit Production</h2>
                <p className="importance-body-text">
                    Both male and female flowers are essential for the plant's reproductive cycle and for fruit development. While male flowers supply the pollen, female flowers need this pollen to produce viable gourds. Without male flowers, pollination would not occur, and without female flowers, the plant would not produce any gourds.
                </p>
            </div>

            <div className='process-content-container'>
                <h2 className="process-subtitle">Flower Pollination and Fruit Development</h2>
                <p className="process-body-text">
                    Pollination in gourds usually depends on natural pollinators, such as bees and other insects, which transfer pollen from the male flowers to the female flowers.
                    However, some factors can affect the pollination process, including a lack of pollinators due to environmental factors or local pesticide use.
                    In these cases, hand-pollination is often used to ensure that female flowers receive the pollen they need for fruit production.
                </p>

                <div className="natural-section">
                    <div className="text-container">
                        <h3>Natural Pollinators</h3>
                        <p className="process-body-text">
                            Bees and insects are the primary pollinators for gourds. They are attracted by the flowers' bright colors and gather pollen from male flowers, carrying it to female flowers.
                        </p>
                    </div>
                    <div className="image-container">
                        <img src={beePollinationImage} alt="Natural Pollinators" />
                        <p className="image-source">
                            Source: <a href="https://www.istockphoto.com/photos/squash-bee" target="_blank" rel="noopener noreferrer">iStock</a>
                        </p>
                    </div>
                </div>
                <div className="hand-section">
                    <div className="text-container">
                        <h3>Hand-Pollination</h3>
                        <p className="process-body-text">
                            When natural pollination is insufficient, hand-pollination can be done by using a small brush or even by gently rubbing a male flower against a female flower. This method helps guarantee that female flowers are fertilized, allowing for a successful harvest.
                        </p>
                    </div>
                    <div className="image-container">
                        <img src={handPollinationImage} alt="Hand Pollination" />
                        <p className="image-source">
                            Source: <a href="https://www.greenfusephotos.com/image/I0000H3DXjmvaC4Q" target="_blank" rel="noopener noreferrer">Green Fuse Photography</a>
                        </p>
                    </div>
                </div>
            </div>
            <div className='challenge-content-container'>
                <h2 className="challenge-subtitle">Challenges in Pollination</h2>
                <p className="challenge-body-text">
                    Pollination can be challenging, particularly if there are not enough pollinators in the area.
                    Factors like habitat loss, pesticide use, and climate change have led to declining pollinator populations, which can affect gourd production.
                    Additionally, poor weather conditions such as excessive rain or extreme heat can hinder pollination, as bees and other insects may be less active in such conditions.
                </p>
            </div>

        </LearnMenu>
    );
}

export default GenderGourd;