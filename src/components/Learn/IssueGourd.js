import React, { useEffect } from 'react'
import './IssueGourd.css'
import LearnMenu from './LearnMenu'

const IssueGourd = () => {
    const backgroundImage = '/images/pngtree-a-green-colour-bottle-gourd-tip-on-the-sunny-day-in-image_15673491.jpg';
    const aphidsImage = '/content/aphids.jpeg';
    const squashBugImage = '/content/squashbugs.jpg';
    const cucumberBeetleImage = '/content/beetle.png';
    const fruitFlyImage = '/content/fruitfly.jpg';

    const powderyMildewImage = '/content/powmildew.jpg';
    const downyMildewImage = '/content/dowmildew.jpg';
    const bacterialWiltImage = '/content/bacteriawilt.jpg';

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.define-body-text, .pest-text, .pest-image, .pest-subtitle ,.disease-text, .disease-image, .disease-subtitle, .prevention-body-text, .prevention-subtitle, .prevention-item');
        elements.forEach(element => observer.observe(element));

        return () => {
            elements.forEach(element => observer.unobserve(element));
        };
    }, []);

    return (
        <LearnMenu>
            <div className="common-home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <h1>Common Issues and Pests</h1>
            </div>
            <div className='define-content-container'>
                <div className='define-body-text'>
                    Growing gourds can come with a variety of challenges, particularly from pests and diseases that can affect plant health and fruit yield.
                    Understanding these common issues and how to manage them is essential for successful gourd cultivation.
                </div>
            </div>
            <div className='pest-content-container'>
                <h2 className='pest-subtitle'>Common Pests</h2>
                <div className='pest-item'>
                    <div className='pest-text'>
                        <ul className='pest-body-text'>
                            <li><strong>Aphids:</strong>
                                <ul>
                                    <li>Description: Small, soft-bodied insects that cluster on new growth and under leaves.</li>
                                    <li>Impact: They feed on plant sap, weakening the plant and potentially spreading viral diseases.</li>
                                    <li>Management: Introduce natural predators like ladybugs or use insecticidal soap to control infestations.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div className='pest-image'>
                        <img src={aphidsImage} alt="Aphids" />
                        <p className="image-source">
                            Source: <a href="https://www.areflh.org/en/euprojects-ok/smartprotect-mitochondrial-dna-and-the-future-of-insect-ecology" target="_blank" rel="noopener noreferrer">AREFLH</a>
                        </p>
                    </div>
                </div>
                {/* <div className='pest-item'>
                    <div className='pest-text'>
                        <ul className='pest-body-text'>
                            <li><strong>Squash Bugs:</strong>
                                <ul>
                                    <li>Description: Dark brown or gray bugs that suck sap from the plant.</li>
                                    <li>Impact: Can cause wilting, yellowing leaves, and reduced fruit development.</li>
                                    <li>Management: Hand-picking and using row covers during early growth can help prevent squash bug infestations.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div className='pest-image'>
                        <img src={squashBugImage} alt="Squash Bugs" />
                        <p className="image-source">
                            Source: <a href="https://vegcropshotline.org/article/squash-bugs/" target="_blank" rel="noopener noreferrer">Purdue University</a>
                        </p>
                    </div>
                </div> */}
                <div className='pest-item'>
                    <div className='pest-text'>
                        <ul className='pest-body-text'>
                            <li><strong>Cucumber Beetles:</strong>
                                <ul>
                                    <li>Description: Yellow or green beetles with black stripes or spots.</li>
                                    <li>Impact: They damage leaves and flowers and can spread bacterial wilt disease.</li>
                                    <li>Management: Crop rotation, introducing beneficial insects, and using traps can help control their populations.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div className='pest-image'>
                        <img src={cucumberBeetleImage} alt="Cucumber Beetles" />
                        <p className="image-source">
                            Source: <a href="https://dengarden.com/pest-control/controlling-cucumber-beetles-organically" target="_blank" rel="noopener noreferrer">Den Garden</a>
                        </p>
                    </div>
                </div>
                <div className='pest-item'>
                    <div className='pest-text'>
                        <ul className='pest-body-text'>
                            <li><strong>Fruit Flies:</strong>
                                <ul>
                                    <li>Description: Small flies that lay eggs in ripe fruit.</li>
                                    <li>Impact: Larvae cause decay and can lead to significant crop loss.</li>
                                    <li>Management: Use bait traps and remove overripe fruits to prevent infestations.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div className='pest-image'>
                        <img src={fruitFlyImage} alt="Fruit Flies" />
                        <p className="image-source">
                            Source: <a href="https://en.wikipedia.org/wiki/Drosophila_melanogaster" target="_blank" rel="noopener noreferrer">Wikipedia</a>
                        </p>
                    </div>
                </div>
            </div>
            <div className='disease-content-container'>
                <h2 className='disease-subtitle'>Common Diseases</h2>
                <div className='disease-item'>
                    <div className='disease-text'>
                        <ul className='disease-body-text'>
                            <li><strong>Powdery Mildew:</strong>
                                <ul>
                                    <li>Description: A fungal disease that appears as white, powdery spots on leaves.</li>
                                    <li>Impact: Affects photosynthesis and can lead to premature leaf drop.</li>
                                    <li>Management: Improve air circulation, avoid overhead watering, and apply fungicides if necessary.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div className='disease-image'>
                        <img src={powderyMildewImage} alt="Powdery Mildew" />
                        <p className="image-source">
                            Source: <a href="https://www.flickr.com/photos/scotnelson/24997141044" target="_blank" rel="noopener noreferrer">Flickr</a>
                        </p>
                    </div>
                </div>
                <div className='disease-item'>
                    <div className='disease-text'>
                        <ul className='disease-body-text'>
                            <li><strong>Downy Mildew:</strong>
                                <ul>
                                    <li>Description: A fungal disease characterized by yellow patches on the upper leaf surface and gray mold underneath.</li>
                                    <li>Impact: Reduces photosynthesis and weakens the plant.</li>
                                    <li>Management: Rotate crops, choose resistant varieties, and apply fungicides as a preventive measure.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div className='disease-image'>
                        <img src={downyMildewImage} alt="Downy Mildew" />
                        <p className="image-source">
                            Source: <a href="https://wiki.bugwood.org/Pseudoperonospora_cubensis_%28downy_mildew_of_cucurbits%29" target="_blank" rel="noopener noreferrer">Bugwood Wiki</a>
                        </p>
                    </div>
                </div>
                <div className='disease-item'>
                    <div className='disease-text'>
                        <ul className='disease-body-text'>
                            <li><strong>Bacterial Wilt:</strong>
                                <ul>
                                    <li>Description: Caused by bacteria spread by cucumber beetles.</li>
                                    <li>Impact: Causes sudden wilting of leaves and eventual plant death.</li>
                                    <li>Management: Control cucumber beetle populations and remove infected plants to prevent spread.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div className='disease-image'>
                        <img src={bacterialWiltImage} alt="Bacterial Wilt" />
                        <p className="image-source">
                            Source: <a href="https://www.vegetables.cornell.edu/pest-management/keys-for-identifying-vegetable-diseases/cucurbit-key/pumpkin-gourd-disease-key/pumpkin-gourd-wilt-crown-and-general-plant-decline/" target="_blank" rel="noopener noreferrer">Cornell CALS</a>
                        </p>
                    </div>
                </div>
            </div>
            <div className='prevention-content-container'>
                <h2 className='prevention-subtitle'>Prevention Measures</h2>
                <div className='prevention-item'>
                    <ul className='prevention-body-text'>
                        <li><strong>Crop Rotation:</strong> Changing planting locations each season can help disrupt pest life cycles and reduce disease incidence.</li>
                        <li><strong>Companion Planting:</strong> Growing pest-repelling plants alongside gourds can help deter common pests. For example, marigolds are known to repel nematodes and certain beetles.</li>
                        <li><strong>Regular Monitoring:</strong> Regularly inspect plants for early signs of pest infestations or disease symptoms. Early detection can lead to more effective control measures.</li>
                        <li><strong>Sanitation Practices:</strong> Keeping the garden free of debris and removing infected plants promptly can help prevent the spread of diseases.</li>
                    </ul>
                </div>
            </div>
        </LearnMenu>
    )
}

export default IssueGourd