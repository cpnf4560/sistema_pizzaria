// Sistema de Login - Pizzaria do Carlos UFCD 10790
console.log('🔧 Arquivo login-system.js carregado');

class LoginSystem {
    constructor() {
        this.API_BASE = 'http://localhost:3000/api';
        this.currentUser = null;
        this.token = localStorage.getItem('pizzaria_token');
        
        console.log('🔧 LoginSystem inicializado');
        console.log('🔧 API_BASE:', this.API_BASE);
        console.log('🔧 Frontend Port: 8080');
        console.log('🔧 Backend Port: 3000');
        console.log('🔧 Token encontrado:', this.token ? 'SIM' : 'NÃO');
        
        this.initEventListeners();
        this.checkExistingLogin();
    }

    initEventListeners() {
        console.log('🔧 Inicializando event listeners...');
        
        // Botões da página inicial
        const btnLogin = document.getElementById('btn-login');
        const btnRegistar = document.getElementById('btn-registar');
        const btnDemo = document.getElementById('btn-demo');
        const btnIdioma = document.getElementById('btn-idioma');
        const btnSairApp = document.getElementById('btn-sair-app');
        
        if (btnLogin) {
            btnLogin.addEventListener('click', () => {
                console.log('🔐 Botão Login clicado');
                this.showLoginPage();
            });
        }
        
        if (btnRegistar) {
            btnRegistar.addEventListener('click', () => {
                console.log('📝 Botão Registar clicado');
                this.showRegisterPage();
            });
        }
        
        if (btnDemo) {
            btnDemo.addEventListener('click', () => {
                console.log('🍕 Botão Demo clicado');
                this.showDemoPage();
            });
        }
        
        if (btnIdioma) {
            btnIdioma.addEventListener('click', () => {
                console.log('🌍 Botão Idioma clicado');
                if (typeof translator !== 'undefined') {
                    translator.translate();
                } else {
                    console.log('❌ Sistema de tradução não encontrado');
                }
            });
        }
        
        if (btnSairApp) {
            btnSairApp.addEventListener('click', () => {
                console.log('❌ Botão Sair clicado');
                this.confirmExit();
            });
        }

        // Formulário de login
        const formLogin = document.getElementById('form-login');
        if (formLogin) {
            formLogin.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        const btnVoltarInicial = document.getElementById('btn-voltar-inicial');
        if (btnVoltarInicial) {
            btnVoltarInicial.addEventListener('click', () => this.showInitialPage());
        }

        // Formulário de registo
        const formRegisto = document.getElementById('form-registo');
        if (formRegisto) {
            formRegisto.addEventListener('submit', (e) => this.handleRegister(e));
        }
        
        const btnVoltarInicialReg = document.getElementById('btn-voltar-inicial-reg');
        if (btnVoltarInicialReg) {
            btnVoltarInicialReg.addEventListener('click', () => this.showInitialPage());
        }

        // Página de boas-vindas
        const btnFazerEncomenda = document.getElementById('btn-fazer-encomenda');
        if (btnFazerEncomenda) {
            btnFazerEncomenda.addEventListener('click', () => this.showClientPage());
        }
        
        const btnLogout = document.getElementById('btn-logout');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => this.logout());
        }
        
        // Botão ver histórico
        const btnVerHistorico = document.getElementById('btn-ver-historico');
        if (btnVerHistorico) {
            btnVerHistorico.addEventListener('click', () => this.showHistoryPage());
        }
        
        // Botão voltar das boas-vindas
        const btnVoltarBoasvindas = document.getElementById('btn-voltar-boasvindas');
        if (btnVoltarBoasvindas) {
            btnVoltarBoasvindas.addEventListener('click', () => this.showWelcomePage());
        }
        
        // Botão preencher dados do utilizador
        const btnPreencherDados = document.getElementById('btn-preencher-dados');
        if (btnPreencherDados) {
            btnPreencherDados.addEventListener('click', () => this.fillUserData());
        }
        
        // Botão ver histórico
        const btnHistorico = document.getElementById('btn-historico');
        if (btnHistorico) {
            btnHistorico.addEventListener('click', () => this.showHistoryPage());
        }
        
        // Botão voltar da página demo/cliente
        const btnVoltarDemo = document.getElementById('btn-voltar-demo');
        if (btnVoltarDemo) {
            btnVoltarDemo.addEventListener('click', () => this.showInitialPage());
        }
        
