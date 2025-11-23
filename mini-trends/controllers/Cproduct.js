const Product = require('../models/product');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');

module.exports.index = async (req, res) => {
    const products = await Product.find({ createdBy: req.user._id });
    res.render('products/index', { products });
};

module.exports.renderNewForm = (req, res) => {
    res.render('products/new');
};

module.exports.createProduct = async (req, res) => {
    const product = new Product(req.body.product);
    product.createdBy = req.user._id;
    await product.save();

    res.redirect('/products');
};

module.exports.showProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('products/edit', { product });
};

module.exports.renderEditForm = async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('products/edit', { product });
};

module.exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });

    // 저장한 후 createdBy가 req.user._id인 모든 product를 가져옴
    const products = await Product.find({ createdBy: req.user._id });

    res.redirect('/products');
};


module.exports.updateQuantity = async (req, res, next) => {
    const { id } = req.params;
    const { quantity } = req.body;

    // 유효성 검사
    if (typeof quantity !== 'number' || quantity < 0 || !Number.isInteger(quantity)) {
        throw new ExpressError('수량은 0 이상의 정수여야 합니다.', 400);
    }

    const product = await Product.findById(id);
    if (!product) {
        throw new ExpressError('상품을 찾을 수 없습니다.', 404);
    }

    product.quantity = quantity;
    await product.save();

    res.json({ success: true, quantity: product.quantity });
};


module.exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
};

