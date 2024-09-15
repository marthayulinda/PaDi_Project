import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Swal from 'sweetalert2'
import Navbar from '../Navbar'
import { MdError } from 'react-icons/md'
import { jwtDecode } from 'jwt-decode'

const AddProduct = () => {
  const [productName, setProductName] = useState('')
  const [productDeskripsi, setProductDeskripsi] = useState('')
  const [productKategori, setProductKategori] = useState('')
  const [keterangan, setketerangan] = useState('')
  const [hargaSatuan, sethargaSatuan] = useState('')
  const [productImage, setProductImage] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [submitted, setSubmitted] = useState(false) // Track whether the form is submitted
  const navigate = useNavigate()

  const isBuyer = jwtDecode(localStorage.getItem('token')).data.role === 'Buyer'

  const createProduct = async e => {
    e.preventDefault()
    setSubmitted(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Token is missing or invalid')
        return
      }

      // Menggunakan FormData untuk mengirim data dan file
      const formData = new FormData()
      formData.append('productName', productName)
      formData.append('productDeskripsi', productDeskripsi)
      formData.append('productKategori', productKategori)
      formData.append('hargaSatuan', hargaSatuan)
      formData.append('keterangan', keterangan)

      if (productImage) {
        formData.append('productImage', productImage) // Menambahkan file gambar
      }

      const response = await axios.post(
        'http://localhost:5000/products',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' // Harus multipart untuk upload file
          }
        }
      )

      Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: 'Your product has been saved',
        showConfirmButton: false,
        timer: 2000
      })

      navigate('/product')
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage || 'Check your data again!'
      })
    }
  }

  return (
    <section className='bg-[#03001C] min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-grow flex items-center justify-center '>
        <div className='max-w-xl mx-auto w-full'>
          <form
            className='bg-gray-900 shadow-md rounded px-5 pt-6 pb-8 mb-4'
            onSubmit={createProduct}
          >
            <div className='mb-4'>
              <label
                className='block text-white text-sm font-bold mb-2'
                htmlFor='keterangan'
              >
                Jenis Produk
              </label>
              <select
                className='rounded-lg w-full bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none text-gray-400'
                id='keterangan'
                value={keterangan}
                onChange={e => setketerangan(e.target.value)}
              >
                <option value='' disabled selected></option>
                <option value='Barang'>Barang</option>
                <option value='Jasa'>Jasa</option>
              </select>
              {submitted && !keterangan && (
                <p className='text-red-500'>Keterangan is required</p>
              )}
            </div>

            <div className='mb-4'>
              <label
                className='block text-white text-sm font-bold mb-2'
                htmlFor='productName'
              >
                Nama Produk
              </label>
              <textarea
                className='rounded-lg w-full bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none text-gray-400'
                id='productName'
                placeholder='Nama Produk'
                value={productName}
                onChange={e => setProductName(e.target.value)}
              />
              {submitted && !productName && (
                <p className='text-red-500'>Product name is required</p>
              )}
            </div>

            <div className='mb-4'>
              <label
                className='block text-white text-sm font-bold mb-2'
                htmlFor='productDeskripsi'
              >
                Deskripsi Produk
              </label>
              <textarea
                className='rounded-lg w-full bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none text-gray-400'
                id='productDeskripsi'
                placeholder='Deskripsi Produk'
                value={productDeskripsi}
                onChange={e => setProductDeskripsi(e.target.value)}
              />
              {submitted && !productDeskripsi && (
                <p className='text-red-500'>Product description is required</p>
              )}
            </div>

            <div className='mb-4'>
              <label
                className='block text-white text-sm font-bold mb-2'
                htmlFor='hargaSatuan'
              >
                Harga Satuan
              </label>
              <input
                className='rounded-lg w-full bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none text-gray-400'
                id='hargaSatuan'
                type='text'
                placeholder='Rp.25.000'
                value={hargaSatuan}
                onChange={e => sethargaSatuan(e.target.value)}
              />
              {submitted && !hargaSatuan && (
                <p className='text-red-500'>Harga Satuan is required</p>
              )}
            </div>

            <div className='mb-4'>
              <label
                className='block text-white text-sm font-bold mb-2'
                htmlFor='productKategori'
              >
                Kategori Produk
              </label>
              <select
                className='rounded-lg w-full bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none text-gray-400'
                id='productKategori'
                value={productKategori}
                onChange={e => setProductKategori(e.target.value)}
              >
                <option value='' disabled selected></option>
                <option value='Lemari'>Lemari</option>
                <option value='Tas'>Tas</option>
              </select>
              {submitted && !productKategori && (
                <p className='text-red-500'>Product Kategori is required</p>
              )}
            </div>

            <div className='mb-4'>
              <label
                className='block text-white text-sm font-bold mb-2'
                htmlFor='productImage'
              >
                Upload Gambar Produk
              </label>
              <input
                className='rounded-lg w-full bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none text-gray-400'
                id='productImage'
                type='file'
                accept='image/*'
                onChange={e => setProductImage(e.target.files[0])} // Set file to state
              />
              {submitted && !productImage && (
                <p className='text-red-500'>Product image is required</p>
              )}
            </div>

            {!isBuyer && (
              <div className='mb-4'>
                <label
                  className='block text-white text-sm font-bold mb-2'
                  htmlFor='keterangan'
                >
                  Jenis Produk
                </label>
                <select
                  className='rounded-lg w-full bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none text-gray-400'
                  id='version'
                  value={keterangan}
                  onChange={e => setketerangan(e.target.value)}
                >
                  <option value='' disabled selected>
                    Select Keterangan
                  </option>
                  <option value='Barang'>Barang</option>
                  <option value='Jasa'>Jasa</option>
                </select>
                {submitted && !keterangan && (
                  <p className='text-red-500'>Keterangan is required</p>
                )}
              </div>
            )}

            {errorMessage && (
              <div
                role='alert'
                className='text-white text-md font-light alert alert-warning my-5'
              >
                <p className='flex justify-center items-center text-white text-sm'>
                  {' '}
                  <MdError /> {errorMessage}
                </p>
              </div>
            )}

            <div className='flex items-center justify-center'>
              <button
                className='btn w-full bg-[#363062] hover:bg-[#484275] text-white hover:text-white font-semibold'
                type='submit'
              >
                Create
              </button>
            </div>
            <div className='flex items-center justify-center mt-4'>
              <button
                className='btn w-full bg-[#DA0C81] hover:bg-[#c9609b] text-white hover:text-white font-semibold'
                onClick={() => navigate('/product')}
              >
                Back to Products
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default AddProduct
