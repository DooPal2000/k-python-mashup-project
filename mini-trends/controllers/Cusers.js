const Product = require('../models/product');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');
const logger = require('../utils/logger');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};
module.exports.renderRegisterAdmin = (req, res) => {
    res.render('users/registerAdmin');
};

module.exports.register = async (req, res) => {
    const { phonenum, password } = req.body;
    //await User.deleteMany({ username: username });

    const user = new User({
        phonenum,
        isActive: false,
    });
    const registerUser = await User.register(user, password);
    res.redirect('/');
};

module.exports.registerAdmin = async (req, res) => {
    const { phonenum, password } = req.body;

    const user = new User({
        phonenum,
        role: 'admin' // role을 'admin'으로 설정
    });

    const registerUser = await User.register(user, password);
    req.login(registerUser, err => {
        if (err) return next(err);
        res.redirect('/admin-dashboard'); // 관리자 대시보드로 리다이렉트
    });
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    let redirectUrl = res.locals.returnTo || '/home';
    logger.info(`Attempt Login...  ${req.user}`);
    // console.log(req.user);
    // 사용자 역할이 'admin'인 경우 관리자 페이지로 리다이렉트
    if (req.user && req.user.role === 'admin') {
        redirectUrl = '/admin-dashboard'; // 관리자 대시보드 URL
    }

    delete req.session.returnTo;
    res.redirect(redirectUrl);
};


module.exports.logout = (req, res, next) => {

    req.logout(function (err) {

        if (err) {

            return next(err);

        }


        res.redirect('/');

    });
}

module.exports.renderProduct = async (req, res) => {
    const currentUser = req.user;
    const products = await Product.find({ createdBy: currentUser._id });
Product
    res.render('products/product', { products: products });
}