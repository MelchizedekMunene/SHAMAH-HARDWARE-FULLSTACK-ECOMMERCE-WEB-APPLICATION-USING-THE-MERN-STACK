import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
import hero_image from '../assets/hero-image.jpg';

const Hero = () => {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <div className='hero' style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${hero_image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="hero-left">
        <div className="hero-text">
          <p>Search for</p>
          <p>Products</p>
          <p>Here</p>
        </div>
        
        {/* Search Button Section */}
        <div className="hero-search-section">
          <button 
            className="hero-search-button"
            onClick={handleSearchClick}
          >
            🔍 Search Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;