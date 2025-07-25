/**
 * Frontend JavaScript para conectar o HTML à API da Pizzaria
 * Este arquivo substitui o JavaScript inline do index.html
 */

// Configuração da API
const API_BASE = 'http://localhost:3000/api';
let authToken = localStorage.getItem('pizzaria_token') || '';
let currentUser = null;

// Utilitários
function $(id) { 
    return document.getElementById(id); 
}

function showError(message) {
    alert('Erro: ' + message);
}

function showSuccess(message) {
    alert('Sucesso: ' + message);
}

// Configuração do axios/fetch
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Estado da aplicação
let pizzas = [];
let carrinho = [];
let cliente = {};

// Constantes
const tamanhos = ["Pequena", "Média", "Grande"];

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM carregado, iniciando app...');
    
    // Verificar se elementos existem
    const pizzasContainer = $("pizzas");
    console.log('🍕 Container pizzas:', pizzasContainer ? 'encontrado' : 'NÃO ENCONTRADO');
    
    initializeApp();
    
    try {
        setupPhoneInput();
        console.log('✅ setupPhoneInput executado');
    } catch (error) {
        console.error('❌ Erro em setupPhoneInput:', error);
    }
    
    try {
        setupEventListeners();
        console.log('✅ setupEventListeners executado');
    } catch (error) {
        console.error('❌ Erro em setupEventListeners:', error);
    }

    // Botão Demo: preenche dados do cliente demo
    const demoBtn = document.getElementById('demo-btn');
    if (demoBtn) {
        demoBtn.onclick = function() {
            $("nome").value = "Cliente Demo";
            $("morada").value = "Rua Demo 999";
            $("telefone").value = "+351 999999999";
            $("email").value = "demo@pizzaria.com";
        };
    }
    
    // Função de teste para forçar carregamento de pizzas (apenas para debug)
    window.testPizzas = async function() {
        console.log('🧪 Teste: Forçando carregamento de pizzas...');
        await initializeApp();
        console.log('🧪 Teste: Pizzas carregadas:', pizzas);
        renderPizzas();
    };
});

async function initializeApp() {
    console.log('🚀 Inicializando aplicação...');
    
    try {
        console.log('🧪 Carregando pizzas da API...');
        const response = await fetch(`${API_BASE}/pizzas`);
        console.log('📡 Status da resposta:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('📋 Dados recebidos:', data);
            
            if (data.success && data.data && data.data.length > 0) {
                pizzas = data.data;
                console.log(`✅ ${pizzas.length} pizzas carregadas com sucesso!`);
                return;
            }
        }
        
        throw new Error('Falha no carregamento da API');
        
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        console.log('🔄 Usando dados de fallback...');
        
        // Usar dados estáticos como fallback baseados na API real
        pizzas = [
            { id: 1, nome: "Pizza Java Supreme", descricao: "Com chouriço, fiambre, cogumelos e extra queijo", preco_pequena: 15.5, preco_media: 17.5, preco_grande: 19.5 },
            { id: 2, nome: "Pizza Phyton Pepperoni", descricao: "Molho picante, queijo e pepperoni", preco_pequena: 15.0, preco_media: 17.0, preco_grande: 19.0 },
            { id: 3, nome: "Pizza C++ Calzone", descricao: "Calzone fechada recheada com carne, queijo e cebola", preco_pequena: 15.8, preco_media: 17.8, preco_grande: 19.8 },
            { id: 4, nome: "Pizza HTML Havaiana", descricao: "Fiambre, ananás e queijo", preco_pequena: 14.9, preco_media: 16.9, preco_grande: 18.9 },
            { id: 5, nome: "Pizza CSS Carbonara", descricao: "Bacon, natas, cogumelos e parmesão", preco_pequena: 15.2, preco_media: 17.2, preco_grande: 19.2 },
            { id: 6, nome: "Pizza Javascript Jalapeño", descricao: "Queijo, carne picada e jalapeños", preco_pequena: 15.3, preco_media: 17.3, preco_grande: 19.3 }
        ];
        console.log('✅ Dados de fallback carregados!');
    }
}

