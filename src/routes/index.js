const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./OrderRouter')
const CommentRouter = require('./CommentRouter')
const PaymentRouter = require('./PaymentRouter')
const SliderRouter = require('./SliderRouter')

// const jwt = require('jsonwebtoken')

// nơi chứa tất cả route của api
const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/comment', CommentRouter)
    app.use('/api/payment', PaymentRouter)
    app.use('/api/slider', SliderRouter)
}

module.exports = routes
