'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Products', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Users',
                    },
                    key: 'id'
                },
                allowNull: false
            },
            productName: {
                type: Sequelize.STRING
            },
            productDeskripsi: {
                type: Sequelize.STRING
            },
            productKategori: {
                type: Sequelize.STRING
            },
            keterangan: {
                type: Sequelize.STRING
            },
            hargaSatuan: {
                type: Sequelize.INTEGER
            },
            productImage: { // Menambahkan kolom untuk menyimpan URL gambar
                type: Sequelize.STRING,
                allowNull: true // Opsional, bisa disesuaikan apakah harus diisi atau tidak
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Products');
    }
};