// ===== GESTÃO DE PIZZAS =====
async function loadPizzas() {
    console.log('🍕 Fazendo chamada para API de pizzas...');
    try {
        const response = await apiCall('/pizzas');
        pizzas = response.data || [];
        console.log('✅ Pizzas recebidas da API:', pizzas.length, 'pizzas');
        console.log('📋 Dados das pizzas:', pizzas);
    } catch (error) {
        console.error('❌ Erro ao carregar pizzas da API:', error);
        console.log('🔄 Usando dados de fallback...');
        // Fallback para dados estáticos em caso de erro
        pizzas = [
            { id: 1, nome: "Margherita", descricao: "Queijo mozzarella, tomate, manjericão fresco", preco_pequena: 5.5, preco_media: 7.0, preco_grande: 8.5 },
            { id: 2, nome: "Pepperoni", descricao: "Queijo mozzarella, tomate, pepperoni", preco_pequena: 6.0, preco_media: 8.0, preco_grande: 9.5 },
            { id: 3, nome: "Quatro Queijos", descricao: "Mozzarella, gorgonzola, parmesão, queijo flamengo", preco_pequena: 6.5, preco_media: 8.5, preco_grande: 10.0 },
            { id: 4, nome: "Vegetariana", descricao: "Mozzarella, tomate, pimentos, cebola, milho, cogumelos", preco_pequena: 6.0, preco_media: 8.0, preco_grande: 9.5 },
        ];
    }
    
    // Renderizar as pizzas após carregar
    console.log('🎨 Renderizando pizzas...');
    renderPizzas();
    console.log('✅ Pizzas renderizadas!');
}

function renderPizzas() {
    console.log('🎨 Iniciando renderização das pizzas...');
    const container = $("pizzas");
    if (!container) {
        console.error('❌ Container "pizzas" não encontrado!');
        return;
    }
    
    console.log('📦 Container encontrado, limpando conteúdo...');
    container.innerHTML = "";
    
    if (!pizzas || pizzas.length === 0) {
        console.warn('⚠️ Nenhuma pizza disponível para renderizar');
        container.innerHTML = '<p style="text-align:center;color:#666;">Nenhuma pizza disponível</p>';
        return;
    }
    
    console.log(`🍕 Renderizando ${pizzas.length} pizzas...`);
    pizzas.forEach((pizza, index) => {
        console.log(`  Renderizando pizza ${index + 1}: ${pizza.nome}`);
        const pizzaDiv = document.createElement("div");
        pizzaDiv.className = "pizza-item";
        
        // Adaptar para formato da API (preco_pequena, preco_media, preco_grande)
        const precos = [
            parseFloat(pizza.preco_pequena || 0), 
            parseFloat(pizza.preco_media || 0), 
            parseFloat(pizza.preco_grande || 0)
        ];
        
        console.log(`  Preços da pizza ${pizza.nome}:`, precos);
        
        pizzaDiv.innerHTML = `
            <div>
                <span class="pizza-nome">${pizza.nome}</span>
                <div class="pizza-desc">${pizza.descricao}</div>
            </div>
            <div class="pizza-precos">
                ${precos.map((p, i) => 
                    `<button class="pizza-btn" onclick="addPizza(${pizza.id},${i})">
                        ${tamanhos[i]}<br><b>${p.toFixed(2)}€</b>
                    </button>`
                ).join("")}
            </div>
        `;
        container.appendChild(pizzaDiv);
    });
    
    console.log('✅ Renderização de pizzas completa!');
}

// ===== GESTÃO DO CARRINHO =====

window.addPizza = function(id, tamanhoIdx) {
    const pizza = pizzas.find(p => p.id === id);
    if (!pizza) return;
    
    const item = carrinho.find(it => it.id === pizza.id && it.tamanhoIdx === tamanhoIdx);
    if (item) {
        item.qtd++;
    } else {
        carrinho.push({ 
            ...pizza, 
            tamanhoIdx, 
            qtd: 1 
        });
    }
    renderCarrinho();
};

