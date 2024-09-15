const { Product } = require("../../../../models")

module.exports = async(req, res) => {
    const { productId } = req.params;
    const product = await Product.findByPk(productId);

    if (!product)
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    return res.json(product)
}