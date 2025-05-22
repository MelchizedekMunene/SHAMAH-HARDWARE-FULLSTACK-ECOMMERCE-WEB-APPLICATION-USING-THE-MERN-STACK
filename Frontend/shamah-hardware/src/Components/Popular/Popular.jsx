import React, { useEffect, useState } from 'react'
import './Popular.css'
import Item from '../Item/Item'

const Popular = () => {

  const [featured_Products,setFeatured_Products] = useState([]);

  useEffect(()=>{
    fetch('http://localhost:4001/featuredproducts')
    .then((response)=>response.json())
    .then((data)=>setFeatured_Products(data));
  },[])


  return (
    <div className='popular'>
      <h1>OUR FEATURED PRODUCTS</h1>
      <hr />
      <div className="popular-item">
        {featured_Products.map((item, i) =>{
          return <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price} />
        })}
      </div>
    </div>
  )
}

export default Popular;
