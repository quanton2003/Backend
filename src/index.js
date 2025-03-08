const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

// ✅ Middleware phải đặt trước routes
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Hỗ trợ dữ liệu từ form

// Gọi routes sau khi middleware đã được đăng ký
routes(app);

mongoose.connect(`${process.env.MONGOO_DB}`)
  .then(() => {
    console.log('Connect DB success!');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log('Server is running on port: ' + port);
});
