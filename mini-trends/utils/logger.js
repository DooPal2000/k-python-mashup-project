const winston = require('winston');
const path = require('path');
require('winston-daily-rotate-file');

const env = process.env.NODE_ENV || 'development';

const timestampFormat = () => {
  const date = new Date();
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00');
};

const consoleFormat = winston.format.combine(
  winston.format.colorize({ level: true }),
  winston.format.timestamp({ format: timestampFormat }),
  winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: timestampFormat }),
  winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

const transports = [];

// 🔥 DEV 환경
if (env !== 'production') {
  transports.push(
    new winston.transports.Console({
      level: 'debug',
      format: consoleFormat,
    })
  );

  // 일별 파일 로테이션
  transports.push(
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'custom-dev-%DATE%.log',   // 날짜 포함
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,                 // 옵션: .gz 압축
      maxSize: '20m',
      maxFiles: '14d',                     // 최근 14일 보관
      level: 'debug',
      format: fileFormat,
    })
  );
}

// 🔥 PROD 환경
else {
  transports.push(
    new winston.transports.Console({
      level: 'info',
      format: consoleFormat,
    })
  );

  // info 로그 일별 파일
  transports.push(
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'custom-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'info',
      format: fileFormat,
    })
  );

  // error 로그 일별 파일
  transports.push(
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'errors-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: fileFormat,
    })
  );
}

const logger = winston.createLogger({
  level: env === 'production' ? 'info' : 'debug',
  transports,
});

module.exports = logger;
