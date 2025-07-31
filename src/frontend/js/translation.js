// Sistema de Tradução - Pizzaria do Carlos
class TranslationSystem {
    constructor() {
        this.currentLanguage = 'pt';
        this.translations = {
            pt: {
                bemvindo: 'Bem-vindo à Pizzaria do Carlos!',
                escolha: 'Escolha uma opção para continuar:',
                utilizador_registado: '🔐 Utilizador',
                registar: '📝 Registar',
                demo: '🍕 Continuar sem registo',
                continue_no_register: '🍕 Continuar sem registo',
                traducao: '🌍 EN',
                sair: '❌ Sair',
                login: 'Login',
                username: 'Username',
                password: 'Password',
                entrar: 'Entrar',
                voltar: 'Voltar',
                novo_registo: 'Novo Registo',
                nome_completo: 'Nome Completo',
                boasvindas: 'Boas-vindas!',
                fazer_encomenda: '🍕 Fazer Encomenda',
                ver_historico: '📋 Ver Histórico',
                historico_encomendas: 'Histórico de Encomendas',
                usar_meus_dados: '✨ Usar Meus Dados',
                ver_historico_btn: '📊 Ver Histórico',
                logout: '🔓 Logout',
                dados_cliente: 'Dados do Cliente',
                nome: 'Nome',
                morada: 'Morada',
                telefone: 'Telefone',
                email: 'Email',
                avancar_menu: 'Avançar para o Menu',
                demo_btn: 'Demo',
                menu_pizzas: 'Menu de Pizzas',
                carrinho: 'Carrinho',
                total: 'Total',
                recolha: 'Recolha no restaurante',
                entrega: 'Entrega ao domicílio',
                hora_entrega: 'Hora da entrega/recolha',
                observacoes: 'Observações',
                finalizar_encomenda: 'Finalizar encomenda',
                encomenda_registada: 'Encomenda registada!',
                nova_encomenda: 'Quer fazer uma nova encomenda?',
                sim: 'Sim',
                nao: 'Não',
                sair_confirmacao: 'Deseja mesmo sair?',
                // Novas traduções
                welcome: 'Bem-vindo à Pizzaria do Carlos!',
                choose: 'Escolha uma opção para continuar:',
                translate: '🌍 EN',
                exit: '❌ Sair',
                registered_user: '🔐 Utilizador',
                register: '📝 Registar',
                continue_no_register: '🍕 Continuar sem registo',
                enter: 'Entrar',
                back: 'Voltar',
                new_registration: '📝 Novo Registo',
                full_name: 'Nome Completo',
                address: 'Morada',
                phone: 'Telefone',
                welcome_back: 'Boas-vindas!',
                make_order: '🍕 Fazer Encomenda',
                view_history: '📋 Ver Histórico',
                order_history: '📊 Histórico de Encomendas',
                customer_data: 'Dados do Cliente',
                go_to_menu: 'Avançar para o Menu',
                use_my_data: '✨ Usar Meus Dados',
                view_history_btn: '📊 Ver Histórico'
            },
            en: {
                bemvindo: 'Welcome to Carlos\' Pizzeria!',
                escolha: 'Choose an option to continue:',
                utilizador_registado: '🔐 User',
                registar: '📝 Register',
                demo: '🍕 Continue without register',
                continue_no_register: '🍕 Continue without register',
                traducao: '🌍 PT',
                sair: '❌ Exit',
                login: 'Login',
                username: 'Username',
                password: 'Password',
                entrar: 'Enter',
                voltar: 'Back',
                novo_registo: 'New Registration',
                nome_completo: 'Full Name',
                boasvindas: 'Welcome!',
                fazer_encomenda: '🍕 Make Order',
                historico_encomendas: 'Order History',
                usar_meus_dados: '✨ Use My Data',
                ver_historico_btn: '📊 View History',
                logout: '🔓 Logout',
                dados_cliente: 'Customer Data',
                nome: 'Name',
                morada: 'Address',
                telefone: 'Phone',
                email: 'Email',
                avancar_menu: 'Go to Menu',
                demo_btn: 'Demo',
                menu_pizzas: 'Pizza Menu',
                carrinho: 'Cart',
                total: 'Total',
                recolha: 'Restaurant pickup',
                entrega: 'Home delivery',
                hora_entrega: 'Pickup/delivery time',
                observacoes: 'Observations',
                finalizar_encomenda: 'Complete order',
                encomenda_registada: 'Order registered!',
                nova_encomenda: 'Want to make a new order?',
                sim: 'Yes',
                nao: 'No',
                sair_confirmacao: 'Do you really want to exit?',
                // Traduções correspondentes ao português
                welcome: 'Welcome to Carlos\' Pizzeria!',
                choose: 'Choose an option to continue:',
                translate: '🌍 PT',
                exit: '❌ Exit',
                registered_user: '🔐 User',
                register: '📝 Register',
                continue_no_register: '🍕 Continue without register',
                enter: 'Enter',
                back: 'Back',
                new_registration: 'New Registration',
                full_name: 'Full Name',
                address: 'Address',
                phone: 'Phone',
                welcome_back: 'Welcome!',
                make_order: '🍕 Make Order',
                view_history: '📋 View History',
                order_history: '📊 Order History',
                customer_data: 'Customer Data',
                go_to_menu: 'Go to Menu',
                use_my_data: '✨ Use My Data',
                view_history_btn: '📊 View History'
            }
        };
    }

