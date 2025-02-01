import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LearnMenu = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      // Scrolling down
      setIsVisible(false);
    } else {
      // Scrolling up
      setIsVisible(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const linkStyle = (path) => ({
    color: '#fff',
    textDecoration: 'none',
    backgroundColor: location.pathname === path ? 'rgba(0, 100, 0, 0.52)' : 'transparent', // Dark green soft container
    padding: location.pathname === path ? '5px 10px' : '0', // Add padding when active
    borderRadius: '5px', // Rounded corners for the background
  });

  return (
    <div style={{ position: 'relative' }}>
      <nav style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.36)', // Transparent gray background
        padding: '10px', 
        position: 'fixed', 
        top: isVisible ? '70px' : '-100px', // Hide the menu when scrolling down
        left: '50%', 
        transform: 'translateX(-50%)', 
        width: '80%', 
        borderRadius: '10px', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
        transition: 'top 0.3s ease', // Smooth transition
        zIndex: 1000 
      }}>
        <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, paddingLeft: '20px' }}>
          <li style={{ marginRight: '20px', color: '#fff' }}>
            <Link to="/learn" style={linkStyle('/learn')}>Intro</Link>
          </li>
          <li style={{ marginRight: '20px', color: '#fff' }}>|</li>
          <li style={{ marginRight: '20px', color: '#fff' }}>
            <Link to="/historygourd" style={linkStyle('/historygourd')}>History</Link>
          </li>
          <li style={{ marginRight: '20px', color: '#fff' }}>|</li>
          <li style={{ color: '#fff' }}>
            <Link to="/learn/screen-two" style={linkStyle('/learn/screen-two')}>Screen Two</Link>
          </li>
        </ul>
      </nav>
      <div>
        {children}
      </div>
    </div>
  );
};

export default LearnMenu;