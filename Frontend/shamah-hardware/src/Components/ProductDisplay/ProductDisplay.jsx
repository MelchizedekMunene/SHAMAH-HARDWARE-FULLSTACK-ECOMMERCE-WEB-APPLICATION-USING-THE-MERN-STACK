import React, { useContext } from 'react'
import './ProductDisplay.css'
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = ( {product} ) => {

    const {addToCart, removeFromCart, cartItems} = useContext(ShopContext);
    
    if (!product) return null;

    const currentQuantity = cartItems[product.id] || 0;
    const isSoldOut = product.quantity === 0 || product.quantity === undefined;

    const handleAddToCart = () => {
        if (!isSoldOut) {
            addToCart(product.id);
        }
    }

    const handleRemoveFromCart = () => {
        if (currentQuantity > 0) {
            removeFromCart(product.id);
        }
    }

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
        <div className="productdisplay-stock-status">
          {isSoldOut ? (
            <span className="sold-out-badge">OUT OF STOCK</span>
          ) : product.quantity < 5 ? (
            <span className="low-stock-badge">Low Stock ({product.quantity} left)</span>
          ) : (
            <span className="in-stock-badge">In Stock</span>
          )}
        </div>
        <div className="productdisplay-right-description">
            <p>{product.description}</p>
        </div>
        <p>Category : <span>{product.category}</span></p>
        
        <div className="productdisplay-quantity-control">
          {isSoldOut ? (
            <button className="add-to-cart-btn sold-out-btn" disabled>SOLD OUT</button>
          ) : currentQuantity === 0 ? (
            <button className="add-to-cart-btn" onClick={handleAddToCart}>ADD TO CART</button>
          ) : (
            <div className="quantity-controls">
              <button className="qty-btn decrement" onClick={handleRemoveFromCart}>−</button>
              <span className="qty-display">{currentQuantity}</span>
              <button className="qty-btn increment" onClick={handleAddToCart}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDisplay