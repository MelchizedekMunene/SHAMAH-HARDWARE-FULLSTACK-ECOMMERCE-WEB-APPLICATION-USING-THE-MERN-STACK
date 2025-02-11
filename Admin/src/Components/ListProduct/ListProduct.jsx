import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'
import AddProduct from './AddProduct'

//CRUD Operations Page
const ListProduct = () => {

  const [allproducts,setAllProducts] =useState([]);

  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:4001/allproducts');
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
    await fetch('http://localhost:4001/removeproduct',
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
    return <div>No products to display. <br />
       Loading Products . . .  </div>
  }

  return (
    <div>
      <AddProduct onProduct={fetchInfo} />
      <div className='listproduct'>
        <h1>All Products List</h1>
        <div className="listproduct-format-main">
          <p>Products</p>
          <p>Title</p>
          <p>Price</p>
          <p>Category</p>
          <p>Description</p>
          <p>Remove</p>
        </div>
        <div className="listproduct-allproducts">
          <hr />
          {allproducts.map((product)=>{
              return <> <div key={product.id} className="listproduct-format-main listproduct-format">
                <img src={product.image} alt="" className='listproduct-product-icon'/>
                <p data-label="Title">{product.name}</p>
                <p data-label="Price">Ksh.{product.price}</p>
                <p data-label="Category">{product.category}</p>
                <p data-label="Description">{product.description}</p>
                <img onClick={() => {remove_product(product.id)}} src={cross_icon} alt="" className='listproduct-remove-item' />
              </div>
              <hr />
              </>
            })}
        </div>
      </div>
    </div>
  )
}

export default ListProduct
