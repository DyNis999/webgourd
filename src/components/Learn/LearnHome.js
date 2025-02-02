import React from 'react';
import './LearnHome.css';
import GourdUses from './GourdUses';
import LearnMenu from './LearnMenu';

const LearnHome = () => {
    const backgroundImage = '/images/pngtree-a-green-colour-bottle-gourd-tip-on-the-sunny-day-in-image_15673491.jpg';
    const Intro = '/Content/Intro.jpg';

    return (
        <>
            <LearnMenu>
                <div className="learn-home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
                    <h1>Explore The World of Gourds</h1>
                </div>
                <div className="intro-section">
                    <div className="intro-image" style={{ backgroundImage: `url(${Intro})` }}></div>
                    <div className="intro-text">
                        <p>
                            Gourds belong to the Cucurbitaceae family, which is a large group of plants commonly known as cucurbits. This family includes various species such as pumpkins, squash, melons, and cucumbers. Gourds are vining plants that grow quickly, often spreading with the help of large leaves and tendrils. Their fruits, typically known as "gourds," can have a wide range of shapes and colors. Many gourds are known for their hard, durable rinds, which make them useful beyond culinary applications.
                        </p>
                    </div>
                </div>
                <GourdUses />
            </LearnMenu>
        </>
    );
};

export default LearnHome;