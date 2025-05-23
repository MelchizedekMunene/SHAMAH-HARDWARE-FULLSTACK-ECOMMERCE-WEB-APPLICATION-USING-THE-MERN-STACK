import React from 'react';
import './SearchResults.css';

const SearchResults = ({ results, searchQuery, onProductClick }) => {
    if (!results || results.length === 0) {
        return (
            <div className="search-results">
                <div className="no-results">
                    <h3>No products found for "{searchQuery}"</h3>
                    <p>Try different keywords or browse our categories</p>
                </div>
            </div>
        );
    }

    return (
        <div className="search-results">
            <div className="search-results-header">
                <h3>Found {results.length} product{results.length !== 1 ? 's' : ''} for "{searchQuery}"</h3>
            </div>
            <div className="search-results-grid">
                {results.map((product) => (
                    <div 
                        key={product.id} 
                        className="search-result-item"
                        onClick={() => onProductClick(product.id)}
                    >
                        <div className="search-result-image">
                            <img src={product.image} alt={product.name} />
                        </div>
                        <div className="search-result-content">
                            <h4>{product.name}</h4>
                            <p className="search-result-category">{product.category}</p>
                            <p className="search-result-description">
                                {product.description.length > 100 
                                    ? product.description.substring(0, 100) + '...' 
                                    : product.description}
                            </p>
                            <div className="search-result-price">${product.price}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;