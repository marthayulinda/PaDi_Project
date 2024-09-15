const { Product, User } = require("../../../models");

// GET all Product data
module.exports = async(req, res) => {
    const data = await Product.findAll({ include: [User] });
    return res.json(data);
};