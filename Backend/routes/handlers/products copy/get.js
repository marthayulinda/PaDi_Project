const { Review, User } = require("../../../models");

// GET all Review data
module.exports = async(req, res) => {
    const data = await Review.findAll({ include: [User] });
    return res.json(data);
};