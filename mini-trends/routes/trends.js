const express = require('express');
const router = express.Router();
const passport = require('passport');

// const catchAsync = require('../utils/catchAsync');
const { isAuthorized } = require('../middleware');
const trends = require('../controllers/Ctrend');


// router.route('/')
//     .get(isAuthorized, trends.index)
//     .get(isAuthorized, trends.getTrend);

router.route('/blog')
    .get(isAuthorized, trends.blogIndex)
    // .get(isAuthorized, trends.getTrend);
    // .post(isAuthorized, trends.createProduct);
router.get('/blog/search', isAuthorized, trends.blogSearch);

// 지역 검색
router.get('/local', isAuthorized, trends.localIndex);
router.get('/local/search', isAuthorized, trends.localSearch);

// 데이터랩
router.get('/datalab', isAuthorized, trends.datalabIndex);
router.post('/datalab/search', isAuthorized, trends.datalabSearch);


router.get('/new', isAuthorized, trends.renderNewForm);

// router.route('/:id')
//     .get(isAuthorized, trends.showProduct)
//     .put(isAuthorized, trends.updateProduct)
//     .delete(isAuthorized, trends.deleteProduct);

router.get('/:id/edit', isAuthorized, trends.renderEditForm);

router.post('/:id/update-quantity', isAuthorized, trends.updateTrendQuantity);



module.exports = router;