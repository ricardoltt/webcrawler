require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./src/routes/router.js');
const LoggerMiddleware = require('./src/middlewares/LoggerMiddleware.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(LoggerMiddleware.logRequest);

const port = process.env.PORT || 8080;

app.use('/', router);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
