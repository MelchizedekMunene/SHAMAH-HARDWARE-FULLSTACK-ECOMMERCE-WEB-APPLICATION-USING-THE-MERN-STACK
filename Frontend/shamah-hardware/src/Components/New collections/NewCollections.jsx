import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import Item from '../Item/Item'
import { API_BASE_URL } from '../../config/api'

const NewCollections = () => {
  const [new_collection, setNew_collection] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/newcollections`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched data:', data);
        // Check if data is an array before setting state
        if(Array.isArray(data)){
          setNew_collection(data);
        } else if(data.results && Array.isArray(data.results)){
          setNew_collection(data.results);
        } else {
          console.error("Invalid response format:", data);
          setNew_collection([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching new collections:', error);
        setError(error.message);
        setNew_collection([]);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="new-collections">
      <h1>NEW COLLECTION</h1>
      <hr />
      <div className="collection">
        {new_collection.map((item, i) => (
          <Item 
            key={item.id || i} 
            id={item.id} 
            name={item.name} 
            image={item.image} 
            price={item.price}
            quantity={item.quantity}
          />
        ))}
      </div>
    </div>
  );
}

export default NewCollections;