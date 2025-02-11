import React from 'react'
import './Hero.css'
import hand_icon from '../assets/hand_icon.png'
import arrow_icon from '../assets/arrow.png'
import hero_image from '../assets/hero-image.jpg'

const Hero = () => {
  return (
    <div className='hero' style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${hero_image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="hero-left">
        <div className="hero-text">
          <div className="hero-hand-icon">
            <p>new</p>
            <img src={hand_icon} alt='' />
          </div>
          <p>categories</p>
          <p>for everyone</p>
        </div>
        <div className="hero-latest-button">
          <div>Latest Equipment</div>
          <img src={arrow_icon} alt='' />
        </div>
      </div>
    </div>
  )
}

export default Hero