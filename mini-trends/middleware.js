const { user } = require('./models/user.js');
const ExpressError = require('./utils/ExpressError.js');
const logger = require('./utils/logger');

module.exports.isLoggedIn = (req, res, next) => {
    logger.info(`Req User : ${req.user}`);

    if (!req.isAuthenticated()) {
        // req.session.returnTo = req.originalUrl;
        req.flash('error', '로그인 해 주세요.')
        return res.redirect('/login');
    }
    next();
}

module.exports.isRealPhone = (req, res, next) => {
    logger.debug(`isRealPhone 요청: ${req.body} ${req.url}`);

    // 전화번호에서 '-' 제거
    let phoneNumber = req.body.phonenum.replace(/-/g, '');


    // 전화번호 유효성 검사
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!req.body.phonenum || !phoneRegex.test(phoneNumber)) {
        req.flash('error', '유효한 전화번호를 입력해 주세요.');
        return res.redirect('/register');  // 혹은 원하는 페이지로 리디렉션
    }

    req.body.phonenum = phoneNumber;
    next();
};


module.exports.isAuthorized = (req, res, next) => {
    if (!req.isAuthenticated() || !req.user.isActive) {
        req.flash('error', '활성화된 고객님이 아닙니다. 관리자에게 문의해 주세요.');
        return res.redirect('/');
    }
    next();
};


module.exports.isAdmin = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
        req.flash('error', '관리자가 아닙니다.');
        return res.redirect('/login');
    }
    next();
};

module.exports.isSecureAdminCreation = (req, res, next) => {
    const userPhoneNumber = req.body.phonenum;
    const adminNumbers = JSON.parse(process.env.ADMIN_NUMBERS);

    if (!Object.values(adminNumbers).includes(userPhoneNumber)) {
        req.flash('error', '관리자 계정 생성이 불가합니다.');
        return res.redirect('/unauthorized');
    }
    next();
};
