import React, { useEffect, useState } from 'react'
import './RelatedProducts.css'
import Item from '../Item/Item'
import { API_BASE_URL } from '../../config/api'

const RelatedProducts = ({ currentProductCategory }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch related products by category using dedicated endpoint
    if (currentProductCategory) {
      fetch(`${API_BASE_URL}/relatedproducts/${currentProductCategory}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch related products');
          }
          return response.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setRelatedProducts(data);
          } else {
            setRelatedProducts([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching related products:', error);
          setError(error.message);
          setRelatedProducts([]);
        });
    }
  }, [currentProductCategory]);

  if (error) {
    return <div>Error loading related products: {error}</div>;
  }

  return (
    <div className='relatedproducts'>
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {relatedProducts.length > 0 ? (
          relatedProducts.map((item) => (
            <Item 
              key={item.id} 
              id={item.id} 
              name={item.name} 
              image={item.image} 
              price={item.price} 
              quantity={item.quantity} 
            />
          ))
        ) : (
          <p>No related products available</p>
        )}
      </div>
    </div>
  )
}

export default RelatedProducts
