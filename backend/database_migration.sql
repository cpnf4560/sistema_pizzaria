-- Script de migração para adicionar tabela de usuários
-- Execute este script no banco de dados 'pizzaria'

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    perfil ENUM('Cliente', 'Supervisor') DEFAULT 'Cliente',
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_perfil (perfil),
    INDEX idx_ativo (ativo)
);

-- Adicionar coluna status às encomendas se não existir
ALTER TABLE encomendas ADD status ENUM('Pendente', 'Preparando', 'Pronto', 'Entregue', 'Cancelado') DEFAULT 'Pendente';

-- Verificar se as tabelas existem e criar índices se necessário
-- Índices para melhorar performance das consultas

-- Índices na tabela clientes
ALTER TABLE clientes 
ADD INDEX IF NOT EXISTS idx_email (email),
ADD INDEX IF NOT EXISTS idx_nome (nome);

-- Índices na tabela encomendas
ALTER TABLE encomendas 
ADD INDEX IF NOT EXISTS idx_cliente_id (cliente_id),
ADD INDEX IF NOT EXISTS idx_data_hora (data_hora),
ADD INDEX IF NOT EXISTS idx_status (status);

-- Índices na tabela encomenda_pizzas
ALTER TABLE encomenda_pizzas 
ADD INDEX IF NOT EXISTS idx_encomenda_id (encomenda_id),
ADD INDEX IF NOT EXISTS idx_pizza_id (pizza_id);

-- Índices na tabela pizza
ALTER TABLE pizza 
ADD INDEX IF NOT EXISTS idx_nome (nome);

-- Inserir usuário supervisor padrão (senha: admin123)
-- Hash gerado: $2a$12$4Cy6B7WrxipBVazRpVblsejMkvzU7eBYQplNmfBZnY84lbkxZstJy
INSERT IGNORE INTO usuarios (email, password_hash, nome, perfil) 
VALUES ('admin@pizzaria.com', '$2a$12$4Cy6B7WrxipBVazRpVblsejMkvzU7eBYQplNmfBZnY84lbkxZstJy', 'Administrador', 'Supervisor');

-- Verificar estrutura das tabelas existentes
SHOW TABLES;
DESCRIBE usuarios;
DESCRIBE encomendas;