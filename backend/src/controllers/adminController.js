const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Login de administrador
const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        console.log('📋 Tentativa de login admin:', username);
        
        // Verificar credenciais fixas para admin
        if (username === 'admin' && password === 'admin') {
            // Gerar token JWT para admin
            const token = jwt.sign(
                { 
                    id: 'admin', 
                    username: 'admin',
                    role: 'admin'
                },
                process.env.JWT_SECRET || 'pizzaria_secret_key',
                { expiresIn: '24h' }
            );
            
            console.log('✅ Login admin bem-sucedido');
            
            res.json({
                success: true,
                token: token,
                user: {
                    id: 'admin',
                    username: 'admin',
                    role: 'admin'
                }
            });
        } else {
            console.log('❌ Credenciais admin inválidas');
            res.status(401).json({
                success: false,
                message: 'Credenciais de administrador inválidas'
            });
        }
    } catch (error) {
        console.error('❌ Erro no login admin:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Obter relatórios
const getRelatorios = async (req, res) => {
    try {
        console.log('📊 Gerando relatórios...');
        
        // Relatório de encomendas por período
        const encomendaQuery = `
            SELECT 
                DATE(e.data_hora) as data,
                COUNT(DISTINCT e.id) as total_encomendas,
                COALESCE(SUM(order_totals.total_encomenda), 0) as total_vendas
            FROM encomendas e 
            LEFT JOIN (
                SELECT 
                    ep.encomenda_id,
                    SUM(ep.preco) + MAX(e2.taxa_entrega) as total_encomenda
                FROM encomenda_pizzas ep
                JOIN encomendas e2 ON ep.encomenda_id = e2.id
                GROUP BY ep.encomenda_id
            ) order_totals ON e.id = order_totals.encomenda_id
            WHERE e.data_hora >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(e.data_hora)
            ORDER BY data DESC
            LIMIT 10
        `;
        
        // Relatório de pizzas mais vendidas
        const pizzasQuery = `
            SELECT 
                p.nome,
                COUNT(ep.pizza_id) as quantidade_vendida,
                SUM(ep.preco) as total_receita
            FROM encomenda_pizzas ep
            JOIN pizza p ON ep.pizza_id = p.id
            JOIN encomendas e ON ep.encomenda_id = e.id
            WHERE e.data_hora >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY p.id, p.nome
            ORDER BY quantidade_vendida DESC
            LIMIT 10
        `;
        
        // Relatório de clientes mais ativos
        const clientesQuery = `
            SELECT 
                c.email,
                MAX(c.nome) as nome,
                COUNT(DISTINCT e.id) as total_encomendas,
                COALESCE(SUM(order_totals.total_encomenda), 0) as total_gasto
            FROM clientes c
            JOIN encomendas e ON c.id = e.cliente_id
            LEFT JOIN (
                SELECT 
                    ep.encomenda_id,
                    SUM(ep.preco) + MAX(e2.taxa_entrega) as total_encomenda
                FROM encomenda_pizzas ep
                JOIN encomendas e2 ON ep.encomenda_id = e2.id
                GROUP BY ep.encomenda_id
            ) order_totals ON e.id = order_totals.encomenda_id
            WHERE e.data_hora >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY c.email
            ORDER BY total_encomendas DESC
            LIMIT 10
        `;
        
        // Estatísticas gerais
        const estatisticasQuery = `
            SELECT 
                COUNT(DISTINCT e.id) as total_encomendas,
                COUNT(DISTINCT c.email) as total_clientes,
                COALESCE(SUM(order_totals.total_encomenda), 0) as receita_total,
                COALESCE(AVG(order_totals.total_encomenda), 0) as ticket_medio
            FROM encomendas e
            LEFT JOIN clientes c ON e.cliente_id = c.id
            LEFT JOIN (
                SELECT 
                    ep.encomenda_id,
                    SUM(ep.preco) + MAX(e2.taxa_entrega) as total_encomenda
                FROM encomenda_pizzas ep
                JOIN encomendas e2 ON ep.encomenda_id = e2.id
                GROUP BY ep.encomenda_id
            ) order_totals ON e.id = order_totals.encomenda_id
            WHERE e.data_hora >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `;
        
        // Executar queries
        const encomendasResult = await pool.query(encomendaQuery);
        const pizzasResult = await pool.query(pizzasQuery);
        const clientesResult = await pool.query(clientesQuery);
        const estatisticasResult = await pool.query(estatisticasQuery);

        const encomendas = encomendasResult.rows || encomendasResult[0] || [];
        const pizzas = pizzasResult.rows || pizzasResult[0] || [];
        const clientes = clientesResult.rows || clientesResult[0] || [];
        const estatisticas = estatisticasResult.rows || estatisticasResult[0] || [];
        
        console.log('✅ Relatórios gerados com sucesso');
        
        res.json({
            success: true,
            relatorios: {
                encomendas_por_dia: encomendas,
                pizzas_mais_vendidas: pizzas,
                clientes_mais_ativos: clientes,
                estatisticas_gerais: estatisticas[0] || {}
            }
        });
        
    } catch (error) {
        console.error('❌ Erro ao gerar relatórios:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao gerar relatórios: ' + error.message
        });
    }
};

module.exports = {
    loginAdmin,
    getRelatorios
};
