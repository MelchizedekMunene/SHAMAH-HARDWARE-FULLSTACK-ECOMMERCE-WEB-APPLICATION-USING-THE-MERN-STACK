import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

// Add onProductAdded prop here
const AddProduct = ({ onProductAdded }) => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "construction",
    price: "",
    description: ""
  })

  // Your existing handlers remain the same
  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  }

  const changeHandler = (e) => {
    setProductDetails({...productDetails, [e.target.name]: e.target.value})
  }

  const Add_Product = async () => {
    try {
      let formData = new FormData();
      formData.append('product', image);

      const imageUploadResponse = await fetch('http://localhost:4001/upload', {
        method: "POST",
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      const responseData = await imageUploadResponse.json();

      if (responseData.success) {
        const product = {
          ...productDetails,
          image: responseData.image_url
        };

        const productResponse = await fetch('http://localhost:4001/addproduct', {
          method: "POST",
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });

        const productData = await productResponse.json();

        if (productData.success) {
          alert("Product Added Successfully.");
          // Reset form
          setProductDetails({
            name: "",
            image: "",
            category: "construction",
            price: "",
            description: ""
          });
          setImage(false);
          // Call the refresh function
          if (onProductAdded) {
            onProductAdded();
          }
        } else {
          alert("Failed to add product.");
        }
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  }

  return (
    <div className='addproduct'>
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type Here'/>
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetails.price} onChange={changeHandler} type="text" name='price' placeholder='Type Here'/>
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className='addproduct-selector'>
          <option value="construction">Construction</option>
          <option value="electricals">Electricals</option>
          <option value="plumbing">Plumbing</option>
          <option value="farm tools">Farm Tools</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Description</p>
        <textarea value={productDetails.description} onChange={changeHandler} name="description" placeholder="Type Here"/>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Image</p>
        <label htmlFor="file-input">
          <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img' alt=""/>
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden/>
      </div>
      <button onClick={()=>{Add_Product()}} className='addproduct-btn'>Add</button>

    </div>
  )
}

export default AddProduct
