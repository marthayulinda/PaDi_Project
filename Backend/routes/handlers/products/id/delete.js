const { Product, User } = require("../../../../models");
const verifyToken = require("../../../../middlewares/verify-token");

module.exports = async(req, res) => {
    try {
        // Memanggil middleware untuk memverifikasi token dan peran pengguna
        await verifyToken(req, res, async() => {
            const { productId } = req.params;
            const product = await Product.findByPk(productId, {
                include: [User],
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            // Menghapus produk tanpa menghapus Log (karena tidak digunakan)
            await product.destroy();
            return res.json({
                success: true,
                message: "Product deleted successfully",
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};