import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Topcontributor.css'; // Create a CSS file for styling if needed

const Topcontributor = () => {
    const [topContributors, setTopContributors] = useState([]);

    useEffect(() => {
        const fetchTopContributors = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/v1/posts/top-contributors');
                setTopContributors(response.data);
            } catch (error) {
                console.error('Error fetching top contributors:', error);
            }
        };

        fetchTopContributors();
    }, []);

    return (
        <div className="top-contributors">
            <h2>Top Contributors</h2>
            <ul>
                {topContributors.map(contributor => (
                    <li key={contributor.user._id}>
                        <img src={contributor.user.image} alt={contributor.user.name} className="user-image" />
                        <div className="user-info">
                            <h3>{contributor.user.name}</h3>
                            <p>Posts: {contributor.postCount}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Topcontributor;