const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array()
    });
  }
  next();
};

const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Email deve ter formato válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),
  body('nome')
    .isLength({ min: 2 })
    .withMessage('Nome deve ter no mínimo 2 caracteres')
    .trim(),
  body('perfil')
    .optional()
    .isIn(['Cliente', 'Supervisor'])
    .withMessage('Perfil deve ser Cliente ou Supervisor'),
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email deve ter formato válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
  handleValidationErrors
];

const validatePizza = [
  body('nome')
    .isLength({ min: 2 })
    .withMessage('Nome deve ter no mínimo 2 caracteres')
    .trim(),
  body('descricao')
    .isLength({ min: 5 })
    .withMessage('Descrição deve ter no mínimo 5 caracteres')
    .trim(),
  body('preco_pequena')
    .isFloat({ min: 0 })
    .withMessage('Preço pequena deve ser um número positivo'),
  body('preco_media')
    .isFloat({ min: 0 })
    .withMessage('Preço média deve ser um número positivo'),
  body('preco_grande')
    .isFloat({ min: 0 })
    .withMessage('Preço grande deve ser um número positivo'),
  handleValidationErrors
];

const validateCliente = [
  body('nome')
    .isLength({ min: 2 })
    .withMessage('Nome deve ter no mínimo 2 caracteres')
    .trim(),
  body('morada')
    .isLength({ min: 5 })
    .withMessage('Morada deve ter no mínimo 5 caracteres')
    .trim(),
  body('telefone')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Telefone deve conter apenas números e símbolos válidos')
    .isLength({ min: 9 })
    .withMessage('Telefone deve ter no mínimo 9 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Email deve ter formato válido')
    .normalizeEmail(),
  handleValidationErrors
];

const validateEncomenda = [
  body('cliente_id')
    .isInt({ min: 1 })
    .withMessage('ID do cliente deve ser um número válido'),
  body('tipo_entrega')
    .isIn(['recolha', 'domicilio'])
    .withMessage('Tipo de entrega deve ser recolha ou domicilio'),
  body('hora_entrega')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Hora deve estar no formato HH:MM'),
  body('observacoes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Observações devem ter no máximo 500 caracteres')
    .trim(),
  body('pizzas')
    .isArray({ min: 1 })
    .withMessage('Deve haver pelo menos uma pizza na encomenda'),
  body('pizzas.*.pizza_id')
    .isInt({ min: 1 })
    .withMessage('ID da pizza deve ser um número válido'),
  body('pizzas.*.tamanho')
    .isIn(['Pequena', 'Média', 'Grande'])
    .withMessage('Tamanho deve ser Pequena, Média ou Grande'),
  body('pizzas.*.quantidade')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser um número positivo'),
  body('pizzas.*.preco_unitario')
    .isFloat({ min: 0 })
    .withMessage('Preço unitário deve ser um número positivo'),
  handleValidationErrors
];

const validateUpdateStatus = [
  body('status')
    .isIn(['Pendente', 'Preparando', 'Pronto', 'Entregue', 'Cancelado'])
    .withMessage('Status deve ser: Pendente, Preparando, Pronto, Entregue ou Cancelado'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validatePizza,
  validateCliente,
  validateEncomenda,
  validateUpdateStatus,
  handleValidationErrors
};