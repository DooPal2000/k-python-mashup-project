const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./utils/logger');
async function connectToDatabase() {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log(`DB 연결 성공 `);
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  }
}

module.exports = { connectToDatabase };
