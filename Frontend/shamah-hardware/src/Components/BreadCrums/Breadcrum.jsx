import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrum = ({ product }) => {
  if (!product) return null;

  return (
    <div className="breadcrum">
      <Link to="/">SHOP</Link>
      <span>/</span>
      {product.category && (
        <>
          <Link to={`/category/${product.category.toLowerCase()}`}>
            {product.category}
          </Link>
          <span>/</span>
        </>
      )}
      {product.name && (
        <span>
          {product.name}
        </span>
      )}
    </div>
  );
};

export default Breadcrum;