-- ===== PIZZARIA DO CARLOS - SCHEMA PARA COCKROACHDB/POSTGRESQL =====
-- NOTA: Não criar base de dados nem utilizadores aqui, só as tabelas e dados.

-- 1. Criar tabela de pizzas
CREATE TABLE IF NOT EXISTS pizza (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco_pequena DECIMAL(6,2) NOT NULL,
    preco_media DECIMAL(6,2) NOT NULL,
    preco_grande DECIMAL(6,2) NOT NULL,
    ativa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Criar tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telefone VARCHAR(20),
    morada TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Criar tabela de utilizadores (sistema de login)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) DEFAULT 'Cliente' CHECK (perfil IN ('Cliente', 'Supervisor')),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Criar tabela de encomendas
CREATE TABLE IF NOT EXISTS encomendas (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL REFERENCES clientes(id),
    usuario_id INT REFERENCES usuarios(id),
    data_hora TIMESTAMPTZ DEFAULT now(),
    tipo_entrega VARCHAR(10) NOT NULL DEFAULT 'recolha' CHECK (tipo_entrega IN ('recolha','entrega')),
    hora_entrega TIME,
    taxa_entrega DECIMAL(6,2) DEFAULT 0.00,
    observacoes TEXT,
    metodo_pagamento VARCHAR(15) DEFAULT 'entrega' CHECK (metodo_pagamento IN ('entrega', 'mbway', 'multibanco')),
    total DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(15) DEFAULT 'Pendente' CHECK (status IN ('Pendente','Preparando','Pronto','Entregue','Cancelado')),
    estado VARCHAR(20) DEFAULT 'pendente',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Criar tabela de pizzas por encomenda
CREATE TABLE IF NOT EXISTS encomenda_pizzas (
    id SERIAL PRIMARY KEY,
    encomenda_id INT NOT NULL REFERENCES encomendas(id) ON DELETE CASCADE,
    pizza_id INT NOT NULL REFERENCES pizza(id),
    tamanho VARCHAR(10) NOT NULL CHECK (tamanho IN ('Pequena','Média','Grande')),
    preco DECIMAL(6,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Inserir pizzas de exemplo
INSERT INTO pizza (nome, descricao, preco_pequena, preco_media, preco_grande)
VALUES
('Margherita', 'Molho de tomate, mozzarella e manjericão fresco', 7.50, 9.50, 12.50),
('Pepperoni', 'Molho de tomate, mozzarella e pepperoni', 8.50, 10.50, 13.50),
('Quatro Queijos', 'Mozzarella, gorgonzola, parmesão e queijo de cabra', 9.00, 11.50, 14.50),
('Hawaiana', 'Molho de tomate, mozzarella, fiambre e ananás', 8.00, 10.00, 13.00),
('Vegetariana', 'Molho de tomate, mozzarella, pimentos, cebola, cogumelos e azeitonas', 8.50, 10.50, 13.50),
('Diavola', 'Molho de tomate, mozzarella, salame picante e pimentos', 9.00, 11.00, 14.00),
('Carbonara', 'Base de natas, mozzarella, bacon, ovo e parmesão', 9.50, 12.00, 15.00),
('Prosciutto', 'Molho de tomate, mozzarella, presunto de Parma e rúcula', 10.00, 12.50, 15.50)
ON CONFLICT DO NOTHING;

-- 7. Inserir utilizador admin (senha: admin)
INSERT INTO usuarios (email, password_hash, nome, perfil)
VALUES ('admin@pizzaria.com', '$2a$12$4Cy6B7WrxipBVazRpVblsejMkvzU7eBYQplNmfBZnY84lbkxZstJy', 'Administrador', 'Supervisor')
ON CONFLICT DO NOTHING;

-- ===== SCHEMA ADAPTADO PARA COCKROACHDB/POSTGRESQL =====
