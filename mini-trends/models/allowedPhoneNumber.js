const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const allowedPhoneNumberSchema = new Schema({
    phonenum: {
        type: String,
        required: true,
        unique: true
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AllowedPhoneNumber', allowedPhoneNumberSchema);