import React, { useEffect } from 'react';
import './HistoryGourd.css'; // Importing the CSS file
import LearnMenu from './LearnMenu';

const HistoryGourd = () => {
    const backgroundImage = '/images/pngtree-a-green-colour-bottle-gourd-tip-on-the-sunny-day-in-image_15673491.jpg';
    const Lalagyan = '/Content/history1.jpg';
    const Ritual = '/Content/history2.jpg';

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.world-body-text, .ph-body-text1, .ph-body-text2, .content-image');
        elements.forEach(element => observer.observe(element));

        return () => {
            elements.forEach(element => observer.unobserve(element));
        };
    }, []);

    return (
        <LearnMenu>
            <div className="history-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <h1>History and Cultural Significance of Gourds</h1>
            </div>
            <div className="world-content-container">
                <h2 className="world-subtitle">Gourds Around the World</h2>
                <p className="world-body-text">
                    Gourds are among the oldest cultivated plants in human history, with evidence of domestication stretching back over 10,000 years. Civilizations across Africa, Asia, and the Americas grew gourds not just as a food source but for their versatility.
                </p>
                <div className="content-section">
                    <p className="world-body-text">
                        Once dried, the hard shells of gourds made them ideal natural containers, commonly used for storing water, grains, and seeds. The durability of dried gourds also led to their adaptation into tools and even musical instruments.
                    </p>
                    <img src={Lalagyan} alt="Lalagyan" className="content-image" />
                </div>
                <div className="content-section">
                    <p className="world-body-text">
                        The unique shapes and smooth surface of gourds have also made them a popular medium for artistic and cultural expression worldwide. Many cultures would carve, paint, or decorate gourds, often for ritualistic or ceremonial purposes.
                        In some traditions, they are still used as offerings or as part of cultural ceremonies.
                        Gourds have also had a significant role in traditional music, especially as percussion instruments.
                    </p>
                    <img src={Ritual} alt="Ritual" className="content-image" />
                </div>
            </div>
            <div className="ph-content-container">
                <h2 className="ph-subtitle">Gourds in the Philippines</h2>
                <p className="ph-body-text1">
                    In the Philippines, gourds have long held a place of importance, especially in traditional cuisine and folk medicine. Bitter gourd, or ampalaya, is a prominent ingredient in Filipino dishes like Pinakbet, a mixed vegetable stew with a unique flavor profile, and Ginisang Ampalaya, a sautéed dish combining bitter gourd with eggs, garlic, and onions. Bottle gourd, or upo, is also popular in soups and stews, often cooked with garlic, tomatoes, and fish to create flavorful and nutritious meals. In addition to its culinary uses, bitter gourd is deeply embedded in Filipino medicinal practices. Known for its potential to help manage blood sugar levels, ampalaya has been a traditional remedy for diabetes and is still used in herbal medicine across the country.
                </p>
                <p className="ph-body-text2">
                    The cultural significance of gourds in the Philippines extends beyond cuisine and health. While gourds are less commonly depicted in Philippine folklore, they symbolize abundance and resilience due to their ability to grow in challenging conditions. In contemporary Filipino culture, ampalaya is widely available as a dietary supplement and herbal tea, reflecting an ongoing appreciation for its health benefits. Gourds continue to bridge the past with the present, maintaining a strong presence in Filipino culture as both a practical resource and a symbol of natural health.
                </p>
            </div>
        </LearnMenu>
    );
}

export default HistoryGourd;