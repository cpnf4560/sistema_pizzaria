-- Script completo para criar toda a estrutura da base de dados da Pizzaria
-- Execute: mysql -h localhost -P 3307 -u root -p pizzaria < schema_completo.sql

-- Criar tabela de pizzas
CREATE TABLE IF NOT EXISTS pizza (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco_pequena DECIMAL(5,2) NOT NULL,
    preco_media DECIMAL(5,2) NOT NULL,
    preco_grande DECIMAL(5,2) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nome (nome),
    INDEX idx_ativo (ativo)
);

-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    morada TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_nome (nome)
);

-- Criar tabela de encomendas
CREATE TABLE IF NOT EXISTS encomendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    usuario_id INT NULL,
    data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tipo_entrega ENUM('recolha', 'domicilio') NOT NULL DEFAULT 'recolha',
    hora_entrega TIME,
    taxa_entrega DECIMAL(6,2) DEFAULT 0.00,
    observacoes TEXT,
    total DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    status ENUM('Pendente', 'Preparando', 'Pronto', 'Entregue', 'Cancelado') DEFAULT 'Pendente',
    estado VARCHAR(20) DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    INDEX idx_cliente_id (cliente_id),
    INDEX idx_data_hora (data_hora),
    INDEX idx_status (status)
);

-- Criar tabela de itens da encomenda (pizzas por encomenda)
CREATE TABLE IF NOT EXISTS encomenda_pizzas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    encomenda_id INT NOT NULL,
    pizza_id INT NOT NULL,
    tamanho ENUM('Pequena', 'Média', 'Grande') NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    preco_unitario DECIMAL(5,2) NOT NULL,
    subtotal DECIMAL(6,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (encomenda_id) REFERENCES encomendas(id) ON DELETE CASCADE,
    FOREIGN KEY (pizza_id) REFERENCES pizza(id) ON DELETE CASCADE,
    INDEX idx_encomenda_id (encomenda_id),
    INDEX idx_pizza_id (pizza_id)
);

-- Criar tabela de usuários (se não existir)
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

-- Inserir pizzas de exemplo
INSERT IGNORE INTO pizza (nome, descricao, preco_pequena, preco_media, preco_grande) VALUES
('Margherita', 'Queijo mozzarella, tomate, manjericão fresco', 5.50, 7.00, 8.50),
('Pepperoni', 'Queijo mozzarella, tomate, pepperoni', 6.00, 8.00, 9.50),
('Quatro Queijos', 'Mozzarella, gorgonzola, parmesão, queijo flamengo', 6.50, 8.50, 10.00),
('Vegetariana', 'Mozzarella, tomate, pimentos, cebola, milho, cogumelos', 6.00, 8.00, 9.50),
('Hawaiana', 'Mozzarella, tomate, fiambre, ananás', 6.50, 8.50, 10.00),
('Suprema', 'Mozzarella, tomate, pepperoni, cogumelos, pimentos, cebola', 7.00, 9.00, 11.00),
('Calzone', 'Pizza fechada com ricotta, mozzarella e fiambre', 7.50, 9.50, 11.50),
('Carbonara', 'Mozzarella, bacon, ovo, natas, parmesão', 7.00, 9.00, 11.00);

-- Inserir usuário supervisor padrão (senha: admin123)
-- Hash gerado com bcrypt: $2a$12$4Cy6B7WrxipBVazRpVblsejMkvzU7eBYQplNmfBZnY84lbkxZstJy
INSERT IGNORE INTO usuarios (email, password_hash, nome, perfil) 
VALUES ('admin@pizzaria.com', '$2a$12$4Cy6B7WrxipBVazRpVblsejMkvzU7eBYQplNmfBZnY84lbkxZstJy', 'Administrador', 'Supervisor');

-- Inserir cliente de exemplo
INSERT IGNORE INTO clientes (nome, email, telefone, morada) 
VALUES ('Cliente Teste', 'cliente@exemplo.com', '+351 912345678', 'Rua de Exemplo, 123, Lisboa');

-- Verificar estrutura criada
SELECT 'Tabelas criadas com sucesso!' as status;
SELECT COUNT(*) as total_pizzas FROM pizza;
SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_clientes FROM clientes;
