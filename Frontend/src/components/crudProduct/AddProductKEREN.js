import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const AddProduct = () => {
  const [type, setType] = useState("Barang");
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [minOrder, setMinOrder] = useState(1);
  const navigate = useNavigate();

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing or invalid");
        return;
      }

      await axios.post(
        "http://localhost:5000/products",
        {
          type,
          category,
          productName,
          description,
          price,
          stock,
          minOrder,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Product has been added successfully",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate("/product");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <section className="bg-white min-h-screen">
      <Navbar />
      <div className="">
        <form
          onSubmit={createProduct}
          className="bg-white shadow-lg rounded-lg p-8 max-w-7xl mx-auto"
        >
          <h2 className="text-lg font-bold mb-6">Tambah Produk</h2>

          {/* Jenis Produk */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Jenis Produk</h3>
            <div className="flex gap-4">
              <button
                type="button"
                className={`px-4 py-3 border ${
                  type === "Barang"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white"
                } rounded-lg flex-1 text-left`}
                onClick={() => setType("Barang")}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Barang</span>
                  {type === "Barang" && (
                    <span className="text-blue-500 font-bold">✓</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Berupa produk fisik yang memiliki dimensi berat, panjang, dan
                  lebar
                </p>
              </button>
              <button
                type="button"
                className={`px-4 py-3 border ${
                  type === "Jasa"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white"
                } rounded-lg flex-1 text-left`}
                onClick={() => setType("Jasa")}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Jasa</span>
                  {type === "Jasa" && (
                    <span className="text-blue-500 font-bold">✓</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Berupa produk non-fisik dalam bentuk layanan
                </p>
              </button>
            </div>
          </div>

          {/* Informasi Produk */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">
              Informasi Produk
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Nama Produk</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="Nama Produk"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Saran: Jenis Produk + Merek Produk + Keterangan Tambahan
                </p>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Kategori Produk
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="" disabled>
                    Pilih Kategori
                  </option>
                  <option value="Lemari">Lemari</option>
                  <option value="Kursi">Kursi</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">
                  Deskripsi Produk
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="Deskripsi Produk"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Media Produk */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Media Produk</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Foto Produk</label>
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(10)].map((_, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 rounded-lg p-3 flex items-center justify-center text-gray-400 relative"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        title={`Upload Foto ${index + 1}`}
                      />
                      <span>Foto {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Video Produk</label>
                <input
                  type="file"
                  accept="video/*"
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Video maksimum 10MB, disarankan menggunakan format MP4
                </p>
              </div>
            </div>
          </div>

          {/* Harga Produk */}
          <div className="mb-6">
            <div className="p-6 bg-white border border-gray-200 rounded-md shadow-sm">
              <h2 className="font-semibold text-xl text-gray-800 mb-4">
                Harga Produk
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    Harga Satuan <span className="text-red-500">Wajib</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Rp. 25.000"
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                  <div className="flex items-center mt-3">
                    <input type="checkbox" id="showDiscount" className="mr-2" />
                    <label htmlFor="showDiscount" className="text-gray-700">
                      Tampilkan Harga Diskon
                    </label>
                  </div>
                  <div className="mt-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mb-4">
                    <p className="text-gray-700">
                      Estimasi pendapatan (setelah dipotong biaya transaksi
                      penjual)
                    </p>
                    <p className="text-xl font-semibold text-gray-800">Rp0</p>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-gray-700 text-sm">
                      Mulai 10 Mei 2023, terdapat penambahan biaya transaksi
                      penjual.{" "}
                      <a href="#" className="text-blue-600 underline">
                        Lihat Selengkapnya
                      </a>
                    </p>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stok Produk */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Stok Produk</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Stok Unit</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Pembelian Minimum
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
              onClick={() => navigate("/product")}
            >
              Kembali
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddProduct;
