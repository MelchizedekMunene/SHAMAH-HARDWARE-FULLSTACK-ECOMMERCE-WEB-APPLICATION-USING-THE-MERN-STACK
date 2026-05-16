import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

const Item = ({ id, name, image, price, quantity }) => {
  const isSoldOut = quantity === 0 || quantity === undefined;

  return (
    <div className={`item ${isSoldOut ? 'sold-out' : ''}`} data-id={id}>
      <Link to={`/product/${id}`}>
        <div className='item-image-wrapper'>
          <img onClick={() => window.scrollTo(0, 0)} src={image} alt={name} />
          {isSoldOut && (
            <div className='sold-out-overlay'>
              <span className='sold-out-badge'>Sold Out</span>
            </div>
          )}
        </div>
      </Link>
      <p>{name}</p>
      <div className="item-prices">
        <div className="item-price-new">
          Ksh.{price}
        </div>
      </div>
    </div>
  );
};

export default Item;