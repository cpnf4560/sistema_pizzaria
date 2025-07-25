const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Rotas públicas
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Rotas protegidas
router.post('/logout', authController.logout);
router.get('/me', authenticateToken, authController.me);
router.post('/refresh', authenticateToken, authController.refreshToken);

module.exports = router;