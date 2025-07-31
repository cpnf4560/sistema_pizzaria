// Utilitários de Animações e Efeitos Visuais - Pizzaria do Carlos
console.log('✨ Arquivo animations.js carregado');

class AnimationUtils {
    constructor() {
        this.toastContainer = this.createToastContainer();
    }

    // Criar container para toasts
    createToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    // Mostrar toast notification
    showToast(message, type = 'success', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.style.cssText = `
            background: ${type === 'error' ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' : 'linear-gradient(135deg, #00994d 0%, #00b359 100%)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            pointer-events: auto;
            animation: toastSlide 0.5s ease-out;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            font-size: 14px;
            max-width: 300px;
            word-wrap: break-word;
        `;
        toast.textContent = message;

        this.toastContainer.appendChild(toast);

        // Remover após o tempo especificado
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    if (toast.parentNode) {
                        this.toastContainer.removeChild(toast);
                    }
                }, 300);
            }
        }, duration);

        return toast;
    }

    // Animar transição entre páginas
    animatePageTransition(fromPage, toPage, callback) {
        if (fromPage) {
            fromPage.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                fromPage.classList.add('hidden');
                if (toPage) {
                    toPage.classList.remove('hidden');
                    toPage.style.animation = 'fadeIn 0.5s ease-in-out forwards';
                }
                if (callback) callback();
            }, 300);
        } else {
            if (toPage) {
                toPage.classList.remove('hidden');
                toPage.style.animation = 'fadeIn 0.5s ease-in-out forwards';
            }
            if (callback) callback();
        }
    }

    // Adicionar efeito de loading a um botão
    addButtonLoading(button, loadingText = 'Carregando...') {
        if (!button) return null;
        
        const originalText = button.innerHTML;
        const originalDisabled = button.disabled;
        
        button.disabled = true;
        button.innerHTML = `<span class="loading-spinner"></span> ${loadingText}`;
        button.style.pointerEvents = 'none';
        
        return {
            stop: () => {
                button.disabled = originalDisabled;
                button.innerHTML = originalText;
                button.style.pointerEvents = 'auto';
            }
        };
    }

    // Animar lista de histórico
    animateHistoryList(container) {
        const items = container.querySelectorAll('.historico-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Efeito de shake para erros
    shakeElement(element) {
        if (!element) return;
        
        element.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    // Efeito de pulse para destacar elementos
    pulseElement(element, duration = 1000) {
        if (!element) return;
        
        element.style.animation = `pulse ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    // Smooth scroll para elementos
    smoothScrollTo(element, offset = 0) {
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Adicionar animação de entrada a formulários
    animateFormFields(formElement) {
        const fields = formElement.querySelectorAll('.form-row');
        fields.forEach((field, index) => {
            field.style.opacity = '0';
            field.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                field.style.transition = 'all 0.4s ease-out';
                field.style.opacity = '1';
                field.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }

    // Efeito de typewriter para texto
    typewriterEffect(element, text, speed = 50) {
        if (!element) return;
        
        element.textContent = '';
        let i = 0;
        
        const typing = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, speed);
    }

    // Adicionar efeito ripple a botões
    addRippleEffect(button) {
        if (!button) return;
        
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    }
}

// Adicionar estilos CSS para animações
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
    
    @keyframes toastSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
    }
    
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
        margin-right: 8px;
        vertical-align: middle;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(animationStyles);

// Instância global
window.animationUtils = new AnimationUtils();

// Adicionar efeito ripple a todos os botões automaticamente
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn, .btn-opcao, .btn-mini, .pizza-btn');
    buttons.forEach(button => {
        window.animationUtils.addRippleEffect(button);
    });
});
