// Componente de Header com Logo - Pizzaria do Carlos
function createHeaderLogo() {
    return `
        <div class="header-logo">
            <div class="logo-container">
                <img src="images/logo.png" 
                      alt="Pizzaria do Carlos" 
                      class="logo-img">
            </div>
            <div class="logo-text">PIZZARIA DO CARLOS</div>
            <div class="logo-subtitle">As melhores pizzas da cidade! 🍕</div>
        </div>
    `;
}

// Função para inserir o logo no início de um container
function insertLogo(containerId = 'main') {
    const container = document.getElementById(containerId) || document.querySelector('main');
    if (container) {
        container.insertAdjacentHTML('afterbegin', createHeaderLogo());
    }
}

// Auto-inserir logo quando o DOM carregar (se não existir)
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se já existe um header-logo
    if (!document.querySelector('.header-logo')) {
        insertLogo();
    }
});

// Exportar para uso em outros scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createHeaderLogo, insertLogo };
}
