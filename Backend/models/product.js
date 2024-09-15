'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Product.belongsTo(models.User);
        }
    }
    Product.init({
        userId: DataTypes.INTEGER,
        productName: DataTypes.STRING,
        productDeskripsi: DataTypes.STRING,
        productKategori: DataTypes.STRING,
        keterangan: DataTypes.STRING,
        productImage: DataTypes.STRING,
        hargaSatuan: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Product',
    });
    return Product;
};