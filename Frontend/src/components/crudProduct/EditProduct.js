import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from '../Navbar';
import { jwtDecode } from 'jwt-decode';

const EditProduct = () => {
  const [product, setProduct] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [msg, setMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getProductById();
  }, []);
  
  const isBuyer = jwtDecode(localStorage.getItem('token')).data.role === 'Buyer';

  const handleEdit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("Token is missing or invalid");
        return;
      }
  
      await axios.put(
        `http://localhost:5000/products/${id}`,
        {
          productName: product,
          keterangan: keterangan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 2000
      });
      setMsg('');
      navigate("/product");
    } catch (error) {
        console.error(error);
    }
  };

  const getProductById = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response from getProductById:", response.data);

      setProduct(response.data.productName);
      setKeterangan(response.data.keterangan);
    } catch (error) {
      console.error("Error in getProductById:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF]">
      <Navbar/>
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-xl mx-auto w-full">
          <form onSubmit={handleEdit} className="bg-gray-900 shadow-md rounded px-5 pt-6 pb-8 mb-4">
            <div className="field ">
              <label className="block text-white text-sm font-bold mb-2">Product</label>
              <div className="control ">
                <input
                  type="text"
                  className="rounded-lg w-full bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none text-gray-400"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="Product"
                />
              </div>
            </div>
            {!isBuyer && (
            <div className="mb-4">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="keterangan"
              >
                dsadsadas Produk
              </label>
              <select
                className="rounded-lg w-full bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none text-gray-400"
                id="keterangan"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
              >
                <option value="" disabled>Select Keterangan</option>
                <option value="Barang">Barang</option>
                <option value="Jasa">Jasa</option>
              </select>
            </div>
            )}
            <div className="field">
              <button type="submit" className="btn bg-[#004225] hover:bg-[#1f533d] text-white hover:text-white font-semibold">
                Update
              </button>
            </div>
            <div className="flex items-center justify-center mt-4">
              <button
                className="btn w-full bg-[#DA0C81] hover:bg-[#c9609b] text-white hover:text-white font-semibold"
                onClick={() => navigate('/product')}
              >
                Back to Products
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
