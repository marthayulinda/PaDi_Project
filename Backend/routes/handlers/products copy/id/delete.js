const { Review, User } = require("../../../../models");
const verifyToken = require("../../../../middlewares/verify-token");

module.exports = async(req, res) => {
    try {
        // Memanggil middleware untuk memverifikasi token dan peran pengguna
        await verifyToken(req, res, async() => {
            const { reviewId } = req.params;
            const review = await Review.findByPk(reviewId, {
                include: [User],
            });

            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: "Review not found"
                });
            }

            // Menghapus produk tanpa menghapus Log (karena tidak digunakan)
            await review.destroy();
            return res.json({
                success: true,
                message: "Review deleted successfully",
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};