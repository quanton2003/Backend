const UserRouter = require('./UserRouter');
const ProductRouter = require('./ProductRouter');
const OrderRouter = require('./OrderRouter');
const paymentRouter = require('./paymentRouter');
const routes = (app) => {
app.use('/api/user',UserRouter )
app.use('/api/product',ProductRouter )
app.use('/api/order',OrderRouter )
app.use('/api/paymen',paymentRouter )
}
module.exports = routes