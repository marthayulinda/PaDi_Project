import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Navbar from '../Navbar'
import { jwtDecode } from 'jwt-decode'


const DetailProduct = () => {
  const { id } = useParams() // Mengambil ID produk dari URL
  const [product, setProduct] = useState(null)
  const [activeTab, setActiveTab] = useState('description') // Tab aktif
  const [review, setReview] = useState(''); // State untuk input review
  const [reviews, setReviews] = useState([]);

  const isBuyer = jwtDecode(localStorage.getItem('token')).data.role === 'Buyer'

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        return
      }

      const response = await axios.get(`http://localhost:5000/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setProduct(response.data)
    } catch (error) {
      console.error('Error fetching product details:', error)
    }
  }

  const handleSubmitReview = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return;
      }

      await axios.post(`http://localhost:5000/products/${id}`, {
        review,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh reviews setelah submit
      fetchReviews();
      setReview(''); // Mengosongkan input setelah submit
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

    // Fungsi untuk mengambil semua review
    const fetchReviews = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/products/${id}/reviews`);
          setReviews(response.data); // Set state dengan review yang diambil dari API
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <section className='bg-cover bg-center bg-[#FFFFFF]'>
      <Navbar />
      <div className='container mx-auto py-8'>
        <div className='columns-3 gap-8'>
          {/* Gambar Produk */}
          <div className='flex justify-center'>
            <img
              src={`http://localhost:5000/${product.productImage}`}
              alt={product.productName}
              className='max-w-full h-auto object-cover'
            />
          </div>

          {/* Detail Produk */}
          <div className='space-y-4'>
            {/* Nama Produk */}
            <h1 className='text-2xl font-bold'>{product.productName}</h1>

            {/* Harga Produk */}
            <div className='text-gray-600'>
              <span className='text-xl font-semibold'>Rp {product.price}</span>
            </div>

            {/* Deskripsi Produk */}
            <p>{product.productDeskripsi}</p>

            {/* Informasi Lainnya */}
            <div className='space-y-2'>
              <p>Kategori: {product.productCategory}</p>
              <p>Brand: {product.productBrand}</p>
              <p>Berat Satuan: {product.productWeight} gram</p>
              <p>Dimensi: {product.productDimension}</p>
            </div>

            {/* Kontrol Jumlah Pembelian */}
            <div className='mt-4'>
              <label className='block font-semibold mb-2'>
                Jumlah Pembelian
              </label>
              <div className='flex items-center border border-gray-300 rounded'>
                <button className='px-4 py-2'>-</button>
                <input
                  type='number'
                  className='w-12 text-center'
                  value={1}
                  readOnly
                />
                <button className='px-4 py-2'>+</button>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className='space-y-4'>
              <button className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'>
                + Keranjang
              </button>
              <button className='w-full bg-green-500 text-white py-2 rounded hover:bg-green-600'>
                Chat Penjual
              </button>
            </div>
          </div>
        </div>

        {/* Deskripsi produk dan Review */}
        <div className='mt-8 border-t pt-4'>
          <div className='container mx-auto mt-8'>
            {/* Tab Navigasi */}
            <ul className='flex border-b'>
              <li
                className={`${
                  activeTab === 'description'
                    ? 'border-b-2 border-blue-500'
                    : ''
                } mr-1`}
              >
                <button
                  className={`text-lg px-4 py-2 ${
                    activeTab === 'description'
                      ? 'text-blue-500'
                      : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('description')}
                >
                  Deskripsi Produk
                </button>
              </li>
              <li
                className={`${
                  activeTab === 'review' ? 'border-b-2 border-blue-500' : ''
                } mr-1`}
              >
                <button
                  className={`text-lg px-4 py-2 ${
                    activeTab === 'review' ? 'text-blue-500' : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('review')}
                >
                  Review
                </button>
              </li>
            </ul>

            {/* Konten Tab */}
            <div className='mt-4'>
              {activeTab === 'description' && (
                <div>
                  <h1 className='text-xl font-bold mb-2'>Deskripsi Produk</h1>
                  <p>{product.productDeskripsi}</p>
                </div>
              )}
              
              {activeTab === 'review' && (
                <div>
                  <h1 className='text-xl font-bold mb-2'>Review</h1>
                  {isBuyer && (
                  <div className='mt-4'>
                    <button
                      onClick={handleSubmitReview}
                      className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
                    >
                      Kirim Review
                    </button>
                  </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DetailProduct
