import React, { useEffect, useState } from 'react'
import './Popular.css'
import Item from '../Item/Item'
import { API_BASE_URL } from '../../config/api'

const Popular = () => {

  const [featured_Products,setFeatured_Products] = useState([]);

  useEffect(()=>{
    fetch(`${API_BASE_URL}/featuredproducts`)
    .then((response)=>response.json())
    .then((data)=>{
      // Check if data is an array before setting state
      if(Array.isArray(data)){
        setFeatured_Products(data);
      } else if(data.results && Array.isArray(data.results)){
        setFeatured_Products(data.results);
      } else {
        console.error("Invalid response format:", data);
        setFeatured_Products([]);
      }
    })
    .catch((error)=>{
      console.error("Error fetching featured products:", error);
      setFeatured_Products([]);
    });
  },[])


  return (
    <div className='popular'>
      <h1>OUR FEATURED PRODUCTS</h1>
      <hr />
      <div className="popular-item">
        {featured_Products.map((item, i) =>{
          return <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price} quantity={item.quantity} />
        })}
      </div>
    </div>
  )
}

export default Popular;
