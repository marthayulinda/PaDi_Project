import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../Navbar'
import { Link, Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import '../../style/index.css'
import Swal from 'sweetalert2'
import {
  FaEarlybirds,
  FaEdit,
  FaInfo,
  FaNewspaper,
  FaTrash
} from 'react-icons/fa'

const itemsPerPage = 10

const Product = () => {
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOption, setSortOption] = useState('version')
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
    setCurrentPage(1) // Reset current page when the search term changes
  }

  const filteredProducts = products.filter(product => {
    return (
      product.productName.toLowerCase().includes(searchTerm) ||
      product.User.name.toLowerCase().includes(searchTerm)
    )
  })

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })

  const deleteProduct = async id => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        console.error('Token not found. User may not be authenticated.')
        return
      }

      const result = await swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'No, cancel!',
        confirmButtonText: 'Yes, delete it!',
        reverseButtons: true
      })

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setProducts(prevProducts =>
          prevProducts.filter(product => product.id !== id)
        )

        swalWithBootstrapButtons.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success'
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: 'Cancelled',
          text: 'Your file is safe :)',
          icon: 'error'
        })
      }
    } catch (error) {
      console.error('Error during deletion:', error)
    }
  }

  const handleSortChange = event => {
    setSortOption(event.target.value)
    applySorting(event.target.value)
  }

  const applySorting = option => {
    let sortedProducts = [...products]

    if (option === 'version') {
      sortedProducts.sort((a, b) =>
        a.name_version.localeCompare(b.name_version)
      )
    } else if (option === 'date') {
      sortedProducts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    }

    setProducts(sortedProducts)
  }

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  const totalItems = filteredProducts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
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
      <div className='container mx-auto py-8 h-screen'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center'>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className='select select-bordered mr-4 bg-white text-black font-normal'
            >
              <option value='date'>Date</option>
            </select>
            <input
              type='text'
              placeholder='Search...'
              value={searchTerm}
              onChange={handleSearch}
              className='border rounded px-2 py-1 w-64 focus:outline-none bg-white text-black'
            />
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full table-auto rounded'>
            <thead className='bg-[#50577A]'>
              <tr>
                <th className='px-4 py-2 text-white'>Nama Produk</th>
                <th className='px-4 py-2 text-white'>Deskripsi Produk</th>
                <th className='px-4 py-2 text-white'>Kategori Produk</th>
                <th className='px-4 py-2 text-white'>User</th>
                <th className='px-4 py-2 text-white'>Keterangan</th>
                <th className='px-4 py-2 text-white'>Harga Satuan</th>
                <th className='px-4 py-2 text-white'>Image</th>
                <th className='px-4 py-2 text-white'>Created At</th>
                <th className='px-4 py-2 text-white'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.length > 0 ? (
                visibleProducts.map((product, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                  >
                    <td className='border px-4 py-2'>{product.productName}</td>
                    <td className='border px-4 py-2'>
                      {product.productDeskripsi}
                    </td>
                    <td className='border px-4 py-2'>
                      {product.productKategori}
                    </td>
                    <td className='border px-4 py-2'>{product.User.name}</td>
                    <td className='border px-4 py-2'>{product.keterangan}</td>
                    <td className='border px-4 py-2'>{product.hargaSatuan}</td>


                    <td className='border px-4 py-2'>
                      {product.productImage ? (
                        <img
                          src={`http://localhost:5000/${product.productImage}`}
                          alt={product.productName}
                          className='w-24 h-24 object-cover'
                        />
                      ) : (
                        'No image'
                      )}
                    </td>
                    <td className='border px-4 py-2'>
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className='border px-4 py-2'>
                      <button
                        onClick={() => showProductDetails(product)}
                        className='btn btn-success text-white font-normal mx-2'
                      >
                        <FaNewspaper />
                      </button>
                      {!isBuyer && (
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className='btn btn-error text-white font-normal mx-2'
                        >
                          <FaTrash />
                        </button>
                      )}
                      <Link
                        to={`edit/${product.id}`}
                        className='btn btn-info text-white font-normal mx-2'
                      >
                        <FaEdit />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='6' className='text-center py-4 text-white'>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className='mt-4 flex justify-end'>
          <nav className='pagination'>
            {Array.from({ length: totalPages }).map((_, index) => (
              <a
                key={index}
                className={`pagination-link ${
                  currentPage === index + 1 ? 'is-current' : ''
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}

export default Product