        console.log('✅ Event listeners inicializados');
    }

    async checkExistingLogin() {
        console.log('🔍 Verificando login existente...');
        
        if (this.token) {
            try {
                const response = await fetch(`${this.API_BASE}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    this.currentUser = data.data.user;
                    console.log('✅ Login automático:', this.currentUser.nome);
                    this.showWelcomePage();
                } else {
                    console.log('❌ Token inválido, removendo...');
                    localStorage.removeItem('pizzaria_token');
                    this.token = null;
                    this.showInitialPage();
                }
            } catch (error) {
                console.error('❌ Erro ao verificar login:', error);
                this.showInitialPage();
            }
        } else {
            console.log('📄 Nenhum token encontrado, mostrando página inicial');
            this.showInitialPage();
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        console.log('🔐 Processando login...');
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            this.showLoginError('Email/Username e password são obrigatórios');
            return;
        }

        try {
            console.log('🔐 Enviando credenciais para:', username);
            console.log('🔐 Tipo de login:', username.includes('@') ? 'EMAIL' : 'USERNAME');
            
            const response = await fetch(`${this.API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: username, password })
            });

            const data = await response.json();
            console.log('📡 Resposta do servidor:', data);
            
            if (response.ok && data.success) {
                console.log('✅ Login bem-sucedido:', data.data.user.nome);
                
                this.currentUser = data.data.user;
                this.token = data.data.token;
                localStorage.setItem('pizzaria_token', this.token);
                
                this.hideLoginError();
                this.showWelcomePage();
            } else {
                console.log('❌ Login falhado:', data.message);
                this.showLoginError(data.message || 'Credenciais inválidas');
            }
        } catch (error) {
            console.error('❌ Erro na conexão:', error);
            console.error('❌ Tipo de erro:', error.name);
            console.error('❌ Mensagem do erro:', error.message);
            
            if (error instanceof TypeError && error.message.includes('fetch')) {
                this.showLoginError('Erro de rede. Verifique se o servidor backend está ativo na porta 3000.');
            } else if (error.name === 'SyntaxError') {
                this.showLoginError('Erro na resposta do servidor. Dados inválidos recebidos.');
            } else {
                this.showLoginError(`Erro de conexão: ${error.message}`);
            }
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        console.log('📝 Processando registo...');
        
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;
        const name = document.getElementById('reg-name').value.trim();
        const morada = document.getElementById('reg-morada').value.trim();
        const telefone = document.getElementById('reg-telefone').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        
        console.log('📝 Dados capturados:', { username, password: '***', name, morada, telefone, email });
        
        if (!username || !password || !name || !morada || !telefone || !email) {
            this.showRegisterError('Todos os campos são obrigatórios');
            return;
        }

        if (password.length < 6) {
            this.showRegisterError('Password deve ter pelo menos 6 caracteres');
            return;
        }

        // Validar formato do telefone
        const telefonePattern = /^\+351 \d{9}$/;
        if (!telefonePattern.test(telefone)) {
            this.showRegisterError('Formato do telefone inválido. Use: +351 XXXXXXXXX');
            return;
        }

        try {
            console.log('📝 Enviando dados de registo para:', username);
            console.log('🌐 URL da API:', `${this.API_BASE}/auth/register`);
            
            const response = await fetch(`${this.API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email, 
                    password, 
                    nome: name, 
                    perfil: 'Cliente' 
                })
            });

            console.log('📡 Status da resposta:', response.status);
            const data = await response.json();
            console.log('📡 Resposta do registo:', data);
            
            if (response.ok && data.success) {
                console.log('✅ Registo bem-sucedido:', data.data.user.nome);
                
                this.hideRegisterError();
                this.showRegisterSuccess('Registo realizado com sucesso! Pode fazer login agora.');
                
                // Limpar formulário
                document.getElementById('form-registo').reset();
                // Repor valor padrão do telefone
                document.getElementById('reg-telefone').value = '+351 ';
                
                // Voltar para login após 2 segundos
                setTimeout(() => {
                    this.showLoginPage();
                }, 2000);
            } else {
                console.log('❌ Registo falhado:', data.message);
                this.showRegisterError(data.message || 'Erro no registo');
            }
        } catch (error) {
            console.error('❌ Erro na conexão:', error);
            console.error('❌ Tipo de erro:', error.name);
            console.error('❌ Mensagem do erro:', error.message);
            
            if (error instanceof TypeError && error.message.includes('fetch')) {
                this.showRegisterError('Erro de rede. Verifique se o servidor backend está ativo na porta 3000.');
            } else if (error.name === 'SyntaxError') {
                this.showRegisterError('Erro na resposta do servidor. Dados inválidos recebidos.');
            } else {
                this.showRegisterError(`Erro de conexão: ${error.message}`);
            }
        }
    }

    logout() {
        console.log('🔓 Fazendo logout');
        
        this.currentUser = null;
        this.token = null;
        localStorage.removeItem('pizzaria_token');
        
        // Limpar conteúdo do histórico ao fazer logout
        this.clearHistoryContent();
        
        this.showInitialPage();
    }

    confirmExit() {
        const message = 'Deseja mesmo sair?';
        if (confirm(message)) {
            window.close();
        }
    }

    // Métodos para mostrar páginas
    showInitialPage() {
        console.log('📄 Mostrando página inicial');
        this.hideAllPages();
        
        // Limpar conteúdo do histórico quando voltar à página inicial
        this.clearHistoryContent();
        
        const pagina = document.getElementById('pagina-inicial');
        if (pagina) {
            pagina.classList.remove('hidden');
        }
        
        // Mostrar botões do header na página inicial
        this.controlHeaderButtons(true);
    }

    showLoginPage() {
        console.log('🔐 Mostrando página de login');
        this.hideAllPages();
        const pagina = document.getElementById('pagina-login');
        if (pagina) {
            pagina.classList.remove('hidden');
            const usernameInput = document.getElementById('username');
            if (usernameInput) {
                usernameInput.focus();
            }
        }
        this.hideLoginError();
        
        // Mostrar botões do header na página de login
        this.controlHeaderButtons(true);
    }

    showRegisterPage() {
        console.log('📝 Mostrando página de registo');
        this.hideAllPages();
        const pagina = document.getElementById('pagina-registo');
        if (pagina) {
            pagina.classList.remove('hidden');
            const usernameInput = document.getElementById('reg-username');
            if (usernameInput) {
                usernameInput.focus();
            }
        }
        this.hideRegisterError();
        this.hideRegisterSuccess();
        
        // Mostrar botões do header na página de registo
        this.controlHeaderButtons(true);
    }

    showWelcomePage() {
        console.log('👋 Mostrando página de boas-vindas');
        this.hideAllPages();
        
        // Limpar conteúdo do histórico quando sair da página
        this.clearHistoryContent();
        
        const pagina = document.getElementById('pagina-boasvindas');
        if (pagina) {
            pagina.classList.remove('hidden');
        }
        
        const nomeElement = document.getElementById('nome-utilizador');
        if (nomeElement && this.currentUser) {
            nomeElement.textContent = `Olá, ${this.currentUser.nome}!`;
        }
        
        // Mostrar botões do header na página de boas-vindas
        this.controlHeaderButtons(true);
    }

    showDemoPage() {
        console.log('🍕 Mostrando página de demo');
        
        const paginaAtual = document.querySelector('main > div:not(.hidden)');
        const paginaDestino = document.getElementById('pagina-cliente');
        
        if (window.animationUtils) {
            window.animationUtils.animatePageTransition(paginaAtual, paginaDestino, () => {
                this.fillDemoData();
                if (window.animationUtils) {
                    window.animationUtils.animateFormFields(paginaDestino);
                }
            });
        } else {
            this.hideAllPages();
            if (paginaDestino) {
                paginaDestino.classList.remove('hidden');
            }
            this.fillDemoData();
        }
        
        // Mostrar botões do header na página de dados do cliente
        this.controlHeaderButtons(true);
    }
    
    fillDemoData() {
        // Preencher com dados demo
        const campos = {
            'nome': 'Cliente Demo',
            'morada': 'Rua Demo, 123',
            'telefone': '+351 912345678',
            'email': 'demo@pizzaria.com'
        };
        
        Object.entries(campos).forEach(([id, valor]) => {
            const campo = document.getElementById(id);
            if (campo) {
                campo.value = valor;
            }
        });
    }

    showClientPage() {
        console.log('👤 Mostrando página de cliente');
        this.hideAllPages();
        const pagina = document.getElementById('pagina-cliente');
        if (pagina) {
            pagina.classList.remove('hidden');
        }
        
        // Se o utilizador está logado, mostrar botão para preencher dados
        const btnPreencherDados = document.getElementById('btn-preencher-dados');
        if (this.currentUser && this.token && btnPreencherDados) {
            btnPreencherDados.classList.remove('hidden');
            btnPreencherDados.style.display = 'inline-block';
            console.log('✅ Botão "Usar Meus Dados" ativado');
        } else if (btnPreencherDados) {
            btnPreencherDados.classList.add('hidden');
            btnPreencherDados.style.display = 'none';
            console.log('❌ Botão "Usar Meus Dados" oculto (utilizador não logado)');
        }
    }

    async fillUserData() {
        console.log('📋 Preenchendo dados do utilizador');
        
        if (!this.token) {
            console.log('❌ Token não disponível');
            if (window.animationUtils && window.translator) {
                window.animationUtils.showToast(window.translator.getToastText('not_logged_in'), 'error');
            }
            return;
        }

        const btnPreencher = document.getElementById('btn-preencher-dados');
        let loading = null;
        
        if (window.animationUtils && btnPreencher) {
            loading = window.animationUtils.addButtonLoading(btnPreencher, 'Carregando...');
        }

        try {
            const response = await fetch(`${this.API_BASE}/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log('📡 Dados do utilizador:', data);
            
            if (response.ok && data.success) {
                const user = data.data.user;
                
                // Preencher formulário com dados do utilizador
                const campos = {
                    'nome': user.nome,
                    'morada': user.morada || '',
                    'telefone': user.telefone || '+351 ',
                    'email': user.email || ''
                };
                
                // Animar o preenchimento dos campos
                let delay = 0;
                Object.entries(campos).forEach(([id, valor]) => {
                    setTimeout(() => {
                        const campo = document.getElementById(id);
                        if (campo) {
                            campo.style.transition = 'all 0.3s ease';
                            campo.style.background = 'linear-gradient(90deg, #e8f5e8, #ffffff)';
                            campo.value = valor;
                            
                            // Destacar campo preenchido
                            if (window.animationUtils) {
                                window.animationUtils.pulseElement(campo, 500);
                            }
                            
                            setTimeout(() => {
                                campo.style.background = '';
                            }, 1000);
                        }
                    }, delay);
                    delay += 200;
                });
                
                if (window.animationUtils && window.translator) {
                    window.animationUtils.showToast(window.translator.getToastText('data_filled'), 'success');
                }
                
                console.log('✅ Dados preenchidos automaticamente');
            } else {
                console.log('❌ Erro ao obter dados do utilizador:', data.message);
                if (window.animationUtils && window.translator) {
                    window.animationUtils.showToast(window.translator.getToastText('data_error'), 'error');
                }
            }
        } catch (error) {
            console.error('❌ Erro ao carregar dados do utilizador:', error);
            if (window.animationUtils && window.translator) {
                window.animationUtils.showToast(window.translator.getToastText('network_error'), 'error');
            }
        } finally {
            if (loading) {
                loading.stop();
            }
        }
    }

    async showHistoryPage() {
        console.log('📋 Mostrando página de histórico');
        
        if (!this.token) {
            console.log('❌ Token não disponível');
            if (window.animationUtils) {
                window.animationUtils.showToast('Erro: Você não está logado', 'error');
            }
            return;
        }

        const paginaAtual = document.querySelector('main > div:not(.hidden)');
        const paginaDestino = document.getElementById('pagina-historico');
        
        if (window.animationUtils) {
            window.animationUtils.animatePageTransition(paginaAtual, paginaDestino, () => {
                this.loadUserHistory();
            });
        } else {
            this.hideAllPages();
            if (paginaDestino) {
                paginaDestino.classList.remove('hidden');
            }
            this.loadUserHistory();
        }
        
        // Esconder botões do header na página de histórico
        this.controlHeaderButtons(false);
    }

    async loadUserHistory() {
        console.log('📋 Carregando histórico de encomendas');
        
        const container = document.getElementById('lista-historico');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div class="loading-spinner" style="margin: 0 auto 16px;"></div>
                    <p>Carregando seu histórico...</p>
                </div>
            `;
        }
        
        try {
            const response = await fetch(`${this.API_BASE}/encomendas/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log('📡 Histórico recebido:', data);
            
            if (response.ok && data.success) {
                this.displayHistory(data.encomendas);
                if (window.animationUtils) {
                    window.animationUtils.showToast(`${data.encomendas.length} encomendas encontradas!`, 'success');
                }
            } else {
                console.log('❌ Erro ao carregar histórico:', data.message);
                this.displayHistory([]);
                if (window.animationUtils) {
                    window.animationUtils.showToast('Erro ao carregar histórico', 'error');
                }
            }
        } catch (error) {
            console.error('❌ Erro ao carregar histórico:', error);
            this.displayHistory([]);
            if (window.animationUtils && window.translator) {
                window.animationUtils.showToast(window.translator.getToastText('network_error'), 'error');
            }
        }
    }

    displayHistory(encomendas) {
        const container = document.getElementById('lista-historico');
        if (!container) return;

        if (encomendas.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🍕</div>
                    <h3 style="color: #00994d; margin-bottom: 8px;">Nenhuma encomenda ainda</h3>
                    <p style="margin-bottom: 20px;">Que tal fazer a sua primeira encomenda?</p>
                    <button class="btn" onclick="loginSystem.showDemoPage()" style="background: linear-gradient(135deg, #00994d 0%, #00b359 100%);">
                        Fazer Encomenda
                    </button>
                </div>
            `;
            return;
        }

        const historicoHTML = encomendas.map(encomenda => {
            // Calcular total das pizzas
            let totalPizzas = 0;
            if (encomenda.pizzas && encomenda.pizzas.length > 0) {
                totalPizzas = encomenda.pizzas.reduce((sum, pizza) => {
                    return sum + parseFloat(pizza.preco_unitario || 0);
                }, 0);
            }
            
            // Total final (pizzas + taxa de entrega)
            const taxaEntrega = parseFloat(encomenda.taxa_entrega || 0);
            const totalFinal = totalPizzas + taxaEntrega;
            
            return `
            <div class="historico-item">
                <div class="historico-header">
                    <h4 style="margin: 0; color: #00994d; font-size: 18px;">🍕 Encomenda #${encomenda.id}</h4>
                    <div class="historico-data">${new Date(encomenda.data_hora).toLocaleDateString('pt-PT', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</div>
                </div>
                <div class="historico-detalhes">
                    ${encomenda.pizzas && encomenda.pizzas.length > 0 ? 
                        encomenda.pizzas.map(pizza => `
                            <div class="historico-pizza">
                                <strong>${pizza.nome}</strong> (${pizza.tamanho}) 
                                <span style="float: right; font-weight: bold; color: #00994d;">${pizza.quantidade}x €${parseFloat(pizza.preco_unitario).toFixed(2)}</span>
                            </div>
                        `).join('') 
                        : '<div class="historico-pizza">Detalhes da encomenda não disponíveis</div>'
                    }
                    ${taxaEntrega > 0 ? `<div class="historico-pizza">Taxa de entrega <span style="float: right; font-weight: bold; color: #00994d;">€${taxaEntrega.toFixed(2)}</span></div>` : ''}
                </div>
                <div class="historico-total">
                    Total: €${totalFinal.toFixed(2)}
                </div>
            </div>`;
        }).join('');

        container.innerHTML = historicoHTML;

        container.innerHTML = historicoHTML;
        
        // Animar a lista de histórico
        if (window.animationUtils) {
            setTimeout(() => {
                window.animationUtils.animateHistoryList(container);
            }, 100);
        }
    }

    hideAllPages() {
        const pages = [
            'pagina-inicial', 'pagina-login', 'pagina-registo', 
            'pagina-boasvindas', 'pagina-cliente', 'pagina-menu', 'pagina-finalizar', 'pagina-historico'
        ];
        
        pages.forEach(pageId => {
            const page = document.getElementById(pageId);
            if (page) {
                page.classList.add('hidden');
                
                // Se estamos escondendo a página de histórico, limpar o conteúdo
                if (pageId === 'pagina-historico') {
                    this.clearHistoryContent();
                }
            }
        });
    }

    // Controlar visibilidade dos botões do header
    controlHeaderButtons(showButtons = true) {
        const headerButtons = document.querySelector('.botoes-secundarios-header');
        if (headerButtons) {
            if (showButtons) {
                headerButtons.style.display = 'flex';
            } else {
                headerButtons.style.display = 'none';
            }
        }
    }

    // Métodos para mostrar/esconder erros
    showLoginError(message) {
        const errorElement = document.getElementById('login-erro');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    hideLoginError() {
        const errorElement = document.getElementById('login-erro');
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
    }

    showRegisterError(message) {
        const errorElement = document.getElementById('registo-erro');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
        this.hideRegisterSuccess();
    }

    hideRegisterError() {
        const errorElement = document.getElementById('registo-erro');
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
    }

    showRegisterSuccess(message) {
        const successElement = document.getElementById('registo-sucesso');
        if (successElement) {
            successElement.textContent = message;
            successElement.classList.remove('hidden');
        }
        this.hideRegisterError();
    }

    hideRegisterSuccess() {
        const successElement = document.getElementById('registo-sucesso');
        if (successElement) {
            successElement.classList.add('hidden');
        }
    }
    
    // Função para limpar conteúdo do histórico
    clearHistoryContent() {
        const listaHistorico = document.getElementById('lista-historico');
        if (listaHistorico) {
            listaHistorico.innerHTML = '';
            console.log('🧹 Histórico limpo');
        }
    }
}

// Inicializar sistema quando DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🍕 Iniciando Pizzaria do Carlos - Sistema de Login');
    window.loginSystem = new LoginSystem();
});

// Exportar se necessário
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoginSystem;
}