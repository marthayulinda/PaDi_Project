import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './Navbar'
import Footer from './Footer'
import '../style/index.css'
import dashboardImg from '../assest/dashboard.jpg'
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [inventoryData, setInventoryData] = useState([])
  const userName = jwtDecode(localStorage.getItem('token')).data.name

  useEffect(() => {
    axios
      .get('http://localhost:5000/products')
      .then(response => {
        console.log('Data from API:', response.data)
        setInventoryData(response.data)
      })
      .catch(error => {
        console.error('Error fetching inventory data:', error)
      })
  }, [])

  const filteredInventory = inventoryData.filter(item => {
    const includesSearchTerm = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    console.log(
      `Item: ${item.name}, Search Term: ${searchTerm}, Result: ${includesSearchTerm}`
    )
    return includesSearchTerm
  })

  return (
    <div>
      <section
        className='hero is-fullheight'
        style={{
          background: `url(${dashboardImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Navbar />
        <div className='hero-body'>
          <div className='container has-text-left'>
            <h1 className='title is-size-1 has-text-white w-[600px]'>
              Aplikasi PaDi UMKM
            </h1>
            <h1 className='title is-size-1 has-text-[#87231c] w-[600px]'>Produk Digital Telkom</h1>
            <h2 className='subtitle mt-2 has-text-white'>
              <span className='text-white font-normal'>
                Welcome: {userName}
              </span>
            </h2>
            <h4 className='subtitle is-size-5 has-text-white'>
              <Link
                to={`/product`}
                className='btn bg-[#fff] hover:bg-[#fff1]  text-black hover:text-white font-semibold mx-1'
              >
                Manage Product{' '}
              </Link>
            </h4>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Dashboard
