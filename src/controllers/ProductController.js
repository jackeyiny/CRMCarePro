const productService = require('../services/ProductService')

// nơi nhận dữ liệu từ client thông qua --req-- rồi đóng gói lại dữ liệu lại rồi chuyển đến --service-- xử lý
// nới chuyển dữ liệu từ server qua client thông qua --res--

// thêm mới Sản phẩm
const createProduct = async (req, res) => {
    try {
        // nhận những dữ liệu dx gửi qua từ phía client
        const { name, type, countInStock, price, rating, description, discount } = req.body
        // const { name, image, type, countInStock, price, rating, description, discount } = req.body

        // hiển thị ra những dữ liệu nhận về bên phía client
        // console.log("req.body", req.body)

        // kiểm tra xem nếu mà nó ko có 1 trong những thằng này
        if(!name || !type || !countInStock || !price || !rating || !discount) {
        // if(!name || !image || !type || !countInStock || !price || !rating || !discount) {
            // trả về 1 thông báo lỗi khi ko nhận dx 1 cái nào đó
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }

        // nhận dữ liệu từ ProductRouter.js sau đó sẽ truyền dữ liệu nhận đx vào ProductService để xử lý
        const response = await productService.createProduct(req.body)
        // sau khi xử lý dữ liệu xong ta chuyển kiểu dữ liệu đã xử lý về --Json-- sau đó trả về
        return res.status(200).json(response)

        
    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            err: e
        })
    }
}

// Update sản phẩm
const updateProduct = async (req, res) => {
    try {
        // nhận id từ url
        const productId = req.params.id
        // dữ liệu gửi lên từ server
        const data = req.body

        // kiểm tra nếu ko lấy dx id
        if(!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The product id is required'
            })
        }
        // in ra để kiểm tra
        // console.log('productId', productId)
        // đóng gói dữ liệu cần update và id lấy từ url gửi qua service
        const response = await productService.updateProduct(productId, data)
        // sau khi xử lý dữ liệu xong ta chuyển kiểu dữ liệu đã xử lý về --Json-- sau đó trả về
        return res.status(200).json(response)


    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}

// lấy thông tin sản phẩm thông qua --_id--
const getDetailsProduct = async (req, res) => {
    try {
        // nhận id từ url
        const productId = req.params.id
        // console.log('productId: ', productId)
        // kiểm tra nếu ko lấy dx id
        if(!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId id is required'
            })
        }
        // đóng gói dữ liệu cần get và id lấy từ url gửi qua service
        const response = await productService.getDetailsProduct(productId)
        // gửi dữ liệu đã xử lý xong đi
        return res.status(200).json(response)


    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}

// xóa sản phẩm
const deleteProduct = async (req, res) => {
    try {
        // nhận id từ url
        const productId = req.params.id
        // console.log('productId: ', productId)
        // kiểm tra nếu ko lấy dx id
        if(!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId id is required'
            })
        }
        // gửi id lấy từ url sang cho service xử lý tiến hành xóa
        const response = await productService.deleteProduct(productId)
        // sau khi xử lý dữ liệu xong ta chuyển kiểu dữ liệu đã xử lý về --Json-- sau đó trả về
        return res.status(200).json(response)


    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}

// xóa nhiều sản phẩm sản phẩm
const deleteProductMany = async (req, res) => {
    try {
        // nhận 1 cái mảng id cần xóa thông qua --req.body--
        const ids = req.body.ids
        // console.log('req.body: ', req.body)
        // kiểm tra nếu ko lấy dx id
        if(!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids id is required'
            })
        }
        // gửi id lấy từ url sang cho service xử lý tiến hành xóa
        const response = await productService.deleteProductMany(ids)
        // sau khi xử lý dữ liệu xong ta chuyển kiểu dữ liệu đã xử lý về --Json-- sau đó trả về
        return res.status(200).json(response)


    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}

// lấy toàn bộ thông tin sản phẩm
const getAllProduct = async (req, res) => {
    try {
        // lấy dữ liệu trên thanh url
        const { limit, page, sort, filter } = req.query
        // console.log('filter', filter)
        // gói tới service
        const response = await productService.getAllProduct(Number(limit) || null, Number(page) || 0, sort, filter)
        // sau khi xử lý dữ liệu xong ta chuyển kiểu dữ liệu đã xử lý về --Json-- sau đó trả về
        return res.status(200).json(response)
    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}
const getAllProductType = async (req, res) => {
    try {
        const response = await productService.getAllProductType()
        // sau khi xử lý dữ liệu xong ta chuyển kiểu dữ liệu đã xử lý về --Json-- sau đó trả về
        return res.status(200).json(response)
    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}


// lấy toàn bộ thông tin sản phẩm
const getAllTypeProduct = async (req, res) => {
    try {
        const response = await productService.getAllTypeProduct()
        return res.status(200).json(response)
    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}


// -----------
const getSellingProducts = async (req, res) => {
    try {
        const response = await productService.getSellingProducts()
        return res.status(200).json(response)
    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}
const getNewProducts = async (req, res) => {
    try {
        const response = await productService.getNewProducts()
        return res.status(200).json(response)
    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}
const getHighestPricedProducts = async (req, res) => {
    try {
        const response = await productService.getHighestPricedProducts()
        return res.status(200).json(response)
    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}
const getLowestPricedProducts = async (req, res) => {
    try {
        const response = await productService.getLowestPricedProducts()
        return res.status(200).json(response)
    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}
const getRandomProduct = async (req, res) => {
    try {
        const response = await productService.getRandomProduct()
        return res.status(200).json(response)
    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteProductMany,
    getAllTypeProduct,
    getSellingProducts,
    getNewProducts, 
    getHighestPricedProducts, 
    getRandomProduct,
    getLowestPricedProducts,
    getAllProductType
}