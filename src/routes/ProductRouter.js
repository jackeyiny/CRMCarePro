const express = require("express");
const router = express.Router()
const productController = require('../controllers/ProductController');
const { AuthMiddleware } = require("../middleware/AuthMiddleware");


router.post('/create', productController.createProduct)
router.put('/update/:id', AuthMiddleware, productController.updateProduct)
router.get('/details/:id', productController.getDetailsProduct)
router.get('/getAll', productController.getAllProduct)
router.delete('/delete/:id', AuthMiddleware, productController.deleteProduct)
router.post('/delete-many', AuthMiddleware, productController.deleteProductMany)
router.get('/get-all-type', productController.getAllTypeProduct)
router.get('/getAllProduct', productController.getAllProductType)

router.get('/search', productController.getSearch)

router.get('/get-selling-products', productController.getSellingProducts)
router.get('/get-new-product', productController.getNewProducts)
router.get('/get-highest-priced-products', productController.getHighestPricedProducts)
router.get('/get-lowest-priced-products', productController.getLowestPricedProducts)
router.get('/get-random-product', productController.getRandomProduct)



module.exports = router