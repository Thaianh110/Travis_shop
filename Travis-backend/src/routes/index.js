const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./OrderRouter')
const PaymentRouter = require('./PaymentRouter')
const BookingRouter = require('./BookingRouter')
const EvaluteRouter = require('./EvaluteRouter')


const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/payment', PaymentRouter)
    app.use('/api/booking',BookingRouter)
    app.use('/api/evalute',EvaluteRouter)
}

module.exports = routes