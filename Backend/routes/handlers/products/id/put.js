const { Product } = require("../../../../models");

module.exports = async(req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findByPk(productId);

        const { productName, keterangan } = req.body;
        const userId = req.user.id;

        // Cek apakah productName, keterangan, atau userId ada
        if (!productName || !userId || !keterangan) {
            return res.status(400).json({
                success: false,
                message: "productName and keterangan are required fields",
            });
        }

        // Update produk
        await product.update({
            productName,
            productDeskripsi,
            productKategori,
            keterangan,
        });

        // Ambil produk yang sudah di-update tanpa Log dan Version
        const updatedProduct = await Product.findByPk(productId);

        return res.json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};