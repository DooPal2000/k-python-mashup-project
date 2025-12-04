// const winston = require('winston');
// const path = require('path');

// // 비즈니스 로직 및 커스텀 이벤트 기록 전용 Winston 로거입니다.
// // morganMiddleware 로그와 겹치지 않도록 custom.log 등 별도 파일에 기록합니다.
// // 시간대 포맷과 로그 레벨은 morganMiddleware 로거와 일관되게 유지하는 것을 권장합니다.

// const timestampFormat = () => {
//   const date = new Date();
//   const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000); // KST (+9시간)
//   return kst.toISOString().replace('Z', '+09:00');
// };

// const logger = winston.createLogger({
//   level: 'debug',
//   format: winston.format.combine(
//     winston.format.timestamp({ format: timestampFormat }),
//     winston.format.printf(({ level, message, timestamp }) => {
//       return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
//     })
//   ),
//   transports: [
//     new winston.transports.Console({
//       format: winston.format.combine(
//         winston.format.colorize({ level: true }),
//         winston.format.timestamp({ format: timestampFormat }),
//         winston.format.printf(({ level, message, timestamp }) => {
//           return `[${timestamp}] ${level}: ${message}`;
//         })
//       )
//     }),
//     new winston.transports.File({
//       filename: path.join('logs', 'custom.log'), // combined.log와 겹치지 않게 별도 파일 지정
//       level: 'info', // 필요에 따라 조절 가능
//       format: winston.format.combine(
//         winston.format.timestamp({ format: timestampFormat }),
//         winston.format.printf(({ level, message, timestamp }) => {
//           return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
//         })
//       )
//     }),
//   ],
// });

// module.exports = logger;
