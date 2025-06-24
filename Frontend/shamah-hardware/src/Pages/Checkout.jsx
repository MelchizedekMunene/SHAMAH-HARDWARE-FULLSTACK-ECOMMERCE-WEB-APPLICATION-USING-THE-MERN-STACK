import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import './CSS/Checkout.css';

const Checkout = () => {
  const { getTotalCartAmount, all_product, cartItems } = useContext(ShopContext);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState([]);

  useEffect(() => {
    // Generate order summary from cart items
    const summary = [];
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const product = all_product.find(product => product.id === Number(item));
        if (product) {
          summary.push({
            ...product,
            quantity: cartItems[item],
            total: product.price * cartItems[item]
          });
        }
      }
    }
    setOrderSummary(summary);
  }, [cartItems, all_product]);

  const handlePhoneNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Format phone number (254XXXXXXXXX)
    if (value.startsWith('0')) {
      value = '254' + value.substring(1);
    } else if (value.startsWith('7') || value.startsWith('1')) {
      value = '254' + value;
    }
    
    setPhoneNumber(value);
  };

  const handleMpesaPayment = async () => {
    if (!phoneNumber || phoneNumber.length !== 12) {
      alert('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/mpesa/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token')
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          amount: getTotalCartAmount(),
          orderItems: orderSummary
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Payment request sent! Please check your phone for the M-Pesa prompt.');
        // You can redirect to a payment status page here
        // window.location.href = '/payment-status';
      } else {
        alert('Payment failed: ' + data.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneDisplay = (phone) => {
    if (phone.length >= 12) {
      return `+${phone.substring(0, 3)} ${phone.substring(3, 6)} ${phone.substring(6, 9)} ${phone.substring(9)}`;
    }
    return phone;
  };

  if (orderSummary.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <p>Add some items to your cart before checkout</p>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="checkout-container">
        {/* Order Summary Section */}
        <div className="checkout-summary">
          <h2>Your Order Summary</h2>
          <div className="order-items">
            {orderSummary.map((item) => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.name} className="order-item-image" />
                <div className="order-item-details">
                  <h4>{item.name}</h4>
                  <p>Category: {item.category}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: KSh {item.price.toLocaleString()}</p>
                  <p className="item-total">Total: KSh {item.total.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="order-total">
            <h3>Total Amount: KSh {getTotalCartAmount().toLocaleString()}</h3>
          </div>
        </div>

        {/* Payment Section */}
        <div className="checkout-payment">
          <h2>Payment Method</h2>
          
          <div className="payment-methods">
            <div className="payment-method">
              <input
                type="radio"
                id="mpesa"
                name="payment"
                value="mpesa"
                checked={paymentMethod === 'mpesa'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="mpesa" className="payment-label">
                <div className="mpesa-logo">
                  <span className="mpesa-text">M-PESA</span>
                </div>
                <span>Pay with M-Pesa</span>
              </label>
            </div>
          </div>

          {paymentMethod === 'mpesa' && (
            <div className="mpesa-form">
              <h3>M-Pesa Payment Details</h3>
              <div className="form-group">
                <label htmlFor="phone">Phone Number:</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Enter your phone number (0712345678)"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  maxLength="12"
                />
                {phoneNumber && (
                  <small className="phone-preview">
                    Formatted: {formatPhoneDisplay(phoneNumber)}
                  </small>
                )}
              </div>
              
              <div className="payment-info">
                <p><strong>Amount to Pay:</strong> KSh {getTotalCartAmount().toLocaleString()}</p>
                <p><small>You will receive an M-Pesa prompt on your phone to complete the payment.</small></p>
              </div>

              <button 
                className="pay-button"
                onClick={handleMpesaPayment}
                disabled={loading || !phoneNumber || phoneNumber.length !== 12}
              >
                {loading ? 'Processing...' : `Pay KSh ${getTotalCartAmount().toLocaleString()} with M-Pesa`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;