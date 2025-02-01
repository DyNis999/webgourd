import React, { useEffect, useRef, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './GourdUses.css';
import LearnMenu from './LearnMenu';

const GourdUses = () => {
    const luto = '/Content/luto.jpg';
    const gamot = '/Content/gamot.jpg';
    const decoration = '/Content/decoration.jpg';

    const [isContainerVisible, setIsContainerVisible] = useState(false);
    const [isCarouselVisible, setIsCarouselVisible] = useState(false);
    const gourdUsesContainerRef = useRef(null);
    const carouselRef = useRef(null);

    useEffect(() => {
        const containerObserver = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsContainerVisible(true);
                    containerObserver.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        const carouselObserver = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsCarouselVisible(true);
                    carouselObserver.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (gourdUsesContainerRef.current) {
            containerObserver.observe(gourdUsesContainerRef.current);
        }

        if (carouselRef.current) {
            carouselObserver.observe(carouselRef.current);
        }

        return () => {
            if (containerObserver && containerObserver.disconnect) {
                containerObserver.disconnect();
            }
            if (carouselObserver && carouselObserver.disconnect) {
                carouselObserver.disconnect();
            }
        };
    }, []);

    return (
        <LearnMenu>
            <div className="gourd-uses">
                <div
                    className={`gourd-uses-container ${isContainerVisible ? 'animate-left' : ''}`}
                    ref={gourdUsesContainerRef}
                >
                    <h2>Uses of Gourds</h2>
                    <p>
                        Gourds have been valued across cultures for both their nutritional and practical qualities. Not only are they edible and nutritious, but once dried, many gourds develop a hard outer shell, making them suitable for a variety of non-food uses. Here’s a look at the most common uses of gourds:
                    </p>
                </div>
                <div className={`carousel-container ${isCarouselVisible ? 'animate-bottom' : ''}`} ref={carouselRef}>
                    <Carousel showThumbs={false} showStatus={false} infiniteLoop={true} autoPlay={true} interval={5000}>
                        <div className="gourd-use-item">
                            <div className="text">
                                <strong>Culinary Uses:</strong>
                                <p>Gourds are widely used in cuisines around the world. Bitter gourd, for instance, is a popular ingredient in Asian dishes due to its unique bitter flavor and health benefits, while sponge gourd is often enjoyed in soups and stir-fries.</p>
                            </div>
                            <div className="image">
                                <img src={luto} alt="Culinary Uses" />
                                <p className="image-source">
                                    Source: <a href="https://mygoodfoodworld.com/bottle-gourd-recipe-lauki-ki-sabji-calabash/" target="_blank" rel="noopener noreferrer">MyGoodFoodWorld</a>
                                </p>
                            </div>
                        </div>
                        <div className="gourd-use-item">
                            <div className="text">
                                <strong>Medicinal Uses:</strong>
                                <p>Many types of gourds are believed to have health benefits. For example, bitter gourd is known for its ability to help regulate blood sugar levels and is high in vitamins A and C, iron, and potassium.</p>
                            </div>
                            <div className="image">
                                <img src={gamot} alt="Medicinal Uses" />
                                <p className="image-source">
                                    Source: <a href="https://ayurveda.alandiashram.org/ayurvedic-diet/bitter-gourd-as-food-and-medicine" target="_blank" rel="noopener noreferrer">Alandi Ayurveda</a>
                                </p>
                            </div>
                        </div>
                        <div className="gourd-use-item">
                            <div className="text">
                                <strong>Decorative and Practical Applications:</strong>
                                <p>In addition to being a source of food, dried gourds have been used for centuries as natural containers for water and seeds, as well as for crafting musical instruments and decorative items.</p>
                            </div>
                            <div className="image">
                                <img src={decoration} alt="Decorative Uses" />
                                <p className="image-source">
                                    Source: <a href="https://southviewdesign.com/blog/decorating-with-gourds" target="_blank" rel="noopener noreferrer">Southview Design</a>
                                </p>
                            </div>
                        </div>
                    </Carousel>
                </div>
            </div>
        </LearnMenu>
    );
};

export default GourdUses;