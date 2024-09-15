const { Product } = require('../../../models');
const multer = require('multer');
const path = require('path');

// Setup Multer for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Directory to save uploaded images
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file with current timestamp
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: function(req, file, cb) {
        const fileTypes = /jpeg|jpg|png/; // Allow only images
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extname && mimeType) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
}).single('productImage'); // 'productImage' is the field name for the image

module.exports = async(req, res) => {
    upload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }

        const body = req.body;
        console.log("Cek Body=====>", body);

        // Validation User Input
        if (!body.productName) {
            return res.status(400).json({
                message: "Product name must be provided"
            });
        }

        if (!body.productDeskripsi) {
            return res.status(400).json({
                message: "Product description must be provided"
            });
        }

        if (!body.productKategori) {
            return res.status(400).json({
                message: "Product category must be provided"
            });
        }

        // If 'keterangan' is empty, set it to 'Jasa'
        const keteranganValue = body.keterangan ? body.keterangan : 'Jasa';

        // Validasi Product Name sudah ada
        const productNameExists = await Product.findAll({
            where: { productName: body.productName }
        });
        if (productNameExists.length) {
            return res.status(400).json({
                message: "Name already exists"
            });
        }
        console.log("PRODUCT EXISTS========>", productNameExists);

        // If image is uploaded, set the image path, else set it to null
        const productImage = req.file ? req.file.path : null;

        const dataProduct = {
            productName: body.productName,
            productDeskripsi: body.productDeskripsi,
            productKategori: body.productKategori,
            hargaSatuan: body.hargaSatuan,
            keterangan: keteranganValue,
            userId: req.user.id,
            productImage: productImage // Save the image path to the database
        };

        const dbProduct = await Product.create(dataProduct);

        return res.json({
            message: 'Product created successfully',
            product: dbProduct
        });
    });
};