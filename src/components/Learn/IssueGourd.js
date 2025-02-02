import React, { useEffect } from 'react'
import './IssueGourd.css'
import LearnMenu from './LearnMenu'

const IssueGourd = () => {
    const backgroundImage = '/images/pngtree-a-green-colour-bottle-gourd-tip-on-the-sunny-day-in-image_15673491.jpg';

    return (
        <LearnMenu>
            <div className="learn-home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <h1>Common Issues and Pests</h1>
            </div>
        </LearnMenu>
    )
}

export default IssueGourd