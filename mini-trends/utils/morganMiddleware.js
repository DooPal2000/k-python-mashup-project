const morgan = require('morgan');
const winston = require('winston');
const path = require('path');

// HTTP 요청/응답 로그를 처리하는 morganMiddleware 전용 Winston 로거입니다.
// 콘솔에 컬러 출력하며, error.log와 combined.log 파일에 분리 저장합니다.
// 시간대는 KST(UTC+9)로 포맷팅되며, 애플리케이션 커스텀 로그용 로거와는 별도로 운영됩니다.

// winston logger 생성 (미리 utils/logger.js에서 만들 수도 있지만 여기서 직접 만들 수도 있음)
const logger = winston.createLogger({
  level: 'debug',
  transports: [
    // 1. 콘솔 전용 포맷
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ level: true }),
        winston.format.timestamp({
          format: () => {
            const date = new Date();
            const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000); // +9시간
            return kst.toISOString().replace('Z', '+09:00');
          }
        }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      )
    }),
    // 2. 파일 전용 포맷
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'warn',
      format: winston.format.combine(
        winston.format.timestamp({
          format: () => {
            const date = new Date();
            const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000); // +9시간
            return kst.toISOString().replace('Z', '+09:00');
          }
        }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
      )
    }),
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: () => {
            const date = new Date();
            const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000); // +9시간
            return kst.toISOString().replace('Z', '+09:00');
          }
        }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
      )
    }),
  ],
});

const morganMiddleware = morgan((tokens, req, res) => {
  const status = Number(tokens.status(req, res));
  const responseTime = parseFloat(tokens['response-time'](req, res)); // ← 여기에 변수 정의

  const log = [
    tokens.method(req, res),
    tokens.url(req, res),
    status,
    tokens['response-time'](req, res), 'ms',
    '-',
    tokens.res(req, res, 'content-length') || '0', 'bytes'
  ].join(' ');

  if (status >= 500) {
    logger.error(log);
  } else if (status >= 400) {
    logger.warn(log);
  } else if (status >= 200 && status < 300) {
    if (responseTime > 1000) {   // 1초 이상 느린 요청은 info
      logger.info(log);
    } else {
      logger.debug(log);          // 1초 이하 요청은 debug
    }
  } else {
    logger.info(log);
  }


  return null; // morgan의 기본 출력 방지
});

module.exports = morganMiddleware;
