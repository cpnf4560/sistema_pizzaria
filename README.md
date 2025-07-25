# Sistema de Encomendas da Pizzaria 🍕

Sistema completo de gestão de encomendas para pizzaria, desenvolvido com frontend HTML/JavaScript e backend Node.js/Express com base de dados MySQL.

## 🚀 Funcionalidades

- ✅ Interface web para criar encomendas
- ✅ Gestão de clientes
- ✅ Menu de pizzas dinâmico
- ✅ Cálculo automático de preços e taxa de entrega
- ✅ Geração de ficheiros .txt com detalhes da encomenda
- ✅ Base de dados MySQL para persistência
- ✅ API REST completa
- ✅ Botão Demo para testes rápidos

## 🛠️ Tecnologias Utilizadas

**Frontend:**
- HTML5, CSS3, JavaScript vanilla
- Interface responsiva
- Sistema de carrinho de compras

**Backend:**
- Node.js com Express
- MySQL como base de dados
- JWT para autenticação
- CORS habilitado
- Validação de dados

**Base de Dados:**
- MySQL
- Tabelas: pizzas, clientes, encomendas, encomenda_pizzas, usuarios

## 📁 Estrutura do Projeto

```
Pizzaria/
├── src/frontend/          # Frontend HTML/JS
│   ├── index.html
│   └── app.js
├── backend/               # Backend Node.js
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   ├── package.json
│   └── schema_completo.sql
├── build/                 # Ficheiros compilados Java
└── README.md
```

## 🔧 Instalação e Configuração

### 1. Pré-requisitos
- Node.js (v14 ou superior)
- MySQL (v8 ou superior)
- Python 3 (para servidor de desenvolvimento do frontend)

### 2. Clonar o repositório
```bash
git clone https://github.com/cpnf4560/PizzariaJava.git
cd PizzariaJava
```

### 3. Configurar a base de dados
```bash
# Criar base de dados
mysql -u root -p -e "CREATE DATABASE pizzaria;"

# Importar schema
mysql -u root -p pizzaria < backend/schema_completo.sql
```

### 4. Configurar backend
```bash
cd backend
npm install

# Criar ficheiro .env
cat > .env << EOF
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=
DB_NAME=pizzaria
JWT_SECRET=pizzaria_secret_key_2024
PORT=3000
EOF
```

### 5. Iniciar os serviços

**Backend (Terminal 1):**
```bash
cd backend
node src/app.js
```

**Frontend (Terminal 2):**
```bash
cd src/frontend
python3 -m http.server 8080
```

## 🌐 Acesso

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3000
- **Documentação API:** http://localhost:3000/api/docs

## 📊 Endpoints da API

### Pizzas
- `GET /api/pizzas` - Listar todas as pizzas

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Criar cliente
- `GET /api/clientes/:id` - Obter cliente por ID

### Encomendas
- `GET /api/encomendas` - Listar encomendas
- `POST /api/encomendas` - Criar encomenda
- `GET /api/encomendas/:id` - Obter encomenda por ID
- `PUT /api/encomendas/:id/status` - Actualizar status

## 🎯 Como Usar

1. **Aceder ao frontend:** http://localhost:8080
2. **Preencher dados do cliente** ou usar o botão "Demo"
3. **Escolher pizzas** do menu
4. **Selecionar tipo de entrega** (recolha/domicílio)
5. **Finalizar encomenda**
6. **Ficheiro .txt** é gerado automaticamente com os detalhes

## 🔍 Funcionalidades Detalhadas

### Frontend
- Formulário de cliente com validação
- Menu de pizzas carregado dinamicamente
- Carrinho de compras interactivo
- Cálculo automático de totais
- Geração de ficheiros .txt
- Interface responsiva

### Backend
- API RESTful completa
- Autenticação JWT (opcional)
- Validação de dados
- Gestão de transações MySQL
- Logs detalhados
- Middleware de CORS

### Base de Dados
- Schema completo com relacionamentos
- Dados de exemplo incluídos
- Índices para performance
- Constraints de integridade

## 🧪 Testes

O sistema inclui dados de exemplo e um botão Demo para testes rápidos:

- **Pizzas:** 6 variedades com preços por tamanho
- **Cliente demo:** Dados pré-preenchidos
- **Encomendas:** Histórico de testes

## 🐛 Resolução de Problemas

### Erro de conexão à base de dados
```bash
# Verificar se MySQL está a correr
sudo systemctl status mysql

# Verificar porta
sudo netstat -tlnp | grep 3306
```

### Frontend não carrega pizzas
```bash
# Verificar se backend está a correr
curl http://localhost:3000/api/pizzas
```

### Problemas de CORS
- Verificar se o backend tem CORS habilitado
- Confirmar URLs correctos no frontend

## 📝 Desenvolvimento

O projeto foi desenvolvido de forma modular:

- **Separação clara** entre frontend e backend
- **API RESTful** bem estruturada
- **Base de dados normalizada**
- **Código limpo e documentado**

## 📄 Licença

Este projeto é de código aberto para fins educacionais.

## 👨‍💻 Autor

Desenvolvido como projeto de aprendizagem em desenvolvimento web full-stack.

---

**Status:** ✅ Funcional  
**Última actualização:** Julho 2025
