const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Todas as rotas de usuários são apenas para supervisores
router.use(authenticateToken);
router.use(requireRole('Supervisor'));

// Listar todos os usuários
router.get('/', userController.getAllUsers);

// Estatísticas de usuários
router.get('/stats', userController.getUserStats);

// Ver usuário específico
router.get('/:id', userController.getUserById);

// Atualizar status do usuário (ativar/desativar)
router.patch('/:id/status', userController.updateUserStatus);

// "Excluir" usuário (na verdade desativa)
router.delete('/:id', userController.deleteUser);

module.exports = router;