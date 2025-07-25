require('dotenv').config();

const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  saltRounds: 12
};

module.exports = authConfig;