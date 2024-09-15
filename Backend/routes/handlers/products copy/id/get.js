const { Review } = require("../../../../models")

module.exports = async(req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);

    if (!review)
        return res.status(404).json({
            success: false,
            message: "Review not found"
        });
    return res.json(review)
}