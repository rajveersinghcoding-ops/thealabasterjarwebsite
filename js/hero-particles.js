/* ============================================
   HERO PARTICLE ANIMATION SYSTEM
   Creates an ethereal, spiritual floating orb effect
   ============================================ */

class HeroParticles {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.animationId = null;

        // Configuration
        this.config = {
            particleCount: 50,
            minSize: 2,
            maxSize: 6,
            colors: [
                'rgba(212, 165, 116, 0.6)',  // Gold
                'rgba(212, 165, 116, 0.4)',  // Gold lighter
                'rgba(232, 90, 111, 0.5)',   // Rose
                'rgba(232, 90, 111, 0.3)',   // Rose lighter
                'rgba(196, 30, 58, 0.3)',    // Deep rose
                'rgba(253, 248, 243, 0.4)',  // Cream
            ],
            connectionDistance: 120,
            connectionOpacity: 0.15,
            speedMultiplier: 0.3,
        };

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        const size = Math.random() * (this.config.maxSize - this.config.minSize) + this.config.minSize;
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: size,
            baseSize: size,
            color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
            vx: (Math.random() - 0.5) * this.config.speedMultiplier,
            vy: (Math.random() - 0.5) * this.config.speedMultiplier,
            // For floating animation
            angle: Math.random() * Math.PI * 2,
            angleSpeed: 0.01 + Math.random() * 0.02,
            floatRadius: 20 + Math.random() * 30,
            // For breathing/pulse effect
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.02 + Math.random() * 0.02,
        };
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        // Subtle mouse interaction
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    drawParticle(particle) {
        // Pulse effect
        particle.pulsePhase += particle.pulseSpeed;
        const pulseFactor = 1 + Math.sin(particle.pulsePhase) * 0.3;
        const currentSize = particle.baseSize * pulseFactor;

        // Glow effect
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, currentSize * 3
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.5, particle.color.replace(/[\d.]+\)$/, '0.2)'));
        gradient.addColorStop(1, 'transparent');

        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, currentSize * 3, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Core
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.connectionDistance) {
                    const opacity = (1 - distance / this.config.connectionDistance) * this.config.connectionOpacity;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(212, 165, 116, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticle(particle) {
        // Floating motion
        particle.angle += particle.angleSpeed;
        const floatX = Math.cos(particle.angle) * particle.floatRadius * 0.01;
        const floatY = Math.sin(particle.angle) * particle.floatRadius * 0.01;

        particle.x += particle.vx + floatX;
        particle.y += particle.vy + floatY;

        // Mouse interaction - gentle push
        if (this.mouse.x !== null && this.mouse.y !== null) {
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                particle.x += (dx / distance) * force * 0.5;
                particle.y += (dy / distance) * force * 0.5;
            }
        }

        // Wrap around edges
        if (particle.x < -10) particle.x = this.canvas.width + 10;
        if (particle.x > this.canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = this.canvas.height + 10;
        if (particle.y > this.canvas.height + 10) particle.y = -10;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections first (behind particles)
        this.drawConnections();

        // Update and draw particles
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
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if canvas exists
    const canvas = document.getElementById('hero-particles-canvas');
    if (canvas) {
        new HeroParticles('hero-particles-canvas');
    }
});