    translate() {
        const newLang = this.currentLanguage === 'pt' ? 'en' : 'pt';
        this.setLanguage(newLang);
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        this.updateInterface();
        
        // Atualizar botão de idioma
        const btnIdioma = document.getElementById('btn-idioma');
        if (btnIdioma) {
            const btnText = btnIdioma.querySelector('span');
            if (btnText) {
                btnText.textContent = lang === 'pt' ? '🌍 EN' : '🌍 PT';
            }
        }
    }

    updateInterface() {
        const elements = document.querySelectorAll('[data-pt][data-en]');
        elements.forEach(element => {
            const key = element.getAttribute(`data-${this.currentLanguage}`);
            if (key && this.translations[this.currentLanguage][key]) {
                element.textContent = this.translations[this.currentLanguage][key];
            }
        });
        
        // Traduzir placeholders
        this.translatePlaceholders();
    }

    getText(key) {
        return this.translations[this.currentLanguage][key] || key;
    }

    // Função para traduzir mensagens dinâmicas
    getToastMessages() {
        return {
            pt: {
                login_success: 'Login realizado com sucesso!',
                login_error: 'Erro ao fazer login',
                register_success: 'Registo realizado com sucesso!',
                register_error: 'Erro ao registar utilizador',
                data_filled: 'Dados preenchidos automaticamente! ✨',
                data_error: 'Erro ao carregar seus dados',
                network_error: 'Erro de conexão. Tente novamente.',
                not_logged_in: 'Erro: Você não está logado',
                history_loaded: 'encomendas encontradas!',
                history_error: 'Erro ao carregar histórico',
                no_orders: 'Nenhuma encomenda ainda',
                first_order: 'Que tal fazer a sua primeira encomenda?',
                make_order: 'Fazer Encomenda',
                loading: 'Carregando...',
                loading_history: 'Carregando seu histórico...'
            },
            en: {
                login_success: 'Login successful!',
                login_error: 'Login error',
                register_success: 'Registration successful!',
                register_error: 'Registration error',
                data_filled: 'Data filled automatically! ✨',
                data_error: 'Error loading your data',
                network_error: 'Connection error. Please try again.',
                not_logged_in: 'Error: You are not logged in',
                history_loaded: 'orders found!',
                history_error: 'Error loading history',
                no_orders: 'No orders yet',
                first_order: 'How about making your first order?',
                make_order: 'Make Order',
                loading: 'Loading...',
                loading_history: 'Loading your history...'
            }
        };
    }

    getToastText(key) {
        const messages = this.getToastMessages();
        return messages[this.currentLanguage][key] || key;
    }

    // Função para adicionar tradução a elementos gerados dinamicamente
    addTranslationToElement(element, ptKey, enKey) {
        if (element) {
            element.setAttribute('data-pt', ptKey);
            element.setAttribute('data-en', enKey);
            this.updateSingleElement(element);
        }
    }

    updateSingleElement(element) {
        const key = element.getAttribute(`data-${this.currentLanguage}`);
        if (key && this.translations[this.currentLanguage][key]) {
            element.textContent = this.translations[this.currentLanguage][key];
        }
    }

    // Função para traduzir placeholders
    translatePlaceholders() {
        const placeholders = {
            pt: {
                'observacoes': 'Ex: sem cebola, ponto extra, etc.'
            },
            en: {
                'observacoes': 'Ex: no onions, extra crispy, etc.'
            }
        };

        Object.keys(placeholders[this.currentLanguage]).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.placeholder = placeholders[this.currentLanguage][id];
            }
        });
    }
}

// Instância global do sistema de tradução
const translator = new TranslationSystem();
window.translator = translator;

// Exportar se necessário
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TranslationSystem;
}
