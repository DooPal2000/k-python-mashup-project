const fs = require('fs');

function loadEnvironment() {
  if (process.env.NODE_ENV === 'production') {
    return process.env;

    // return {
    //   MONGODB_URI: process.env.MONGODB_URI,
    //   ADMIN_NUMBERS: process.env.ADMIN_NUMBERS,
    //   SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
    // };

  } else {
    require('dotenv').config({ path: './.env' });
    return process.env;
  }
}

const env = loadEnvironment();

const config = {
  mongodb: {
    uri: env.MONGODB_URI
  },
  admin: {
    numbers: JSON.parse(env.ADMIN_NUMBERS || '{}')
  },
  session: {
    secretKey: env.SESSION_SECRET_KEY
  },
  naver: {
    clientId: env.NAVER_CLIENT_ID,
    clientSecret: env.NAVER_CLIENT_SECRET
  }

};

module.exports = config;
