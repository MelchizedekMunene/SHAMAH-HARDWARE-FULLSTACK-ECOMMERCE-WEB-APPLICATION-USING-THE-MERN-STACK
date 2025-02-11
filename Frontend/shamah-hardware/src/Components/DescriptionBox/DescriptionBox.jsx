import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigate">
        <div className="descriptionbox-nav-box">
          Description
        </div>
        <div className="descriptionbox-description">
          <p>
          Shamah Hardware's online platform revolutionizes your hardware 
          shopping experience by bringing our extensive catalog
          of construction, electrical, plumbing, and farming tools
          directly to your fingertips, saving you valuable time and
          eliminating the need for physical store visits.
          Our detailed product descriptions, clear pricing,
          and categorized inventory make it effortless to find exactly what you need,
          whether you're a professional contractor or a DIY enthusiast.
          With our e-commerce solution, you can conveniently browse and compare products from anywhere,
          ensuring you make informed decisions for your projects while enjoying the reliability and quality
          that Shamah Hardware has always been known for.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DescriptionBox
