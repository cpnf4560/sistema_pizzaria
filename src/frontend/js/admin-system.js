// Sistema de Administração - Pizzaria do Carlos
console.log('🔐 Arquivo admin-system.js carregado');

class AdminSystem {
    constructor() {
        this.adminToken = null;
        this.init();
    }

    init() {
        // Event listeners
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
        });
    }

    setupEventListeners() {
        // Verificar se é tentativa de login de admin
        const formLogin = document.getElementById('form-login');
        if (formLogin) {
            formLogin.addEventListener('submit', (e) => {
                this.handlePossibleAdminLogin(e);
            });
        }

        // Botões da página de admin
        const btnRefreshRelatorios = document.getElementById('btn-refresh-relatorios');
        if (btnRefreshRelatorios) {
            btnRefreshRelatorios.addEventListener('click', () => {
                this.carregarRelatorios();
            });
        }

        const btnSairAdmin = document.getElementById('btn-sair-admin');
        if (btnSairAdmin) {
            btnSairAdmin.addEventListener('click', () => {
                this.sairAdmin();
            });
        }
    }

    async handlePossibleAdminLogin(e) {
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        // Verificar se são credenciais de admin
        if (username === 'admin' && password === 'admin') {
            e.preventDefault();
            await this.loginAdmin(username, password);
        }
        // Se não for admin, deixar o sistema normal de login funcionar
    }

    async loginAdmin(username, password) {
        try {
            console.log('🔐 Tentando login de administrador...');
            
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                console.log('✅ Login de admin bem-sucedido');
                this.adminToken = data.token;
                localStorage.setItem('adminToken', data.token);
                this.showAdminPage();
                this.carregarRelatorios();
            } else {
                console.log('❌ Erro no login de admin:', data.message);
                this.showLoginError(data.message);
            }
        } catch (error) {
            console.error('❌ Erro ao fazer login de admin:', error);
            this.showLoginError('Erro de conexão. Verifique se o servidor está ativo.');
        }
    }

    showAdminPage() {
        // Esconder todas as páginas
        document.querySelectorAll('[id^="pagina-"]').forEach(pagina => {
            pagina.classList.add('hidden');
        });

        // Mostrar página de admin
        const paginaAdmin = document.getElementById('pagina-admin');
        if (paginaAdmin) {
            paginaAdmin.classList.remove('hidden');
        }

        // Esconder botões do header que não são necessários
        this.controlHeaderButtons(false);
    }

    async carregarRelatorios() {
        try {
            console.log('📊 Carregando relatórios...');
            
            const token = this.adminToken || localStorage.getItem('adminToken');
            if (!token) {
                console.error('❌ Token de admin não encontrado');
                alert('Token de admin não encontrado. Faça login novamente.');
                return;
            }

            console.log('🔑 Token encontrado:', token.substring(0, 20) + '...');

            const response = await fetch('/api/admin/relatorios', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log('📡 Response status:', response.status);
            console.log('📡 Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Response não ok:', errorText);
                alert('Erro na resposta do servidor: ' + errorText);
                return;
            }

            const data = await response.json();
            console.log('📊 Dados recebidos:', data);

            if (data.success) {
                console.log('✅ Relatórios carregados com sucesso');
                this.renderRelatorios(data.relatorios);
            } else {
                console.error('❌ Erro ao carregar relatórios:', data.message);
                alert('Erro ao carregar relatórios: ' + data.message);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar relatórios:', error);
            console.error('❌ Stack trace:', error.stack);
            alert('Erro de conexão ao carregar relatórios: ' + error.message);
        }
    }

    renderRelatorios(relatorios) {
        // Estatísticas gerais
        const estatisticas = relatorios.estatisticas_gerais;
        if (estatisticas) {
            document.getElementById('total-encomendas').textContent = estatisticas.total_encomendas || '0';
            document.getElementById('total-clientes').textContent = estatisticas.total_clientes || '0';
            document.getElementById('receita-total').textContent = '€' + parseFloat(estatisticas.receita_total || 0).toFixed(2);
            document.getElementById('ticket-medio').textContent = '€' + parseFloat(estatisticas.ticket_medio || 0).toFixed(2);
        }

        // Encomendas por dia
        this.renderTabelaEncomendas(relatorios.encomendas_por_dia || []);

        // Pizzas mais vendidas
        this.renderTabelaPizzas(relatorios.pizzas_mais_vendidas || []);

        // Clientes mais ativos
        this.renderTabelaClientes(relatorios.clientes_mais_ativos || []);
    }

    renderTabelaEncomendas(encomendas) {
        const tbody = document.querySelector('#tabela-encomendas-dia tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        encomendas.forEach(encomenda => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${new Date(encomenda.data).toLocaleDateString('pt-PT')}</td>
                <td>${encomenda.total_encomendas}</td>
                <td>€${parseFloat(encomenda.total_vendas || 0).toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    renderTabelaPizzas(pizzas) {
        const tbody = document.querySelector('#tabela-pizzas-vendidas tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        pizzas.forEach(pizza => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${pizza.nome}</td>
                <td>${pizza.quantidade_vendida}</td>
                <td>€${parseFloat(pizza.total_receita || 0).toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    renderTabelaClientes(clientes) {
        const tbody = document.querySelector('#tabela-clientes-ativos tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.nome}</td>
                <td>${cliente.email}</td>
                <td>${cliente.total_encomendas}</td>
                <td>€${parseFloat(cliente.total_gasto || 0).toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    controlHeaderButtons(show = true) {
        const botoes = document.querySelector('.botoes-secundarios-header');
        if (botoes) {
            botoes.style.display = show ? 'flex' : 'none';
        }
    }

    showLoginError(message) {
        const loginErro = document.getElementById('login-erro');
        if (loginErro) {
            loginErro.textContent = message;
            loginErro.classList.remove('hidden');
            
            setTimeout(() => {
                loginErro.classList.add('hidden');
            }, 5000);
        }
    }

    sairAdmin() {
        // Limpar token
        this.adminToken = null;
        localStorage.removeItem('adminToken');
        
        // Voltar para a página inicial
        this.voltarParaInicial();
        
        console.log('🚪 Saída de admin realizada');
    }

    voltarParaInicial() {
        // Esconder todas as páginas
        document.querySelectorAll('[id^="pagina-"]').forEach(pagina => {
            pagina.classList.add('hidden');
        });

        // Mostrar página inicial
        const paginaInicial = document.getElementById('pagina-inicial');
        if (paginaInicial) {
            paginaInicial.classList.remove('hidden');
        }

        // Restaurar botões do header
        this.controlHeaderButtons(true);
    }
}

// Inicializar sistema de admin
window.adminSystem = new AdminSystem();

console.log('🔐 Sistema de administração inicializado');
