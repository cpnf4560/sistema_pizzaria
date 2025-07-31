-- ===== PIZZARIA DO CARLOS - CONFIGURAÇÃO COMPLETA DA BASE DE DADOS =====
-- Execute este script depois de configurar o MySQL na porta 3307

-- 1. Criar base de dados
CREATE DATABASE IF NOT EXISTS pizzaria 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 2. Criar utilizador
CREATE USER IF NOT EXISTS 'pizzaria_user'@'localhost' IDENTIFIED BY 'pizzaria123';
GRANT ALL PRIVILEGES ON pizzaria.* TO 'pizzaria_user'@'localhost';
FLUSH PRIVILEGES;

-- 3. Usar a base de dados
USE pizzaria;

-- 4. Criar tabela de pizzas
CREATE TABLE IF NOT EXISTS pizza (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco_pequena DECIMAL(6,2) NOT NULL,
    preco_media DECIMAL(6,2) NOT NULL,
    preco_grande DECIMAL(6,2) NOT NULL,
    ativa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Criar tabela de clientes  
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telefone VARCHAR(20),
    morada TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- 6. Criar tabela de utilizadores (sistema de login)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    perfil ENUM('Cliente', 'Supervisor') DEFAULT 'Cliente',
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- 7. Criar tabela de encomendas
CREATE TABLE IF NOT EXISTS encomendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    usuario_id INT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo_entrega ENUM('recolha','entrega') NOT NULL DEFAULT 'recolha',
    hora_entrega TIME,
    taxa_entrega DECIMAL(6,2) DEFAULT 0.00,
    observacoes TEXT,
    metodo_pagamento ENUM('entrega', 'mbway', 'multibanco') DEFAULT 'entrega',
    total DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    status ENUM('Pendente','Preparando','Pronto','Entregue','Cancelado') DEFAULT 'Pendente',
    estado VARCHAR(20) DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    INDEX idx_cliente_id (cliente_id),
    INDEX idx_data_hora (data_hora),
    INDEX idx_status (status)
);

-- 8. Criar tabela de pizzas por encomenda
CREATE TABLE IF NOT EXISTS encomenda_pizzas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    encomenda_id INT NOT NULL,
    pizza_id INT NOT NULL,
    tamanho ENUM('Pequena','Média','Grande') NOT NULL,
    preco DECIMAL(6,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (encomenda_id) REFERENCES encomendas(id) ON DELETE CASCADE,
    FOREIGN KEY (pizza_id) REFERENCES pizza(id),
    INDEX idx_encomenda_id (encomenda_id),
    INDEX idx_pizza_id (pizza_id)
);

-- 9. Inserir pizzas de exemplo
INSERT IGNORE INTO pizza (nome, descricao, preco_pequena, preco_media, preco_grande) VALUES
('Margherita', 'Molho de tomate, mozzarella e manjericão fresco', 7.50, 9.50, 12.50),
('Pepperoni', 'Molho de tomate, mozzarella e pepperoni', 8.50, 10.50, 13.50),
('Quatro Queijos', 'Mozzarella, gorgonzola, parmesão e queijo de cabra', 9.00, 11.50, 14.50),
('Hawaiana', 'Molho de tomate, mozzarella, fiambre e ananás', 8.00, 10.00, 13.00),
('Vegetariana', 'Molho de tomate, mozzarella, pimentos, cebola, cogumelos e azeitonas', 8.50, 10.50, 13.50),
('Diavola', 'Molho de tomate, mozzarella, salame picante e pimentos', 9.00, 11.00, 14.00),
('Carbonara', 'Base de natas, mozzarella, bacon, ovo e parmesão', 9.50, 12.00, 15.00),
('Prosciutto', 'Molho de tomate, mozzarella, presunto de Parma e rúcula', 10.00, 12.50, 15.50);

-- 10. Inserir utilizador admin (senha: admin)
INSERT IGNORE INTO usuarios (email, password_hash, nome, perfil) 
VALUES ('admin@pizzaria.com', '$2a$12$4Cy6B7WrxipBVazRpVblsejMkvzU7eBYQplNmfBZnY84lbkxZstJy', 'Administrador', 'Supervisor');

-- ===== CONFIGURAÇÃO COMPLETA! =====
-- Agora pode iniciar o sistema com: ./start.sh
