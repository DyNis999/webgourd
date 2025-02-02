import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LearnMenu = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navRef = useRef(null);

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

  useEffect(() => {
    if (navRef.current) {
      const navWidth = navRef.current.scrollWidth;
      navRef.current.style.width = `${navWidth}px`;
    }
  }, []);

  const linkStyle = (path) => ({
    color: '#fff',
    textDecoration: 'none',
    backgroundColor: location.pathname === path ? 'rgba(0, 100, 0, 0.52)' : 'transparent', // Dark green soft container
    padding: location.pathname === path ? '5px 10px' : '0', // Add padding when active
    borderRadius: '5px', // Rounded corners for the background
  });

  return (
    <div style={{ position: 'relative' }}>
      <nav ref={navRef} style={{
        backgroundColor: 'rgba(0, 0, 0, 0.36)', // Transparent gray background
        padding: '10px',
        position: 'fixed',
        top: isVisible ? '70px' : '-100px', // Hide the menu when scrolling down
        left: '50%',
        transform: 'translateX(-50%)',
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
            <Link to="/learn/historygourd" style={linkStyle('/learn/historygourd')}>History</Link>
          </li>
          <li style={{ marginRight: '20px', color: '#fff' }}>|</li>
          <li style={{ marginRight: '20px', color: '#fff' }}>
            <Link to="/learn/botany" style={linkStyle('/learn/botany')}>Botany</Link>
          </li>
          <li style={{ marginRight: '20px', color: '#fff' }}>|</li>
          <li style={{ marginRight: '20px', color: '#fff' }}>
            <Link to="/learn/gender" style={linkStyle('/learn/gender')}>Pollination</Link>
          </li>
          <li style={{ marginRight: '20px', color: '#fff' }}>|</li>
          <li style={{ marginRight: '20px', color: '#fff' }}>
            <Link to="/learn/common" style={linkStyle('/learn/common')}>Types</Link>
          </li>
          <li style={{ marginRight: '20px', color: '#fff' }}>|</li>
          <li style={{ marginRight: '20px', color: '#fff' }}>
            <Link to="/learn/health" style={linkStyle('/learn/health')}>Health</Link>
          </li>
          <li style={{ marginRight: '20px', color: '#fff' }}>|</li>
          <li style={{ marginRight: '20px', color: '#fff' }}>
            <Link to="/learn/issue" style={linkStyle('/learn/issue')}>Issues</Link>
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