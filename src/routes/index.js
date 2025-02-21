const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const CustomerRouter = require('./CustomerRouter')
const AdminRouter = require('./AdminResponseRouter')
// nơi chứa tất cả route của api
const routes = (app) => {
    app.use('/api/user', UserRouter),
    app.use('/api/product', ProductRouter),
    app.use('/api/customer', CustomerRouter),
    app.use('/api/admin', AdminRouter)

}

module.exports = routes
