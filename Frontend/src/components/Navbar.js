import { Link } from "react-router-dom";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/index.css";
import { GoHomeFill } from "react-icons/go";
import { FaDatabase, FaHistory } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import { IoIosArrowDropdown } from "react-icons/io";
import Swal from "sweetalert2";

const Navbar = () => {
  const navigate = useNavigate();
  const [isTransaksiOpen, setTransaksiOpen] = useState(false);
  const [isProdukOpen, setProdukOpen] = useState(false);
  const [isPinjamanOpen, setPinjamanOpen] = useState(false);
  const [isPenawaranOpen, setPenawaranOpen] = useState(false);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      navigate("/");

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Logged out successfully"
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav>
      <div className="drawer">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content m-7">
          <label htmlFor="my-drawer-4" className="drawer-button btn btn-outline text-white text-lg font-semibold">
            <IoMdMenu />
          </label>
        </div>

        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full text-base-content text-lg font-semibold bg-[#fff]">
            <li>
              <Link to="/dashboard" className="text-black hover:text-gray-400 my-3">
                <GoHomeFill /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/chat" className="text-black hover:text-gray-400 my-3">
                Chat
              </Link>
            </li>

            <li className="dropdown">
              <div
                className="text-black hover:text-gray-400 my-3 cursor-pointer"
                onClick={() => setTransaksiOpen(!isTransaksiOpen)}
              >
                Transaksi <IoIosArrowDropdown />
              </div>
              {isTransaksiOpen && (
                <ul className="pl-4">
                  <li>
                    <Link to="/pesanan" className="text-black hover:text-gray-400 my-2">
                      Pesanan
                    </Link>
                  </li>
                  <li>
                    <Link to="/padi-karir" className="text-black hover:text-gray-400 my-2">
                      PaDi Karir
                    </Link>
                  </li>
                  <li>
                    <Link to="/biaya-transaksi" className="text-black hover:text-gray-400 my-2">
                      Biaya Transaksi Penjual
                    </Link>
                  </li>
                  <li>
                    <Link to="/export-pesanan" className="text-black hover:text-gray-400 my-2">
                      Export Data Pesanan
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link to="/ulasan" className="text-black hover:text-gray-400 my-3">
                Ulasan
              </Link>
            </li>

            <li className="dropdown">
              <div
                className="text-black hover:text-gray-400 my-3 cursor-pointer"
                onClick={() => setProdukOpen(!isProdukOpen)}
              >
                Produk <IoIosArrowDropdown />
              </div>
              {isProdukOpen && (
                <ul className="pl-4">
                  <li>
                    <Link Link to="/product" className="text-black hover:text-gray-400 my-2">
                      Data Produk
                    </Link>
                  </li>
                  <li>
                    <Link to="/product/add" className="text-black hover:text-gray-400 my-2">
                      Tambah Produk
                    </Link>
                  </li>
                  <li>
                    <Link to="/tambah-produk-bulk" className="text-black hover:text-gray-400 my-2">
                      Tambah Produk Secara Bulk
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="dropdown">
              <div
                className="text-black hover:text-gray-400 my-3 cursor-pointer"
                onClick={() => setPinjamanOpen(!isPinjamanOpen)}
              >
                Pinjaman <IoIosArrowDropdown />
              </div>
              {isPinjamanOpen && (
                <ul className="pl-4">
                  <li>
                    <Link to="/pinjaman-tersedia" className="text-black hover:text-gray-400 my-2">
                      Tersedia
                    </Link>
                  </li>
                  <li>
                    <Link to="/pinjaman-berlangsung" className="text-black hover:text-gray-400 my-2">
                      Pinjaman Berlangsung
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="dropdown">
              <div
                className="text-black hover:text-gray-400 my-3 cursor-pointer"
                onClick={() => setPenawaranOpen(!isPenawaranOpen)}
              >
                Penawaran <IoIosArrowDropdown />
              </div>
              {isPenawaranOpen && (
                <ul className="pl-4">
                  {/* Add penawaran sub-menu items here if available */}
                </ul>
              )}
            </li>

            <li className="mt-6">
              <a
                href="#"
                className="text-black hover:text-gray-400 my-3"
                onClick={handleLogout}
              >
                <IoLogOut /> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
