const express = require('express');
const router = express.Router();
const { loginAdmin, getRelatorios } = require('../controllers/adminController');

// Rota de login para administrador
router.post('/login', loginAdmin);

// Rota para obter relatórios (protegida)
router.get('/relatorios', (req, res, next) => {
    // Verificar token JWT
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token de acesso requerido'
        });
    }
    
    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pizzaria_secret_key');
        
        // Verificar se é admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado. Apenas administradores.'
            });
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
}, getRelatorios);

module.exports = router;
