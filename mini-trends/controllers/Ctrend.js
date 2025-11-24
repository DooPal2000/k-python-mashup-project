const Trend = require('../models/trend');
const User = require('../models/user');

const ExpressError = require('../utils/ExpressError');
const logger = require('../utils/logger');

const axios = require('axios');
const config = require('../config'); // config 불러오기


module.exports.index = async (req, res) => {
    const trends = await Trend.find({ createdBy: req.user._id });
    res.render('trends/index', { trends });
};

module.exports.getTrend = async (req, res) => {
    const requestBody = {
        startDate: "2025-01-01",
        endDate: "2025-11-24",
        timeUnit: "month",
        keywordGroups: [
            {
                groupName: "구로디지털관리", // 그룹 이름은 임의 지정 가능
                keywords: ["구로디지털단지", "Guro Digital Complex"]
            }
        ],
        device: "pc",      // "pc" 또는 "mo" (모바일)
        ages: ["1", "2", "3", "4", "5", "6", "7"], // 연령대, 1~7
        gender: "f"        // "f", "m", "all"
    };

    const response = await axios.post(
        "https://openapi.naver.com/v1/datalab/search",
        requestBody,
        {
            headers: {
                "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
                "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
                "Content-Type": "application/json"
            }
        }
    );

    logger.info(`getTrend res :: ${response.data}`);
    res.json(response.data);
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
