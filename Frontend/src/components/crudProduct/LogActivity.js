import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import { jwtDecode } from 'jwt-decode';
import '../../style/index.css';

const itemsPerPage = 10;

const LogActivity = () => {
    const [historys, setHistorys] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const isBuyer = jwtDecode(localStorage.getItem('token')).data.role === 'Buyer';

    useEffect(() => {
        fetchHistorys();
    }, []);

    const fetchHistorys = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }

            const response = await axios.get('http://localhost:5000/logs', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setHistorys(response.data);
        } catch (error) {
            console.error('Error fetching historys:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredHistorys = historys.filter((history) => {
        return (
            history.Product.productName.toLowerCase().includes(searchTerm) ||
            history.User.name.toLowerCase().includes(searchTerm)
        );
    });

    const totalItems = filteredHistorys.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const visibleHistorys = filteredHistorys.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <section className="bg-cover bg-center bg-[#FFFFFF]">
            <Navbar />
            <div className="container mx-auto py-8 h-screen">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="border rounded px-2 py-1 w-64 focus:outline-none bg-white text-black"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {visibleHistorys.length > 0 ? (
                        <table className="w-full table-auto rounded">
                            <thead className="bg-[#50577A]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-white">Name</th>
                                    <th className="px-6 py-3 text-left text-white">User</th>
                                    <th className="px-6 py-3 text-left text-white">Stock</th>
                                    <th className="px-6 py-3 text-left text-white">Created At</th>
                                    <th className="px-6 py-3 text-left text-white">Update At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleHistorys.map((history, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                        <td className="border px-6 py-4">{history.Product.productName}</td>
                                        <td className="border px-6 py-4">{history.User.name}</td>
                                        <td className="border px-6 py-4">{new Date(history.createdAt).toLocaleDateString()}</td>
                                        <td className="border px-6 py-4">{new Date(history.updatedAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-600 mt-4">No data available</p>
                    )}
                </div>

                <div className="mt-4 flex justify-end">
                    <nav className="pagination">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <a
                                key={index}
                                className={`pagination-link ${currentPage === index + 1 ? 'is-current' : ''}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </section>
    );
};

export default LogActivity;
