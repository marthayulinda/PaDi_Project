const { Review } = require("../../../../models");

module.exports = async(req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findByPk(reviewId);

        const { reviewProduct } = req.body;
        const userId = req.user.id;

        // Cek apakah reviewName, keterangan, atau userId ada
        if (!reviewProduct) {
            return res.status(400).json({
                success: false,
                message: "reviewName and keterangan are required fields",
            });
        }

        // Update produk
        await review.update({
            reviewProduct
        });

        // Ambil produk yang sudah di-update tanpa Log dan Version
        const updatedReview = await Review.findByPk(reviewId);

        return res.json({
            success: true,
            message: "Review updated successfully",
            review: updatedReview,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};