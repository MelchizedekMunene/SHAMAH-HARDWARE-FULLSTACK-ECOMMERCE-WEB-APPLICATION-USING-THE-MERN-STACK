import React from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  return (
    <div className='newsletter'>
      <h1>Get Personalized Offers On Your Email</h1>
      <p>Subscribe To Our Newsletter Today</p>
      <div>
        <input type="email" placeholder="Enter Your Email" />
        <button>Subscribe</button>
      </div>
    </div>
  )
}

export default NewsLetter
