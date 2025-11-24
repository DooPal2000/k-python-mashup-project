const express = require('express');
const router = express.Router();
const passport = require('passport');

const catchAsync = require('../utils/catchAsync');
const { isAuthorized } = require('../middleware');
const trends = require('../controllers/Ctrend');


router.route('/')
    .get(isAuthorized, catchAsync(trends.getTrend))
    .post(isAuthorized, catchAsync(trends.createProduct));

router.get('/new', isAuthorized, trends.renderNewForm);

router.route('/:id')
    .get(isAuthorized, catchAsync(trends.showProduct))
    .put(isAuthorized, catchAsync(trends.updateProduct))
    .delete(isAuthorized, catchAsync(trends.deleteProduct));

router.get('/:id/edit', isAuthorized, catchAsync(trends.renderEditForm));

router.post('/:id/update-quantity', isAuthorized, catchAsync(trends.updateQuantity));



module.exports = router;