window.removeItem = function(id, tamanhoIdx) {
    const idx = carrinho.findIndex(it => it.id === id && it.tamanhoIdx === tamanhoIdx);
    if (idx >= 0) {
        if (carrinho[idx].qtd > 1) {
            carrinho[idx].qtd--;
        } else {
            carrinho.splice(idx, 1);
        }
        renderCarrinho();
    }
};

function renderCarrinho() {
    const container = $("itens-carrinho");
    const totalContainer = $("total-carrinho");
    
    if (!container || !totalContainer) return;
    
    let html = "";
    let total = 0;
    
    carrinho.forEach(item => {
        const precos = [
            item.preco_pequena || (item.preco ? item.preco[0] : 0), 
            item.preco_media || (item.preco ? item.preco[1] : 0), 
            item.preco_grande || (item.preco ? item.preco[2] : 0)
        ];
        const precoUnit = precos[item.tamanhoIdx];
        const subtotal = precoUnit * item.qtd;
        
        html += `<div>
            <b>${item.qtd}×</b> ${item.nome} <small>(${tamanhos[item.tamanhoIdx]})</small> — ${subtotal.toFixed(2)}€
            <button class="pizza-btn" style="padding:2px 7px;" onclick="removeItem(${item.id},${item.tamanhoIdx})">−</button>
        </div>`;
        total += subtotal;
    });
    
    container.innerHTML = html || "<i>Carrinho vazio</i>";
    
    const entrega = document.querySelector('input[name="entrega"]:checked')?.value;
    if (entrega === "domicilio") total += 3.90;
    
    totalContainer.innerText = `Total: ${total.toFixed(2)} € (IVA incl.)`;
}

// ===== GESTÃO DE CLIENTE =====
async function saveCliente(clienteData) {
    try {
        console.log('Salvando cliente:', clienteData);
        const response = await apiCall('/clientes', {
            method: 'POST',
            body: JSON.stringify(clienteData)
        });
        
        cliente = response.data;
        console.log('Cliente salvo:', cliente);
        return cliente;
    } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        // Em caso de erro, usar dados locais com ID simulado
        cliente = { 
            ...clienteData, 
            id: Date.now() // ID temporário para funcionar sem backend
        };
        console.log('Usando dados locais:', cliente);
        return cliente;
    }
}

