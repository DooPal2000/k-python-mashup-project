const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trendSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  popularity: {
    type: Number,
    default: 0,
    min: 0
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

// timestamps 옵션을 사용하면 createdAt, updatedAt이 자동 생성됨
// 만약 timestamps:true 사용하면 위 createdAt은 생략 가능
// trendSchema.set('timestamps', true);

module.exports = mongoose.model('Trend', trendSchema);
