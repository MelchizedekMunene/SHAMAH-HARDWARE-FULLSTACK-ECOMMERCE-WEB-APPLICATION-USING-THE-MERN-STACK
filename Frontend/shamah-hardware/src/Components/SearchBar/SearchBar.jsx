import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearchResults, onClearSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Debounce search to avoid too many API calls
    useEffect(() => {
        if (searchQuery.trim().length > 2) {
            const timeoutId = setTimeout(() => {
                performSearch(searchQuery);
            }, 500);
            return () => clearTimeout(timeoutId);
        } else if (searchQuery.trim().length === 0) {
            onClearSearch();
        }
    }, [searchQuery, onClearSearch]);

    const performSearch = async (query) => {
        setIsLoading(true);
        try {
            console.log('Searching for:', query); // Debug log
            const response = await fetch(`http://localhost:4001/search?query=${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Search response:', data); // Debug log
            
            if (data.success) {
                onSearchResults(data.results, query);
                setShowSuggestions(data.results.length > 0);
            } else {
                console.error('Search failed:', data.message);
                onSearchResults([], query);
            }
        } catch (error) {
            console.error('Search error:', error);
            onSearchResults([], query);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setShowSuggestions(false);
        onClearSearch();
    };

    return (
        <div className="search-bar-container">
            <div className="search-input-wrapper">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search for tools, equipment, categories..."
                    value={searchQuery}
                    onChange={handleInputChange}
                />
                {isLoading && <div className="search-loading">🔍</div>}
                {searchQuery && (
                    <button className="clear-search-btn" onClick={clearSearch}>
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;