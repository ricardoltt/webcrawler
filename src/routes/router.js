const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/BrowserController');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const { searchRequestSchema } = require('../utils/ValidationSchemas');

router.get('/', (req, res) => {
  res.send('Hello Asksuite World!');
});

router.post(
  '/search',
  ValidationMiddleware.validateBody(searchRequestSchema),
  SearchController.search
);

module.exports = router;