// ===== GESTÃO DE ENCOMENDAS =====
async function criarEncomenda(encomendaData) {
    try {
        console.log('🍕 Criando encomenda:', encomendaData);
        
        const response = await fetch(`${API_BASE}/encomendas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(encomendaData)
        });
        
        const data = await response.json();
        console.log('📡 Resposta da API:', data);
        
        if (response.ok && data.success) {
            console.log('✅ Encomenda criada com sucesso:', data.data);
            
            // Gerar ficheiro .txt da encomenda
            gerarFicheiroEncomenda(encomendaData, data.data);
            
            return data.data;
        } else {
            throw new Error(data.message || 'Erro desconhecido na API');
        }
        
    } catch (error) {
        console.error('❌ Erro ao criar encomenda:', error);
        
        // Em caso de erro, gerar ficheiro local e simular sucesso para não bloquear o utilizador
        const encomendaLocal = {
            id: Date.now(),
            ...encomendaData,
            status: 'Pendente (Local)',
            created_at: new Date().toISOString()
        };
        
        console.log('🔄 Simulando encomenda local:', encomendaLocal);
        gerarFicheiroEncomenda(encomendaData, encomendaLocal);
        
        return encomendaLocal;
    }
}

function gerarFicheiroEncomenda(dados, encomenda) {
    try {
        const agora = new Date();
        const conteudo = `PIZZARIA JAVA - ENCOMENDA #${encomenda.id}
======================================

Data: ${agora.toLocaleDateString('pt-PT')}
Hora: ${agora.toLocaleTimeString('pt-PT')}

CLIENTE:
Nome: ${dados.cliente.nome}
Morada: ${dados.cliente.morada}
Telefone: ${dados.cliente.telefone}
Email: ${dados.cliente.email}

ENCOMENDA:
Tipo de Entrega: ${dados.tipo_entrega === 'domicilio' ? 'Entrega ao Domicílio' : 'Recolha no Restaurante'}
Hora de Entrega/Recolha: ${dados.hora_entrega}
${dados.observacoes ? 'Observações: ' + dados.observacoes : ''}

PIZZAS:
${dados.pizzas.map(pizza => 
    `- ${pizza.quantidade}x ${pizzas.find(p => p.id === pizza.pizza_id)?.nome || 'Pizza'} (${pizza.tamanho}) - ${(pizza.preco_unitario * pizza.quantidade).toFixed(2)}€`
).join('\n')}

TOTAL: ${dados.total.toFixed(2)}€ (IVA incluído)

Status: ${encomenda.status}
======================================`;

        const blob = new Blob([conteudo], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `encomenda_${encomenda.id}_${agora.toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📄 Ficheiro .txt gerado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao gerar ficheiro:', error);
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Form Cliente
    const formCliente = $("form-cliente");
    if (formCliente) {
        formCliente.onsubmit = async function(e) {
            e.preventDefault();
            
            const clienteData = {
                nome: $("nome").value.trim(),
                morada: $("morada").value.trim(),
                telefone: $("telefone").value.trim(),
                email: $("email").value.trim()
            };
            
            if (!clienteData.nome || !clienteData.morada || !clienteData.telefone || !clienteData.email) {
                showError("Preencha todos os campos.");
                return;
            }
            
            try {
                await saveCliente(clienteData);
                
                // Garantir que as pizzas estão carregadas antes de mostrar o menu
                if (!pizzas || pizzas.length === 0) {
                    console.log('🔄 Recarregando pizzas antes de mostrar menu...');
                    await initializeApp();
                }
                
                $("pagina-cliente").classList.add("hidden");
                $("pagina-menu").classList.remove("hidden");
                
                // Forçar renderização das pizzas
                console.log('🍕 Forçando renderização das pizzas...');
                renderPizzas();
                renderCarrinho();
                
            } catch (error) {
                showError("Erro ao salvar dados do cliente: " + error.message);
            }
        };
    }
    
    // Form Encomenda
    const formEncomenda = $("form-encomenda");
    if (formEncomenda) {
        console.log('Configurando event listener para form-encomenda');
        formEncomenda.onsubmit = async function(e) {
            console.log('Formulário de encomenda submetido!');
            e.preventDefault();
            
            if (carrinho.length === 0) {
                showError("Adicione pizzas ao carrinho.");
                return;
            }
            
            console.log('Carrinho:', carrinho);
            console.log('Cliente:', cliente);
            
            const entrega = document.querySelector('input[name="entrega"]:checked').value;
            const hora = $("hora").value;
            const observacoes = $("observacoes").value.trim();
            
            // Calcular total
            let total = 0;
            carrinho.forEach(item => {
                const precos = [
                    item.preco_pequena || (item.preco ? item.preco[0] : 0), 
                    item.preco_media || (item.preco ? item.preco[1] : 0), 
                    item.preco_grande || (item.preco ? item.preco[2] : 0)
                ];
                total += precos[item.tamanhoIdx] * item.qtd;
            });
            if (entrega === "domicilio") total += 3.90;
            
            const encomendaData = {
                cliente_id: cliente.id,
                cliente: cliente,
                tipo_entrega: entrega,
                hora_entrega: hora,
                observacoes: observacoes,
                total: total,
                pizzas: carrinho.map(item => {
                    const precos = [
                        item.preco_pequena || (item.preco ? item.preco[0] : 0), 
                        item.preco_media || (item.preco ? item.preco[1] : 0), 
                        item.preco_grande || (item.preco ? item.preco[2] : 0)
                    ];
                    return {
                        pizza_id: item.id,
                        tamanho: tamanhos[item.tamanhoIdx],
                        quantidade: item.qtd,
                        preco_unitario: precos[item.tamanhoIdx]
                    };
                })
            };
            
            console.log('Dados da encomenda:', encomendaData);
            
            try {
                await criarEncomenda(encomendaData);
                $("pagina-menu").classList.add("hidden");
                $("pagina-finalizar").classList.remove("hidden");
                showSuccess("Encomenda registada com sucesso!");
            } catch (error) {
                console.error('Erro detalhado:', error);
                showError("Erro ao criar encomenda: " + error.message);
            }
        };
    } else {
        console.error('Elemento form-encomenda não encontrado!');
    }
    
    // Botões de entrega - atualizar preço
    document.querySelectorAll('input[name="entrega"]').forEach(radio => {
        radio.onchange = renderCarrinho;
    });
    
    // Botão Nova Encomenda
    const novaEncomenda = $("nova-encomenda");
    if (novaEncomenda) {
        novaEncomenda.onclick = function() {
            carrinho = [];
            cliente = {};
            $("form-cliente").reset();
            $("form-encomenda").reset();
            $("pagina-finalizar").classList.add("hidden");
            $("pagina-cliente").classList.remove("hidden");
            
            const telInput = $("telefone");
            if (telInput) telInput.value = "+351 ";
        };
    }
    
    // Botão Sair
    const sair = $("sair");
    if (sair) {
        sair.onclick = function() {
            if (confirm("Tem certeza que deseja sair?")) {
                window.close();
            }
        };
    }
}

// ===== CONFIGURAÇÃO DO INPUT DE TELEFONE =====
function setupPhoneInput() {
    const telInput = $("telefone");
    if (!telInput) return;

    // Inicializa com o prefixo se estiver vazio
    if (!telInput.value) {
        telInput.value = "+351 ";
    }

    telInput.addEventListener("input", function(e) {
        const cursorPos = this.selectionStart;
        let value = this.value;
        
        // Se o prefixo foi removido, restaura
        if (!value.startsWith("+351 ")) {
            let digits = value.replace(/[^\d]/g, "");
            digits = digits.slice(0, 9);
            this.value = "+351 " + digits;
            this.setSelectionRange(this.value.length, this.value.length);
            return;
        }
        
        // Processa apenas a parte depois do prefixo
        let afterPrefix = value.slice(5);
        let digits = afterPrefix.replace(/[^\d]/g, "");
        digits = digits.slice(0, 9);
        
        let newValue = "+351 " + digits;
        if (this.value !== newValue) {
            this.value = newValue;
            let newCursorPos = Math.min(cursorPos, this.value.length);
            if (newCursorPos < 5) newCursorPos = 5;
            this.setSelectionRange(newCursorPos, newCursorPos);
        }
    });

    telInput.addEventListener("keydown", function(e) {
        const cursorPos = this.selectionStart;
        const cursorEnd = this.selectionEnd;
        
        if ((e.key === "Backspace" && cursorPos <= 5) || 
            (e.key === "Delete" && cursorPos < 5)) {
            e.preventDefault();
            return;
        }
        
        if ((e.key === "Backspace" || e.key === "Delete") && 
            cursorPos !== cursorEnd && cursorPos < 5) {
            e.preventDefault();
            return;
        }
    });

    telInput.addEventListener("click", function() {
        if (this.selectionStart < 5) {
            this.setSelectionRange(5, 5);
        }
    });

    telInput.addEventListener("paste", function(e) {
        e.preventDefault();
        let paste = (e.clipboardData || window.clipboardData).getData('text');
        let digits = paste.replace(/[^\d]/g, "").slice(0, 9);
        
        let currentDigits = this.value.slice(5);
        let cursorPos = Math.max(0, this.selectionStart - 5);
        
        let newDigits = currentDigits.slice(0, cursorPos) + digits + currentDigits.slice(this.selectionEnd - 5);
        newDigits = newDigits.slice(0, 9);
        
        this.value = "+351 " + newDigits;
        this.setSelectionRange(5 + cursorPos + digits.length, 5 + cursorPos + digits.length);
    });
}
