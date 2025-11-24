const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    phonenum: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
// userSchema.plugin(passportLocalMongoose, {usernameField: 'phonenum' });

// passport-local-mongoose 플러그인 옵션 설정
userSchema.plugin(passportLocalMongoose, {
    usernameField: 'phonenum',
    // Mongoose 7+ 에서는 Promise 기반으로 작동
    errorMessages: {
        UserExistsError: '이미 등록된 전화번호입니다.'
    }
});

module.exports = mongoose.model("User", userSchema);

