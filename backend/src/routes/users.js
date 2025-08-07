const express = require('express');
const router = express.Router();
const utilizadorController = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Todas as rotas de usuários são apenas para supervisores
router.use(authenticateToken);
router.use(requireRole('Supervisor'));

// Listar todos os usuários
router.get('/', utilizadorController.getAllUsers);

// Estatísticas de usuários
router.get('/stats', utilizadorController.getUserStats);

// Ver usuário específico
router.get('/:id', utilizadorController.getUserById);

// Atualizar status do usuário (ativar/desativar)
router.patch('/:id/status', utilizadorController.updateUserStatus);

// "Excluir" usuário (na verdade desativa)
router.delete('/:id', utilizadorController.deleteUser);

module.exports = router;