const orderService = require('../services/orderService')

// nơi nhận dữ liệu từ client thông qua --req-- rồi đóng gói lại dữ liệu lại rồi chuyển đến --service-- xử lý
// nới chuyển dữ liệu từ server qua client thông qua --res--

// thêm mới Sản phẩm
const createOrder = async (req, res) => {
    try {
        // console.log('req.body', req.body)
        
        // nhận những dữ liệu dx gửi qua từ phía client
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, email } = req.body

        // hiển thị ra những dữ liệu nhận về bên phía client
        // console.log("req.body", req.body);

        // kiểm tra xem nếu mà nó ko có 1 trong những thằng này
        // if(!paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !fullName || !address || !city || !phone || !email) {
        if(!paymentMethod || !itemsPrice || !fullName || !address || !city || !phone || !email) {
            // trả về 1 thông báo lỗi khi ko nhận dx 1 cái nào đó
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required order'
            })
        }

        
        // nhận dữ liệu từ ProductRouter.js sau đó sẽ truyền dữ liệu nhận đx vào ProductService để xử lý
        const response = await orderService.createOrder(req.body)
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
const UpdateOrder = async (req, res) => {
    try {
        // nhận id từ url
        const orderId = req.params.id
        // dữ liệu gửi lên từ server
        const data = req.body

        // kiểm tra nếu ko lấy dx id
        if(!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The product id is required'
            })
        }
        // in ra để kiểm tra
        // console.log('productId', productId)
        // đóng gói dữ liệu cần update và id lấy từ url gửi qua service
        const response = await orderService.UpdateOrder(orderId, data)
        // sau khi xử lý dữ liệu xong ta chuyển kiểu dữ liệu đã xử lý về --Json-- sau đó trả về
        return res.status(200).json(response)


    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}
const UpdateOrderApp = async (req, res) => {
    try {
        // nhận id từ url
        const orderId = req.params.id
        // dữ liệu gửi lên từ server
        const DeliveryStatus = req.query.DeliveryStatus

        // kiểm tra nếu ko lấy dx id
        if(!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The product id is required'
            })
        }
        // in ra để kiểm tra
        // console.log('productId', productId)
        // đóng gói dữ liệu cần update và id lấy từ url gửi qua service
        const response = await orderService.UpdateOrderApp(orderId, DeliveryStatus)
        // sau khi xử lý dữ liệu xong ta chuyển kiểu dữ liệu đã xử lý về --Json-- sau đó trả về
        return res.status(200).json(response)


    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}
const UpdateOrderApp1 = async (req, res) => {
    try {
        // nhận id từ url
        const orderId = req.params.id
        // dữ liệu gửi lên từ server
        const cancellationStatus = req.query.cancellationStatus

        // kiểm tra nếu ko lấy dx id
        if(!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The product id is required'
            })
        }
        // in ra để kiểm tra
        // console.log('productId', productId)
        // đóng gói dữ liệu cần update và id lấy từ url gửi qua service
        const response = await orderService.UpdateOrderApp1(orderId, cancellationStatus)
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
const getAllOrderDetail = async (req, res) => {
    try {
        // nhận id từ url
        const userId = req.params.id
        // console.log('productId: ', userId)
        // kiểm tra nếu ko lấy dx id
        if(!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId id is required'
            })
        }
        // đóng gói dữ liệu cần get và id lấy từ url gửi qua service
        const response = await orderService.getAllOrderDetail(userId)
        // gửi dữ liệu đã xử lý xong đi
        return res.status(200).json(response)


    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}
const getAllOrderDetailApp = async (req, res) => {
    try {
        // nhận id từ url
        const userId = req.params.id
        const type = req.query.type
        // kiểm tra nếu ko lấy dx id
        
        if(!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId id is required'
            })
        }
        // đóng gói dữ liệu cần get và id lấy từ url gửi qua service
        const response = await orderService.getAllOrderDetailApp(userId, type)
        // gửi dữ liệu đã xử lý xong đi
        return res.status(200).json(response)


    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}


// lấy thông tin sản phẩm thông qua --_id--
const getDetailsOrder = async (req, res) => {
    try {
        // nhận id từ url
        const userId = req.params.id
        // console.log('userId: ', userId)
        // kiểm tra nếu ko lấy dx id
        if(!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId id is required'
            })
        }
        // đóng gói dữ liệu cần get và id lấy từ url gửi qua service
        const response = await orderService.getDetailsOrder(userId)
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
const cancelOrderDetails = async (req, res) => {
    try {
        // nhận id từ url
        const orderId = req.params.id
        // console.log('121212  : ', orderId)
        // kiểm tra nếu ko lấy dx id
        if(!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId id is required'
            })
        }
        // gửi id lấy từ url sang cho service xử lý tiến hành xóa
        const response = await orderService.cancelOrderDetails(orderId)
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
const getAllOrder = async (req, res) => {
    try {
        // gói tới service
        const response = await orderService.getAllOrder()
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


module.exports = {
    createOrder,
    getAllOrderDetail,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder,
    UpdateOrder,
    getAllOrderDetailApp,
    UpdateOrderApp,
    UpdateOrderApp1
}