const { Review } = require('../../../models');

module.exports = async (req, res) => {
    const body = req.body;

    // Validasi Input
    if (!body.reviewProduct) {
        return res.status(400).json({
            message: "Review product must be provided"
        });
    }

    // Buat data review
    const dataReview = {
        reviewProduct: body.reviewProduct
    };

    try {
        // Simpan data review ke database
        const dbReview = await Review.create(dataReview);
        return res.json({
            message: 'Review created successfully',
            review: dbReview
        });
    } catch (error) {
        console.error('Failed to create review:', error);
        return res.status(500).json({ message: 'Failed to create review' });
    }
};
