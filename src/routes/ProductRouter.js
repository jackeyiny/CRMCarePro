const express = require("express");
const router = express.Router();
const productController = require('../controllers/ProductController');
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });

router.post('/create-product', upload.single('image'), productController.createProduct);
router.get('/getall', productController.getAllProducts);
router.get('/getone/:id', productController.getOneProduct);
router.put('/update/:id', productController.updateProduct);
router.delete('/delete/:id', productController.deleteProduct);
router.post('/add-review/:productId', productController.addReviewToProduct);

module.exports = router;
