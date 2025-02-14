import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import About from '../components/About'
const Home = () => {
  return ( 
    <div>
      <Header/>
    <About/> 
    </div>
  )
}

export default Home
