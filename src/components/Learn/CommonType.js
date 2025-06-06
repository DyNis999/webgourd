import React, { useEffect, useRef, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './CommonType.css';
import LearnMenu from './LearnMenu';

const CommonType = () => {
    const backgroundImage = '/images/pngtree-a-green-colour-bottle-gourd-tip-on-the-sunny-day-in-image_15673491.jpg';
    const bitterGourdImage = '/Content/ampalaya111.jpg'; // Update with the correct path
    const spongeGourdImage = '/Content/patola111.jpg'; // Update with the correct path
    const bottleGourdImage = '/Content/upo111.jpg'; // Update with the correct path

    const [isContainerVisible, setIsContainerVisible] = useState(false);
    const [isCarouselVisible, setIsCarouselVisible] = useState(false);
    const exampleContentContainerRef = useRef(null);
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

        if (exampleContentContainerRef.current) {
            containerObserver.observe(exampleContentContainerRef.current);
        }

        if (carouselRef.current) {
            carouselObserver.observe(carouselRef.current);
        }

        const definitionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const definitionElements = document.querySelectorAll('.definition-body-text');
        definitionElements.forEach(element => definitionObserver.observe(element));

        return () => {
            if (containerObserver && containerObserver.disconnect) {
                containerObserver.disconnect();
            }
            if (carouselObserver && carouselObserver.disconnect) {
                carouselObserver.disconnect();
            }
            definitionElements.forEach(element => definitionObserver.unobserve(element));
        };
    }, []);

    return (
        <LearnMenu>
            <div className="type-home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <h1>Common Types of Gourds</h1>
            </div>
            <div className='definition-content-container'>
                <p className='definition-body-text'>
                    The Philippines is home to several gourd varieties, each with unique characteristics, culinary uses, and cultural importance.
                    Here are the most common types of gourds grown and used in Filipino cuisine and traditional practices:
                </p>
            </div>
            <div className="carousel-wrapper">
                <div className={`carousel-container ${isCarouselVisible ? 'animate-bottom' : ''}`} ref={carouselRef}>
                    <Carousel showThumbs={false} showStatus={false} infiniteLoop={true} autoPlay={true} interval={5000}>
                        <div className="gourd-example-item">
                            <div className="text">
                                <strong>Bitter Gourd (Ampalaya)</strong>
                                <p>Scientific Name: Momordica charantia</p>
                                <p>Description: Bitter gourd, known locally as ampalaya, has a distinct wrinkled skin and is famous for its bitter taste. It is a vine plant with dark green fruits that are either short and thick or long and thin, depending on the variety.</p>
                                <p>Uses: Often used in Filipino dishes like ginisang ampalaya (sautéed bitter gourd) with eggs and sometimes paired with meats or seafood. It is also valued for its medicinal properties, as it is believed to help regulate blood sugar levels.</p>
                            </div>
                            <div className="image">
                                <img src={bitterGourdImage} alt="Bitter Gourd" />
                                <p className="image-source">
                                    Source: <a href="https://www.scmp.com/lifestyle/food-drink/article/3039121/chinese-bitter-melon-why-polarising-gentlemans-vegetable-just" target="_blank" rel="noopener noreferrer">SCMP</a>
                                </p>
                            </div>
                        </div>
                        <div className="gourd-example-item">
                            <div className="text">
                                <strong>Sponge Gourd (Patola)</strong>
                                <p>Scientific Name: Luffa aegyptiaca or Luffa cylindrica</p>
                                <p>Description: Known as patola in Filipino, sponge gourd is a long, green gourd with a smooth or slightly ridged skin. When young, it is tender and edible; when mature, it develops fibrous interiors that can be dried and used as natural sponges.</p>
                                <p>Uses: Commonly used in Filipino soups like misua with patola, where it adds a mild, slightly sweet flavor. Mature sponge gourds are dried and turned into bath or cleaning sponges, making them useful beyond the kitchen.</p>
                            </div>
                            <div className="image">
                                <img src={spongeGourdImage} alt="Sponge Gourd" />
                                <p className="image-source">
                                    Source: <a href="https://receipesnmore.blogspot.com/2013/11/sponge-gourd-turai-ghosavli-sweet-and.html" target="_blank" rel="noopener noreferrer">Recipes n More</a>
                                </p>
                            </div>
                        </div>
                        <div className="gourd-example-item">
                            <div className="text">
                                <strong>Bottle Gourd (Upo)</strong>
                                <p>Scientific Name: Lagenaria siceraria</p>
                                <p>Description: Bottle gourd, or upo, is a large, light green gourd with a smooth skin. It has a bulbous shape, resembling a bottle when mature, and has a soft texture when cooked.</p>
                                <p>Uses: Often featured in dishes like ginataang upo (bottle gourd cooked in coconut milk) or sautéed upo with shrimp. Its neutral flavor makes it versatile in various recipes, where it absorbs the flavors of other ingredients.</p>
                            </div>
                            <div className="image">
                                <img src={bottleGourdImage} alt="Bottle Gourd" />
                                <p className="image-source">
                                    Source: <a href="https://www.yummy.ph/lessons/prepping/upo-vs-patola-difference-a00249-20220124" target="_blank" rel="noopener noreferrer">Yummy PH</a>
                                </p>
                            </div>
                        </div>
                    </Carousel>
                </div>
            </div>
        </LearnMenu>
    );
};

export default CommonType;