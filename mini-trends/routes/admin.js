const express = require('express');
const router = express.Router();
const passport = require('passport');

// const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isSecureAdminCreation, isAdmin } = require('../middleware');
const admin = require('../controllers/Cadmin');


router.get('/', isAdmin, admin.renderAdmin);

// 사용자 활성화 상태 토글
router.patch('/toggle-active/:userId', isAdmin, admin.toggleUserActive);

// 사용자 삭제
router.delete('/delete-user/:userId', isAdmin, admin.deleteUser);


module.exports = router;