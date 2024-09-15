import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../Navbar'
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import '../../style/index.css'
import Swal from 'sweetalert2'

const Product = () => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const isBuyer = jwtDecode(localStorage.getItem('token')).data.role === 'Buyer'

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }
      const response = await axios.get('http://localhost:5000/products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleSearch = event => {
    setSearchTerm(event.target.value.toLowerCase())
  }

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm)
  )

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })

  const showProductDetails = product => {
    Swal.fire({
      title: 'Product Details',
      html: `
            <div class="bg-white rounded-lg shadow-md p-6">
            <div class="grid grid-cols-2 gap-4">
                <div class="mb-4">
                    <p class="text-lg font-bold text-gray-800">Name</p>
                    <p class="text-gray-600">${product.productName}</p>
                </div>
                <div class="mb-4">
                    <p class="text-lg font-bold text-gray-800">User</p>
                    <p class="text-gray-600">${product.User.name}</p>
                </div>

                <div class="mb-4">
                    <p class="text-lg font-bold text-gray-800">Description</p>
                    <p class="text-gray-600">${product.keterangan}</p>
                </div>
                <div class="mb-4">
                    <p class="text-lg font-bold text-gray-800">Created At</p>
                    <p class="text-gray-600">${new Date(
                      product.createdAt
                    ).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
        
            `,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Cancel',
      customClass: {
        container: 'max-w-10xl mx-auto',
        content: 'bg-white p-6 rounded-lg shadow-lg'
      },
      onClose: () => {
        console.log('SweetAlert2 closed')
      }
    })
  }
  return (
    <section className='bg-cover bg-center bg-[#FFFFFF]'>
      <Navbar />
      <div className='container mx-auto py-8'>
        <div className='flex items-center justify-between mb-4'>
          <input
            type='text'
            placeholder='Search...'
            value={searchTerm}
            onChange={handleSearch}
            className='border rounded px-2 py-1 w-64 focus:outline-none bg-white text-black'
          />
        </div>

        {/* Product Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div
                key={index}
                className='bg-white shadow-md rounded-lg overflow-hidden'
              >
                <Link to={`detail/${product.id}`}>
                  <img
                    src={`http://localhost:5000/${product.productImage}`}
                    alt={product.productName}
                    className='w-full h-40 object-cover'
                  />
                  <div className='p-4'>
                    <h3 className='text-lg font-bold'>{product.productName}</h3>
                    <p className='text-gray-800 font-bold'>
                      Rp{product.hargaSatuan}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className='text-center col-span-full'>No products available</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default Product
