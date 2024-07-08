const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./OrderRouter')
const CommentRouter = require('./CommentRouter')
const PaymentRouter = require('./PaymentRouter')
const SliderRouter = require('./SliderRouter')

// nơi chứa tất cả route của api
const routes = (app) => {
    // sau khi được gọi bởi index.js bên ngoài thì sau đó sẽ link đến trang UserRouter.js
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/comment', CommentRouter)
    app.use('/api/payment', PaymentRouter)
    app.use('/api/slider', SliderRouter)
}

module.exports = routes
