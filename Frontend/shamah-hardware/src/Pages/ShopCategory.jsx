import React, { useContext } from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../Context/ShopContext'
import Item from '../Components/Item/Item'

const ShopCategory = (props) => {
  const {all_product} = useContext(ShopContext);
  
  // Filter products by category
  const filteredProducts = all_product.filter(item => 
    item.category === props.category
  );

  return (
    <div className='shop-category'>
      <img src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-{filteredProducts.length}</span> out of {filteredProducts.length} products
        </p>
        <div className="shopcategory-sort">
          Sort By <span class="dropdown"> > </span>
        </div>
      </div>
      <div className="shopcategory-products">
        {filteredProducts.map((item, i) => (
          <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price} />
        ))}
      </div>
      <div className="shopcategory-loadmore">
        Explore More
      </div>

    </div>
  )
}

export default ShopCategory
