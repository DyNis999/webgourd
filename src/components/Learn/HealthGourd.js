import React, { useEffect } from 'react'
import './HealthGourd.css'
import LearnMenu from './LearnMenu'

const HealthGourd = () => {
    const backgroundImage = '/images/pngtree-a-green-colour-bottle-gourd-tip-on-the-sunny-day-in-image_15673491.jpg';

    return (
        <LearnMenu>
            <div className="learn-home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <h1>Benefits & Nutritional Value</h1>
            </div>
        </LearnMenu>
    )
}

export default HealthGourd