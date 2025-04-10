// src/index.js
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const qs = require('qs');
const crypto = require('crypto');
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Gọi routes sau khi middleware đã được đăng ký
routes(app);

mongoose.connect(process.env.MONGOO_DB)
  .then(() => {
    console.log('Connect DB success!');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
