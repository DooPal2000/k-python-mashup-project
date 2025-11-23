// utils/sanitize.js

// Mongo 연산자(키가 $로 시작)나 . 포함된 키를 제거/치환하는 재귀 함수
function sanitizeObject(obj, options = {}) {
  if (!obj || typeof obj !== 'object') return;

  const { replaceWith = null } = options;

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    // 키가 $로 시작하면 제거하거나 치환
    if (key.startsWith('$')) {
      if (replaceWith === null) {
        // 완전히 삭제
        delete obj[key];
      } else {
        // 다른 이름으로 치환
        const newKey = replaceWith + key.slice(1);
        obj[newKey] = value;
        delete obj[key];
      }
      continue;
    }

    // 키에 . 이 들어가면 마찬가지로 제거/치환
    if (key.includes('.')) {
      if (replaceWith === null) {
        delete obj[key];
      } else {
        const newKey = key.replace(/\./g, replaceWith);
        obj[newKey] = value;
        delete obj[key];
      }
      continue;
    }

    // 값이 객체면 재귀 처리
    if (typeof value === 'object' && value !== null) {
      sanitizeObject(value, options);
    }
  }
}

function sanitizeMiddleware(options = {}) {
  return function (req, res, next) {
    // req.body / req.query / req.params 안쪽만 mutate
    sanitizeObject(req.body, options);
    sanitizeObject(req.query, options);
    sanitizeObject(req.params, options);
    next();
  };
}

module.exports = { sanitizeMiddleware };
