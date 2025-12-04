// morganMiddleware.js
const morgan = require('morgan');
const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const env = process.env.NODE_ENV || 'development';

const timestampFormat = () => {
  const date = new Date();
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00');
};

// Console format (human friendly)
const consoleFormat = winston.format.combine(
  winston.format.colorize({ level: true }),
  winston.format.timestamp({ format: timestampFormat }),
  winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

// File format (upper-case level)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: timestampFormat }),
  winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

// build transports for access logger depending on env
const transports = [];

// dev: more verbose (debug), keep recent logs for shorter 기간
if (env !== 'production') {
  transports.push(
    new winston.transports.Console({
      level: 'debug',
      format: consoleFormat,
    })
  );

  transports.push(
    new winston.transports.DailyRotateFile({
      dirname: path.join('logs', 'access'),
      filename: 'access-dev-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'debug',
      format: fileFormat,
    })
  );
} else {
  // production: do not emit debug-level HTTP access logs to avoid noise
  transports.push(
    new winston.transports.Console({
      level: 'info',
      format: consoleFormat,
    })
  );

  transports.push(
    new winston.transports.DailyRotateFile({
      dirname: path.join('logs', 'access'),
      filename: 'access-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '50m',
      maxFiles: '30d',
      level: 'info',
      format: fileFormat,
    })
  );

  // optionally keep separate errors file for access-level 5xx
  transports.push(
    new winston.transports.DailyRotateFile({
      dirname: path.join('logs', 'access'),
      filename: 'access-errors-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '90d',
      level: 'error',
      format: fileFormat,
    })
  );
}

const accessLogger = winston.createLogger({
  level: env === 'production' ? 'info' : 'debug',
  transports,
});

// morgan custom token handler — uses accessLogger with env-aware level logic
const morganMiddleware = morgan((tokens, req, res) => {
  // tokens.status or tokens['response-time'] might be undefined in rare cases; handle safely
  const statusRaw = tokens.status ? tokens.status(req, res) : undefined;
  const status = statusRaw ? Number(statusRaw) : 0;

  // response-time returns string (ms) or '-' — parseFloat fallback to 0
  const rtRaw = tokens['response-time'] ? tokens['response-time'](req, res) : undefined;
  const responseTime = rtRaw && !isNaN(parseFloat(rtRaw)) ? parseFloat(rtRaw) : 0;

  const contentLength = tokens.res(req, res, 'content-length') || '0';

  const msg = [
    tokens.method(req, res),
    tokens.url(req, res),
    status || '-',
    (rtRaw || '0') + ' ms',
    '-',
    contentLength, 'bytes'
  ].join(' ');

  // Decide level depending on env and status/responseTime
  let level = 'info';

  if (status >= 500) {
    level = 'error';
  } else if (status >= 400) {
    level = 'warn';
  } else if (status >= 300 && status < 400) {
    // redirects: keep info in both envs
    level = 'info';
  } else if (status >= 200 && status < 300) {
    if (env === 'production') {
      // in prod: keep successful responses at info to avoid missing key metrics
      level = 'info';
    } else {
      // in dev: be verbose — slow requests should be visible at info, fast at debug
      level = responseTime > 1000 ? 'info' : 'debug';
    }
  } else {
    // other codes
    level = 'info';
  }

  accessLogger.log({ level, message: msg });

  return null; // suppress morgan's default output
});

module.exports = morganMiddleware;









// const morgan = require('morgan');
// const winston = require('winston');
// const path = require('path');

// // HTTP 요청/응답 로그를 처리하는 morganMiddleware 전용 Winston 로거입니다.
// // 콘솔에 컬러 출력하며, error.log와 combined.log 파일에 분리 저장합니다.
// // 시간대는 KST(UTC+9)로 포맷팅되며, 애플리케이션 커스텀 로그용 로거와는 별도로 운영됩니다.

// // winston logger 생성 (미리 utils/logger.js에서 만들 수도 있지만 여기서 직접 만들 수도 있음)
// const logger = winston.createLogger({
//   level: 'debug',
//   transports: [
//     // 1. 콘솔 전용 포맷
//     new winston.transports.Console({
//       format: winston.format.combine(
//         winston.format.colorize({ level: true }),
//         winston.format.timestamp({
//           format: () => {
//             const date = new Date();
//             const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000); // +9시간
//             return kst.toISOString().replace('Z', '+09:00');
//           }
//         }),
//         winston.format.printf(({ level, message, timestamp }) => {
//           return `[${timestamp}] ${level}: ${message}`;
//         })
//       )
//     }),
//     // 2. 파일 전용 포맷
//     new winston.transports.File({
//       filename: path.join('logs', 'error.log'),
//       level: 'warn',
//       format: winston.format.combine(
//         winston.format.timestamp({
//           format: () => {
//             const date = new Date();
//             const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000); // +9시간
//             return kst.toISOString().replace('Z', '+09:00');
//           }
//         }),
//         winston.format.printf(({ level, message, timestamp }) => {
//           return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
//         })
//       )
//     }),
//     new winston.transports.File({
//       filename: path.join('logs', 'combined.log'),
//       level: 'info',
//       format: winston.format.combine(
//         winston.format.timestamp({
//           format: () => {
//             const date = new Date();
//             const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000); // +9시간
//             return kst.toISOString().replace('Z', '+09:00');
//           }
//         }),
//         winston.format.printf(({ level, message, timestamp }) => {
//           return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
//         })
//       )
//     }),
//   ],
// });

// const morganMiddleware = morgan((tokens, req, res) => {
//   const status = Number(tokens.status(req, res));
//   const responseTime = parseFloat(tokens['response-time'](req, res)); // ← 여기에 변수 정의

//   const log = [
//     tokens.method(req, res),
//     tokens.url(req, res),
//     status,
//     tokens['response-time'](req, res), 'ms',
//     '-',
//     tokens.res(req, res, 'content-length') || '0', 'bytes'
//   ].join(' ');

//   if (status >= 500) {
//     logger.error(log);
//   } else if (status >= 400) {
//     logger.warn(log);
//   } else if (status >= 200 && status < 300) {
//     if (responseTime > 1000) {   // 1초 이상 느린 요청은 info
//       logger.info(log);
//     } else {
//       logger.info(log);          // 1초 이하 요청은 debug
//     }
//   } else {
//     logger.info(log);
//   }


//   return null; // morgan의 기본 출력 방지
// });

// module.exports = morganMiddleware;
