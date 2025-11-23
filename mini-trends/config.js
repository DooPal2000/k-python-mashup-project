const fs = require('fs');

// function loadProductionSecrets() {
//   return {
//     MONGODB_URI: fs.readFileSync('/run/secrets/mongodb_uri', 'utf8').trim(),
//     ADMIN_NUMBERS: fs.readFileSync('/run/secrets/admin_numbers', 'utf8').trim(),
//     SESSION_SECRET_KEY: fs.readFileSync('/run/secrets/session_secret_key', 'utf8').trim(),
//   };
// }

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
  }
};

module.exports = config;
