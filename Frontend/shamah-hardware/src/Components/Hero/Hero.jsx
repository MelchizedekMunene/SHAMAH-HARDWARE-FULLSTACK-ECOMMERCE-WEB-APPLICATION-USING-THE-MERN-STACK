import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
import SearchBar from '../SearchBar/SearchBar';
import hero_image from '../assets/hero-image.jpg';

const Hero = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchResults = (results, query) => {
    setSearchResults(results);
    setSearchQuery(query);
    setIsSearchActive(true);
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setIsSearchActive(false);
    setSearchQuery('');
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
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
          <div className="hero-hand-icon">
            <p>Search for</p>
            {/* <img src={hand_icon} alt='' /> */}
          </div>
          <p>Products</p>
          <p>Here</p>
        </div>
        
        {/* Search Bar Integration */}
        <div className="hero-search-section">
          <SearchBar 
            onSearchResults={handleSearchResults}
            onClearSearch={handleClearSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;