import React, { useState } from 'react'
import './CSS/LoginSignup.css'
import { API_BASE_URL } from '../config/api'

const LoginSignup = () => {

  const [state,setState] = useState("Login");
  const [formData,setFormData] = useState({
    username:"",
    password:"",
    email:"",
    phone:""
  })

  const changeHandler = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const login = async () => {
    console.log("Login function executed",formData);
    let responseData;
    await fetch(`${API_BASE_URL}/login`,{
      method:'POST',
      headers:{
        Accept:'application/formData',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response)=> response.json()).then((data)=>responseData = data)

    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors);
    }
  }

  const signup = async () => {
    console.log("Sign Up function executed",formData);
    let responseData;
    await fetch(`${API_BASE_URL}/signup`,{
      method:'POST',
      headers:{
        Accept:'application/formData',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response)=> response.json()).then((data)=>responseData = data)

    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors);
    }
  }


  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" ?
          <input name="username" value={formData.username} onChange={changeHandler} type="text" placeholder="Enter Name" />:<></>}
          <input name="email" value={formData.email} onChange={changeHandler} type="email" placeholder="Email Address" />
          {state === "Sign Up" ?
          <input name="phone" value={formData.phone} onChange={changeHandler} type="tel" placeholder="Phone Number (e.g., 0712345678)" />:<></>}
          <input name="password" value={formData.password} onChange={changeHandler} type="password" placeholder="password" />
        </div>
        <button onClick={() => {state === "Login" ? login() : signup()}}>Continue</button>
        {state === "Sign Up" 
        ? <p className="loginsignup-login">Already have an account? <span onClick={()=>{setState("Login")}}>Log In Here</span></p>
        : <p className="loginsignup-login">Create an account? <span onClick={()=>{setState("Sign Up")}}>Click Here</span></p>
        }
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing I agree to the terms of use </p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup
