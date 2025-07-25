const express = require('express');
const router = express.Router();
const pizzaController = require('../controllers/pizzaController');
const { validatePizza } = require('../middleware/validation');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Rotas públicas - qualquer um pode ver as pizzas
router.get('/', pizzaController.getAllPizzas);
router.get('/:id', pizzaController.getPizzaById);

// Rotas protegidas - apenas supervisores podem gerenciar pizzas
router.post('/', 
  authenticateToken, 
  requireRole('Supervisor'), 
  validatePizza, 
  pizzaController.createPizza
);

router.put('/:id', 
  authenticateToken, 
  requireRole('Supervisor'), 
  validatePizza, 
  pizzaController.updatePizza
);

router.delete('/:id', 
  authenticateToken, 
  requireRole('Supervisor'), 
  pizzaController.deletePizza
);

module.exports = router;