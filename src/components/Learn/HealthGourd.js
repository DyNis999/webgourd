import React, { useEffect } from 'react'
import './HealthGourd.css'
import LearnMenu from './LearnMenu'

const HealthGourd = () => {
    const backgroundImage = '/images/pngtree-a-green-colour-bottle-gourd-tip-on-the-sunny-day-in-image_15673491.jpg';
    const bitterGourdImage = '/Content/ampalaya111.jpg'; // Update with the correct path
    const spongeGourdImage = '/Content/patola111.jpg'; // Update with the correct path
    const bottleGourdImage = '/Content/upo111.jpg'; // Update with the correct path

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.health-body-text, .nutrition-body-text, .nutrition-subtitle, .nutrition-text, .nutrition-image, .medicine-body-text, .medicine-subtitle, .medicine-bullet-item');
        elements.forEach(element => observer.observe(element));

        return () => {
            elements.forEach(element => observer.unobserve(element));
        };
    }, []);

    return (
        <LearnMenu>
            <div className="health-home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <h1>Benefits & Nutritional Value</h1>
            </div>
            <div className="health-content-container">
                <p className="health-body-text">
                    Gourds are not only versatile in the kitchen but also packed with essential nutrients and health benefits.
                    Understanding their nutritional profiles and medicinal uses can encourage healthier dietary choices.
                </p>
            </div>
            <div className='nutrition-content-container'>
                <h2 className='nutrition-subtitle'>Nutritional Profile of Each Gourd</h2>
                <div className='nutrition-item'>
                    <div className='nutrition-text'>
                        <ul className='nutrition-body-text'>
                            <li><strong>Bitter Gourd (Ampalaya):</strong>
                                <ul>
                                    <li>Vitamins: Rich in Vitamin C, which boosts the immune system and promotes healthy skin.</li>
                                    <li>Minerals: Contains potassium, which helps regulate blood pressure, and iron, essential for blood health.</li>
                                    <li>Antioxidants: High levels of flavonoids and phenolic compounds that may help reduce oxidative stress.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div className='nutrition-image'>
                        <img src={bitterGourdImage} alt="Bitter Gourd (Ampalaya)" />
                        <p className="image-source">
                            Source: <a href="https://www.scmp.com/lifestyle/food-drink/article/3039121/chinese-bitter-melon-why-polarising-gentlemans-vegetable-just" target="_blank" rel="noopener noreferrer">SCMP</a>
                        </p>
                    </div>
                </div>
                <div className='nutrition-item'>
                    <div className='nutrition-text'>
                        <ul className='nutrition-body-text'>
                            <li><strong>Sponge Gourd (Patola):</strong>
                                <ul>
                                    <li>Vitamins: A good source of Vitamins A and C, promoting vision health and immune function.</li>
                                    <li>Minerals: Contains calcium and magnesium, vital for bone health.</li>
                                    <li>Antioxidants: Offers dietary fiber, which aids in digestion and can help maintain healthy cholesterol levels.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div className='nutrition-image'>
                        <img src={spongeGourdImage} alt="Sponge Gourd (Patola)" />
                        <p className="image-source">
                            Source: <a href="https://receipesnmore.blogspot.com/2013/11/sponge-gourd-turai-ghosavli-sweet-and.html" target="_blank" rel="noopener noreferrer">Recipes n More</a>
                        </p>
                    </div>
                </div>
                <div className='nutrition-item'>
                    <div className='nutrition-text'>
                        <ul className='nutrition-body-text'>
                            <li><strong>Bottle Gourd (Upo):</strong>
                                <ul>
                                    <li>Vitamins: High in Vitamin B, particularly B1 (thiamine) and B2 (riboflavin), which support energy metabolism.</li>
                                    <li>Minerals: Rich in potassium, which helps maintain fluid balance and supports heart health.</li>
                                    <li>Antioxidants: Contains a significant amount of water, making it hydrating and low in calories, which is beneficial for weight management.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div className='nutrition-image'>
                        <img src={bottleGourdImage} alt="Bottle Gourd (Upo)" />
                        <p className="image-source">
                            Source: <a href="https://www.yummy.ph/lessons/prepping/upo-vs-patola-difference-a00249-20220124" target="_blank" rel="noopener noreferrer">Yummy PH</a>
                        </p>
                    </div>
                </div>
            </div>
            <div className='medicine-content-container'>
                <h2 className='medicine-subtitle'>Medicinal Uses of Each Gourd</h2>
                <p className='medicine-body-text'>
                    Gourds have been traditionally used in various cultures for their health benefits. Here are some notable medicinal uses:
                </p>
                <div className='medicine-bullet-item'>
                    <ul>
                        <li><strong>Blood Sugar Management:</strong> Bitter gourd is known for its potential to lower blood sugar levels, making it beneficial for individuals with diabetes. It contains compounds that mimic insulin and may improve glucose uptake.</li>
                        <li><strong>Digestive Health:</strong> The high fiber content in sponge and bottle gourd aids digestion, prevents constipation, and promotes a healthy gut. Fiber-rich foods can help maintain bowel regularity and reduce the risk of digestive disorders.</li>
                        <li><strong>Skin Health:</strong> Bitter gourd is often used in traditional medicine for its anti-inflammatory and antibacterial properties. It may help treat skin conditions like acne and psoriasis when consumed or applied topically.</li>
                        <li><strong>Hydration and Detoxification:</strong> Bottle gourd’s high water content helps keep the body hydrated, while its diuretic properties may support detoxification processes by promoting urination and flushing out toxins.</li>
                        <li><strong>Weight Management:</strong> Due to their low calorie and high fiber content, gourds like sponge and bottle gourd can aid in weight loss by providing satiety without excessive caloric intake.</li>
                    </ul>
                </div>
            </div>
        </LearnMenu>
    )
}

export default HealthGourd