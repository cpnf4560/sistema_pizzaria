// Efeitos de Partículas Flutuantes - Pizzaria do Carlos
console.log('🎨 Arquivo particles.js carregado');

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 15;
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        
        this.init();
    }

    init() {
        // Criar canvas para partículas
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: -1;
            opacity: 0.6;
        `;
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // Criar partículas iniciais
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }
        
        // Event listeners
        window.addEventListener('resize', () => this.resize());
        
        // Iniciar animação
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        const symbols = ['🍕', '🧀', '🍅', '🌿', '⭐', '🍄', '🍍', '🧀', '🌶️'];
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 20 + 10,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            symbol: symbols[Math.floor(Math.random() * symbols.length)],
            opacity: Math.random() * 0.3 + 0.1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02
        };
    }

    updateParticle(particle) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;

        // Wrap around screen
        if (particle.x < -particle.size) particle.x = this.canvas.width + particle.size;
        if (particle.x > this.canvas.width + particle.size) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = this.canvas.height + particle.size;
        if (particle.y > this.canvas.height + particle.size) particle.y = -particle.size;
    }

    drawParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation);
        this.ctx.font = `${particle.size}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(particle.symbol, 0, 0);
        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }

    // Controles de visibilidade
    show() {
        if (this.canvas) {
            this.canvas.style.opacity = '0.6';
        }
    }

    hide() {
        if (this.canvas) {
            this.canvas.style.opacity = '0';
        }
    }

    // Adicionar partícula temporária (para interações)
    addTemporaryParticle(x, y, symbol = '✨') {
        const tempParticle = {
            x: x,
            y: y,
            size: 30,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            symbol: symbol,
            opacity: 1,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            life: 60 // frames
        };

        // Animar partícula temporária
        const animateTemp = () => {
            tempParticle.x += tempParticle.speedX;
            tempParticle.y += tempParticle.speedY;
            tempParticle.opacity -= 1/60;
            tempParticle.life--;
            tempParticle.rotation += tempParticle.rotationSpeed;
            tempParticle.size *= 0.98;

            if (tempParticle.life > 0) {
                // Desenhar partícula temporária
                this.ctx.save();
                this.ctx.globalAlpha = tempParticle.opacity;
                this.ctx.translate(tempParticle.x, tempParticle.y);
                this.ctx.rotate(tempParticle.rotation);
                this.ctx.font = `${tempParticle.size}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(tempParticle.symbol, 0, 0);
                this.ctx.restore();

                requestAnimationFrame(animateTemp);
            }
        };
        
        animateTemp();
    }
}

// Inicializar sistema de partículas quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que tudo foi carregado
    setTimeout(() => {
        window.particleSystem = new ParticleSystem();
        
        // Adicionar partículas quando o utilizador clica
        document.addEventListener('click', (e) => {
            if (window.particleSystem && Math.random() > 0.7) {
                window.particleSystem.addTemporaryParticle(e.clientX, e.clientY);
            }
        });
        
        console.log('🎨 Sistema de partículas inicializado');
    }, 500);
});

// Controlar visibilidade baseada na página
if (window.loginSystem) {
    const originalShowLoginPage = window.loginSystem.showLoginPage;
    const originalShowDemoPage = window.loginSystem.showDemoPage;
    
    window.loginSystem.showLoginPage = function() {
        originalShowLoginPage.call(this);
        if (window.particleSystem) window.particleSystem.hide();
    };
    
    window.loginSystem.showDemoPage = function() {
        originalShowDemoPage.call(this);
        if (window.particleSystem) window.particleSystem.show();
    };
}
