import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'
import { API_BASE_URL } from '../../config/api'

//CRUD Operations Page
const ListProduct = () => {

  const [allproducts,setAllProducts] =useState([]);

  const fetchInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/allproducts`);
      const data = await response.json();
      setAllProducts(data);
      console.log('Fetched data:', data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  useEffect(() => {
    fetchInfo();
  }, [])

  const remove_product = async (id)=> {
    await fetch(`${API_BASE_URL}/removeproduct`,
      {
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json',
        },
        body: JSON.stringify({id:id})
      }
    )
    await fetchInfo();
  }

  if (!allproducts || allproducts.length === 0) {
    return <div>
       Loading Products . . . <br />
       No products to display. <br />
       Check Your internet Connection and Retry </div>
  }

  return (
    <div className='listproduct'>
        <h1>All Products List</h1>
        <div className="listproduct-format-main">
          <p>Products</p>
          <p>Title</p>
          <p>Price</p>
          <p>Stock</p>
          <p>Status</p>
          <p>Category</p>
          <p>Remove</p>
        </div>
        <div className="listproduct-allproducts">
          <hr />
          {allproducts.map((product)=>{
              const stockStatus = product.quantity > 50 ? 'In Stock' : product.quantity > 0 ? 'Low Stock' : 'Out of Stock';
              const stockColor = product.quantity > 50 ? '#0ed31e' : product.quantity > 0 ? '#ffc107' : '#d32f2f';
              
              return <> <div key={product.id} className="listproduct-format-main listproduct-format">
                <img src={product.image} alt="" className='listproduct-product-icon'/>
                <p data-label="Title">{product.name}</p>
                <p data-label="Price">Ksh.{product.price}</p>
                <p data-label="Stock">{product.quantity || 0}</p>
                <p data-label="Status" style={{color: stockColor, fontWeight: '600'}}>{stockStatus}</p>
                <p data-label="Category">{product.category}</p>
                <img onClick={() => {remove_product(product.id)}} src={cross_icon} alt="" className='listproduct-remove-item' />
              </div>
              <hr />
              </>
            })}
        </div>
    </div>
  )
}

export default ListProduct
