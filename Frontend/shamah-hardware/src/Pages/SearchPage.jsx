import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../Components/SearchBar/SearchBar';
import SearchResults from '../Components/SearchResults/SearchResults';
import './CSS/SearchPage.css';

const SearchPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Get search query from URL params if coming from a direct link
        const params = new URLSearchParams(location.search);
        const query = params.get('q');
        if (query) {
            setSearchQuery(query);
            performSearch(query);
        }
    }, [location]);

    const performSearch = async (query) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:4001/search?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success) {
                setSearchResults(data.results);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchResults = (results, query) => {
        setSearchResults(results);
        setSearchQuery(query);
    };

    const handleClearSearch = () => {
        setSearchResults([]);
        setSearchQuery('');
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleCategoryClick = (category) => {
        navigate(`/${category.toUpperCase()}`);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        performSearch(suggestion);
    };

    const popularSearches = ['hammer', 'drill', 'pipe', 'wire', 'cement', 'pliers'];
    const categories = [
        { name: 'Construction', path: 'CONSTRUCTION' },
        { name: 'Electricals', path: 'ELECTRICALS' },
        { name: 'Plumbing', path: 'PLUMBING' },
        { name: 'Farm Tools', path: 'FARM TOOLS' }
    ];

    return (
        <div className="search-page">
            <div className="search-bar-section">
                <h1 className="search-page-title">Find Your Tools</h1>
                <p className="search-page-subtitle">Search from thousands of quality tools and equipment</p>
                <SearchBar 
                    onSearchResults={handleSearchResults}
                    onClearSearch={handleClearSearch}
                />
                
                {!searchQuery && (
                    <div className="search-suggestions">
                        <h4>Popular Searches:</h4>
                        <div className="suggestion-tags">
                            {popularSearches.map((suggestion, index) => (
                                <button 
                                    key={index}
                                    className="suggestion-tag"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="search-results-section">
                {isLoading && (
                    <div className="search-loading">
                        <div className="loading-spinner"></div>
                        Searching...
                    </div>
                )}
                
                {searchQuery && !isLoading && (
                    <div className="search-status">
                        {searchResults.length > 0 ? (
                            <div className="results-count">
                                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                            </div>
                        ) : (
                            <div className="no-results">
                                No products found for "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
                
                {searchQuery && (
                    <SearchResults 
                        results={searchResults}
                        searchQuery={searchQuery}
                        onProductClick={handleProductClick}
                    />
                )}
                
                {!searchQuery && (
                    <div className="search-categories">
                        <h2 className="categories-title">Browse Categories</h2>
                        <div className="categories-grid">
                            {categories.map((category, index) => (
                                <div 
                                    key={index}
                                    className="category-card"
                                    onClick={() => handleCategoryClick(category.path)}
                                >
                                    <h5>{category.name}</h5>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;