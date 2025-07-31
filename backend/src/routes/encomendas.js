const express = require('express');
const router = express.Router();
const encomendaController = require('../controllers/encomendaController');
const { validateEncomenda, validateEncomendaWeb, validateUpdateStatus } = require('../middleware/validation');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Rota para cliente ver suas próprias encomendas
router.get('/me', 
  authenticateToken, 
  requireRole('Cliente'), 
  encomendaController.getMyEncomendas
);

// Listar encomendas (clientes veem só as suas, supervisores veem todas)
router.get('/', 
  authenticateToken, 
  requireRole(['Cliente', 'Supervisor']), 
  encomendaController.getAllEncomendas
);

// Ver detalhes de uma encomenda específica
router.get('/:id', 
  authenticateToken, 
  requireRole(['Cliente', 'Supervisor']), 
  encomendaController.getEncomendaById
);

// Criar nova encomenda pública (para formulário web)
router.post('/', 
  validateEncomendaWeb, 
  encomendaController.createEncomenda
);

// Rota de teste para encomenda sem validações (APENAS PARA DEBUG)
router.post('/test', 
  encomendaController.createEncomendaTest
);

// Criar nova encomenda autenticada (clientes para si, supervisores para qualquer cliente)
router.post('/auth', 
  authenticateToken, 
  requireRole(['Cliente', 'Supervisor']), 
  validateEncomenda, 
  encomendaController.createEncomenda
);

// Atualizar status da encomenda (apenas supervisores)
router.patch('/:id/status', 
  authenticateToken, 
  requireRole('Supervisor'), 
  validateUpdateStatus, 
  encomendaController.updateStatus
);

module.exports = router;