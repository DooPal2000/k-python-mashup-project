const Trend = require('../models/trend');
const User = require('../models/user');

const ExpressError = require('../utils/ExpressError');
const logger = require('../utils/logger');

const axios = require('axios');
const config = require('../config'); // config 불러오기
const client_id = config.naver.clientId;
const client_secret = config.naver.clientSecret;

// 블로그 검색 페이지
module.exports.blogIndex = async (req, res) => {
    const trends = await Trend.find({ createdBy: req.user._id });
    res.render('trends/blog-index', { trends });
};

// 블로그 검색 API
module.exports.blogSearch = async (req, res) => {
    const { query, display = 20, sort = 'sim' } = req.query;

    if (!query) {
        return res.status(400).json({
            error: true,
            message: '검색어를 입력해주세요.'
        });
    }

    const api_url = `https://openapi.naver.com/v1/search/blog?query=${encodeURI(query)}&display=${display}&sort=${sort}`;

    try {
        const response = await axios.get(api_url, {
            headers: {
                "X-Naver-Client-Id": client_id,
                "X-Naver-Client-Secret": client_secret,
            }
        });

        // // 성공 로그
        // logger.info(
        //     `✅ 네이버 API 검색 성공 | 검색어: "${query}" | 결과: ${response.data.items?.length || 0
        //     }/${response.data.total || 0}건 | 상세결과: ${JSON.stringify(response.data, null, 2)}`
        // );
        // 성공 로그
        logger.debug(
            `✅ 네이버 API 검색 성공 | 검색어: "${query}" | 결과: ${response.data.items?.length || 0
            }/${response.data.total || 0}건 | 상세결과: ${JSON.stringify(response.data, null, 2)}`
        );

        res.json(response.data);
    } catch (error) {
        logger.error(`❌ 네이버 API 오류 | 검색어: "${query}" | 상태: ${statusCode} | 내용: ${errorMessage}`);
        throw new ExpressError('검색 중 오류 발생', error.response?.status || 500);

        // res.status(error.response?.status || 500).json({
        //     error: true,
        //     message: '검색 중 오류가 발생했습니다.'
        // });
    }
};


// 지역 검색 페이지
module.exports.localIndex = (req, res) => {
    res.render('trends/local-index');
};

// 지역 검색 API
module.exports.localSearch = async (req, res) => {
    const { query, display = 5, sort = 'random' } = req.query;

    if (!query) {
        return res.status(400).json({
            error: true,
            message: '검색어를 입력해주세요.'
        });
    }

    const api_url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURI(query)}&display=${display}&sort=${sort}`;

    logger.info(`지역 검색 시작 - 검색어: "${query}"`);

    try {
        const response = await axios.get(api_url, {
            headers: {
                "X-Naver-Client-Id": client_id,
                "X-Naver-Client-Secret": client_secret,
            }
        });

        logger.info(`✅ 지역 검색 성공 | 검색어: "${query}" | 결과: ${response.data.items?.length || 0}건`);
        res.json(response.data);
    } catch (error) {
        logger.error(`❌ 지역 API 오류 | 검색어: "${query}" | ${error.message}`);
        res.status(error.response?.status || 500).json({
            error: true,
            message: '검색 중 오류가 발생했습니다.'
        });
    }
};

// 데이터랩 페이지
module.exports.datalabIndex = (req, res) => {
    res.render('trends/datalab-index');
};

// 데이터랩 검색 API
module.exports.datalabSearch = async (req, res) => {
    const requestBody = req.body;
    logger.info(` 데이터랩 분석 | req.body: ${JSON.stringify(requestBody, null, 2)}`);

    if (!requestBody.keywordGroups || requestBody.keywordGroups.length === 0) {
        return res.status(400).json({
            error: true,
            message: '키워드 그룹을 입력해주세요.'
        });
    }

    const api_url = 'https://openapi.naver.com/v1/datalab/search';

    logger.info(`데이터랩 분석 | 그룹 수: ${requestBody.keywordGroups.length}`);

    try {
        const response = await axios.post(api_url, requestBody, {
            headers: {
                "X-Naver-Client-Id": client_id,
                "X-Naver-Client-Secret": client_secret,
                "Content-Type": "application/json"
            }
        });

        logger.info(`✅ 데이터랩 분석 성공 | 결과: ${response.data.results?.length || 0}개 그룹`);
        res.json(response.data);
    } catch (error) {
        logger.error(`❌ 데이터랩 API 오류 | ${error.response?.data?.errorMessage || error.message}`);
        res.status(error.response?.status || 500).json({
            error: true,
            message: error.response?.data?.errorMessage || '데이터 분석 중 오류가 발생했습니다.'
        });
    }
};


module.exports.renderNewForm = (req, res) => {
    res.render('trends/new');
};

module.exports.createTrend = async (req, res) => {
    const trend = new Trend(req.body.trend);
    trend.createdBy = req.user._id;
    await trend.save();

    res.redirect('/trends');
};

module.exports.showTrend = async (req, res) => {
    const trend = await Trend.findById(req.params.id);
    if (!trend) {
        throw new ExpressError('트렌드를 찾을 수 없습니다.', 404);
    }
    res.render('trends/show', { trend });
};

module.exports.renderEditForm = async (req, res) => {
    const trend = await Trend.findById(req.params.id);
    if (!trend) {
        throw new ExpressError('트렌드를 찾을 수 없습니다.', 404);
    }
    res.render('trends/edit', { trend });
};

module.exports.updateTrend = async (req, res) => {
    const { id } = req.params;
    await Trend.findByIdAndUpdate(id, { ...req.body.trend });

    // 저장한 후 현재 사용자의 모든 트렌드를 가져옴
    const trends = await Trend.find({ createdBy: req.user._id });

    res.redirect('/trends');
};

module.exports.updateTrendQuantity = async (req, res, next) => {
    const { id } = req.params;
    const { quantity } = req.body;

    // 유효성 검사
    if (typeof quantity !== 'number' || quantity < 0 || !Number.isInteger(quantity)) {
        throw new ExpressError('수량은 0 이상의 정수여야 합니다.', 400);
    }

    const trend = await Trend.findById(id);
    if (!trend) {
        throw new ExpressError('트렌드를 찾을 수 없습니다.', 404);
    }

    trend.quantity = quantity;
    await trend.save();

    res.json({ success: true, quantity: trend.quantity });
};

module.exports.deleteTrend = async (req, res) => {
    const { id } = req.params;
    await Trend.findByIdAndDelete(id);
    res.redirect('/trends');
};
