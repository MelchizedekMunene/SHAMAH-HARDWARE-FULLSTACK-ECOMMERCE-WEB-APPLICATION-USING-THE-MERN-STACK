import React from 'react'
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import remove_icon from '../assets/cart_cross_icon.png'
import { useContext } from 'react'
import { loadStripe } from '@stripe/stripe-js';

const CartItems = () => {
    const {getTotalCartAmount,all_product,cartItems,removeFromCart} = useContext(ShopContext)
    const stripePromise = loadStripe('pk_test_51OKGYeJ9dTaadmST78mOocPBVYK6HCj7FZ2LgwXAVrycMSKsoRb9tsn0Sv5fEByQMQiwr3vVrrnqhI0Glgm7z45s00myYS7kl7');

    // Handler for checkout button
    const handleCheckout = async () => {
        const stripe = await stripePromise;
      
        const items = Object.entries(cartItems)
          .filter(([id, quantity]) => quantity > 0)
          .map(([id, quantity]) => {
            const product = all_product.find(p => p.id === Number(id));
            return {
              id: product.id,
              quantity: quantity,
            };
          });
      
        try {
          const response = await fetch('http://localhost:4000/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items }),
          });
      
          const session = await response.json();
      
          const result = await stripe.redirectToCheckout({
            sessionId: session.id,
          });
      
          if (result.error) {
            console.error(result.error.message);
          }
        } catch (err) {
          console.error('Checkout error', err);
        }
      }
    
  return (
    <div className='cartitem'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr/>
      {all_product.map((e)=> {
        if(cartItems[e.id] > 0) 
          {
            return (
               <div key={e.id}>
                  <div className="cartitems-format cartitems-format-main">
                    <img src={e.image} alt="" className='carticon-product-icon' />
                    <p>{e.name}</p>
                    <p>{e.price}</p>
                    <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                    <p>{e.price * cartItems[e.id]}</p>
                    <img className='cartitems-remove-icon' src={remove_icon} onClick={()=>{removeFromCart(e.id)}} alt="" />
                  </div>
                  <hr/>
                </div>
            );
           }
           return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>Ksh.{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>Ksh.{getTotalCartAmount()}</h3>
            </div>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter It Here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder='promo code' />
            <button>Submit</button>
          </div>
        </div>
      </div>  
    </div>
  )
}

export default CartItems