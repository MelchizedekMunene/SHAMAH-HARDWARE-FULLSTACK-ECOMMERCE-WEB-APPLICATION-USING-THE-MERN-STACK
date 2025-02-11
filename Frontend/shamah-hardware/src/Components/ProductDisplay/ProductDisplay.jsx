import React, { useContext } from 'react'
import './ProductDisplay.css'
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = ( {product} ) => {

    const {addToCart} = useContext(ShopContext);
    
    if (!product) return null;

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <img src={product.image} alt={product.name} />
        <img src={product.image} alt={product.name} />
        <img src={product.image} alt={product.name} />
        <img src={product.image} alt={product.name} />
      </div>
      <div className="productdipslay-img">
        <img className="productdisplay-main-img"src={product.image} alt="" />
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-prices">
            Ksh.{product.price}
        </div>
        <div className="productdisplay-right-description">
            <p>{product.description}</p>
        </div>
        <p>Category : <span>{product.category}</span></p>
        <button onClick={()=>{addToCart(product.id)}}>ADD TO CART</button>
      </div>
    </div>
  )
}

export default ProductDisplay
