import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import Item from '../Item/Item'

const NewCollections = () => {
  const [new_collection, setNew_collection] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4001/newcollections')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched data:', data);
        setNew_collection(data);
      })
      .catch((error) => {
        console.error('Error fetching new collections:', error);
        setError(error.message);
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
          />
        ))}
      </div>
    </div>
  );
}

export default NewCollections;