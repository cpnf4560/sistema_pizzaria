const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { validateCliente } = require('../middleware/validation');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Rota para cliente ver seu próprio perfil
router.get('/me', 
  authenticateToken, 
  requireRole('Cliente'), 
  clienteController.getMyProfile
);

// Supervisores podem ver todos os clientes
router.get('/', 
  authenticateToken, 
  requireRole('Supervisor'), 
  clienteController.getAllClientes
);

router.get('/:id', 
  authenticateToken, 
  requireRole('Supervisor'), 
  clienteController.getClienteById
);

// Criação de cliente público (para formulário web)
router.post('/', 
  validateCliente, 
  clienteController.createCliente
);

// Qualquer usuário autenticado pode criar cliente (para casos especiais)
router.post('/auth', 
  authenticateToken, 
  validateCliente, 
  clienteController.createCliente
);

// Cliente pode atualizar seus próprios dados, supervisor pode atualizar qualquer um
router.put('/:id', 
  authenticateToken, 
  requireRole(['Cliente', 'Supervisor']), 
  validateCliente, 
  clienteController.updateCliente
);

// Apenas supervisores podem excluir clientes
router.delete('/:id', 
  authenticateToken, 
  requireRole('Supervisor'), 
  clienteController.deleteCliente
);

module.exports = router;