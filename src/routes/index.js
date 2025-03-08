const UserRouter = require('./UserRouter');
const ProductRouter = require('./productRouter');
const routes = (app) => {
app.use('/api/user',UserRouter )
app.use('/api/product',ProductRouter )
}
module.exports = routes