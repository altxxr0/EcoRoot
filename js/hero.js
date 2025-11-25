/* =============================================
   EcoRoot - Hero Section
   Scroll-triggered soil pollution animation
   ============================================= */

class HeroSection {
    constructor() {
        this.canvas = Utils.$('#soilCanvas');
        this.ctx = this.canvas?.getContext('2d');
        this.pollutionOverlay = Utils.$('#pollutionOverlay');
        this.heroStats = Utils.$('#heroStats');
        this.scrollIndicator = Utils.$('.scroll-indicator');
        
        this.pollutionLevel = 0;
        this.particles = [];
        this.plants = [];
        this.worms = [];
        
        this.colors = {
            skyClean: '#87CEEB',
            skyPolluted: '#6B7B8C',
            grassClean: '#7CB518',
            grassPolluted: '#4A5D3A',
            soilHealthy: '#5D4E37',
            soilPolluted: '#2C2420',
            soilLayer1: '#8B7355',
            soilLayer2: '#6B5344',
            soilLayer3: '#4A3D30'
        };

        if (this.canvas) {
            this.init();
        }
    }

    init() {
        this.setupCanvas();
        this.createParticles();
        this.createPlants();
        this.createWorms();
        this.bindEvents();
        this.animate();
    }

    setupCanvas() {
        this.resize();
        window.addEventListener('resize', Utils.debounce(() => this.resize(), 200));
    }

    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    createParticles() {
        // Create soil particles
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Utils.random(0, this.width),
                y: Utils.random(this.height * 0.3, this.height),
                size: Utils.random(2, 6),
                baseY: 0,
                speed: Utils.random(0.5, 2),
                opacity: Utils.random(0.3, 0.8)
            });
        }
    }

    createPlants() {
        const plantCount = Math.floor(this.width / 80);
        for (let i = 0; i < plantCount; i++) {
            this.plants.push({
                x: i * 80 + Utils.random(-20, 20),
                baseHeight: Utils.random(30, 60),
                currentHeight: Utils.random(30, 60),
                swayOffset: Utils.random(0, Math.PI * 2),
                type: Utils.randomInt(0, 2) // 0: grass, 1: flower, 2: small tree
            });
        }
    }

    createWorms() {
        for (let i = 0; i < 8; i++) {
            this.worms.push({
                x: Utils.random(50, this.width - 50),
                y: Utils.random(this.height * 0.5, this.height * 0.8),
                segments: [],
                speed: Utils.random(0.3, 0.8),
                direction: Utils.random(0, Math.PI * 2),
                length: Utils.randomInt(5, 10),
                visible: true
            });
            
            // Initialize worm segments
            for (let j = 0; j < this.worms[i].length; j++) {
                this.worms[i].segments.push({
                    x: this.worms[i].x - j * 4,
                    y: this.worms[i].y
                });
            }
        }
    }

    bindEvents() {
        window.addEventListener('scroll', Utils.throttle(() => this.onScroll(), 16));
    }

    onScroll() {
        const scrollY = window.scrollY;
        const heroHeight = Utils.$('#hero').offsetHeight;
        const scrollProgress = Math.min(scrollY / (heroHeight * 0.8), 1);
        
        this.pollutionLevel = scrollProgress;
        
        // Update pollution overlay opacity
        if (this.pollutionOverlay) {
            this.pollutionOverlay.style.setProperty('--pollution-opacity', scrollProgress * 0.6);
        }

        // Show stats when scrolled
        if (this.heroStats && scrollProgress > 0.3) {
            this.heroStats.classList.add('visible');
            this.animateStats();
        }

        // Hide scroll indicator
        if (this.scrollIndicator && scrollProgress > 0.1) {
            this.scrollIndicator.style.opacity = 1 - scrollProgress * 2;
        }

        // Update worm visibility based on pollution
        this.worms.forEach(worm => {
            worm.visible = scrollProgress < 0.7;
        });
    }

    animateStats() {
        const statNumbers = Utils.$$('.hero-stats .stat-number');
        statNumbers.forEach(stat => {
            if (stat.dataset.animated) return;
            stat.dataset.animated = 'true';
            const target = parseInt(stat.dataset.target);
            Utils.animateCounter(stat, target, 2000);
        });
    }

    lerpColor(color1, color2, amount) {
        const rgb1 = Utils.hexToRgb(color1);
        const rgb2 = Utils.hexToRgb(color2);
        
        if (!rgb1 || !rgb2) return color1;

        const r = Math.round(Utils.lerp(rgb1.r, rgb2.r, amount));
        const g = Math.round(Utils.lerp(rgb1.g, rgb2.g, amount));
        const b = Math.round(Utils.lerp(rgb1.b, rgb2.b, amount));

        return Utils.rgbToHex(r, g, b);
    }

    drawSky() {
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.height * 0.35);
        const skyColor = this.lerpColor(this.colors.skyClean, this.colors.skyPolluted, this.pollutionLevel);
        
        skyGradient.addColorStop(0, skyColor);
        skyGradient.addColorStop(1, this.lerpColor('#E0F0FF', '#9AA5B1', this.pollutionLevel));
        
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.width, this.height * 0.35);
    }

    drawGrass() {
        const grassY = this.height * 0.3;
        const grassHeight = this.height * 0.08;
        const grassColor = this.lerpColor(this.colors.grassClean, this.colors.grassPolluted, this.pollutionLevel);
        
        // Grass base
        const grassGradient = this.ctx.createLinearGradient(0, grassY, 0, grassY + grassHeight);
        grassGradient.addColorStop(0, grassColor);
        grassGradient.addColorStop(1, this.lerpColor('#4A7C59', '#3A4D3A', this.pollutionLevel));
        
        this.ctx.fillStyle = grassGradient;
        this.ctx.fillRect(0, grassY, this.width, grassHeight);

        // Grass blades
        const time = Date.now() / 1000;
        this.ctx.strokeStyle = grassColor;
        this.ctx.lineWidth = 2;

        for (let i = 0; i < this.width; i += 8) {
            const sway = Math.sin(time + i * 0.05) * (3 - this.pollutionLevel * 2);
            const bladeHeight = 15 * (1 - this.pollutionLevel * 0.5);
            
            this.ctx.beginPath();
            this.ctx.moveTo(i, grassY + 5);
            this.ctx.quadraticCurveTo(i + sway, grassY - bladeHeight / 2, i + sway * 2, grassY - bladeHeight);
            this.ctx.stroke();
        }
    }

    drawSoilLayers() {
        const startY = this.height * 0.4;
        const layerHeight = (this.height - startY) / 3;

        // Clean, modern soil layers
        // Topsoil
        const topsoilColor = this.lerpColor('#5D7A4A', this.colors.soilPolluted, this.pollutionLevel);
        this.ctx.fillStyle = topsoilColor;
        this.ctx.fillRect(0, startY, this.width, layerHeight);

        // Middle layer
        const middleColor = this.lerpColor('#5D4E37', '#3A3028', this.pollutionLevel);
        this.ctx.fillStyle = middleColor;
        this.ctx.fillRect(0, startY + layerHeight, this.width, layerHeight);

        // Deep soil
        const deepColor = this.lerpColor('#3D2B1F', '#2A2420', this.pollutionLevel);
        this.ctx.fillStyle = deepColor;
        this.ctx.fillRect(0, startY + layerHeight * 2, this.width, layerHeight);

        // Add subtle texture
        this.drawSoilTexture(startY);
        
        // Add clean layer lines
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, startY + layerHeight);
        this.ctx.lineTo(this.width, startY + layerHeight);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(0, startY + layerHeight * 2);
        this.ctx.lineTo(this.width, startY + layerHeight * 2);
        this.ctx.stroke();
    }

    drawSoilTexture(startY) {
        // Minimal, subtle texture
        this.particles.forEach((particle, i) => {
            const y = startY + 20 + ((i * 7) % (this.height - startY - 40));
            
            // Particles fade with pollution
            const particleOpacity = particle.opacity * 0.5 * (1 - this.pollutionLevel * 0.5);
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, y, particle.size * 0.7, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(100, 85, 70, ${particleOpacity})`;
            this.ctx.fill();
        });
    }

    // Simplified - no cartoon roots
    drawRoots(startY) {
        // Removed cartoon roots for cleaner design
    }

    drawPlants() {
        // Simplified minimal plant indicators
        const grassY = this.height * 0.38;
        const healthFactor = 1 - this.pollutionLevel;
        
        if (healthFactor < 0.2) return; // No plants when heavily polluted

        // Simple grass line at surface
        const grassColor = this.lerpColor('#5D7A4A', '#4A4A40', this.pollutionLevel);
        this.ctx.fillStyle = grassColor;
        this.ctx.fillRect(0, grassY - 5, this.width, 8);
        
        // Minimal plant indicators - small dots
        this.plants.forEach(plant => {
            if (healthFactor < 0.3) return;
            
            const size = 3 * healthFactor;
            const plantColor = this.lerpColor('#4A7C59', '#5A5040', this.pollutionLevel);
            
            this.ctx.beginPath();
            this.ctx.arc(plant.x, grassY - 8, size, 0, Math.PI * 2);
            this.ctx.fillStyle = plantColor;
            this.ctx.fill();
        });
    }

    drawWorms() {
        this.worms.forEach(worm => {
            if (!worm.visible) return;

            const wormOpacity = 1 - this.pollutionLevel;
            if (wormOpacity < 0.1) return;

            // Update worm position
            worm.direction += (Math.random() - 0.5) * 0.1;
            worm.x += Math.cos(worm.direction) * worm.speed;
            worm.y += Math.sin(worm.direction) * worm.speed;

            // Keep worm in bounds
            const minY = this.height * 0.4;
            const maxY = this.height * 0.9;
            
            if (worm.x < 20) worm.direction = 0;
            if (worm.x > this.width - 20) worm.direction = Math.PI;
            if (worm.y < minY) worm.direction = Math.PI / 2;
            if (worm.y > maxY) worm.direction = -Math.PI / 2;

            // Update segments
            worm.segments[0] = { x: worm.x, y: worm.y };
            for (let i = 1; i < worm.segments.length; i++) {
                const dx = worm.segments[i].x - worm.segments[i - 1].x;
                const dy = worm.segments[i].y - worm.segments[i - 1].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist > 4) {
                    worm.segments[i].x = worm.segments[i - 1].x + (dx / dist) * 4;
                    worm.segments[i].y = worm.segments[i - 1].y + (dy / dist) * 4;
                }
            }

            // Draw worm
            this.ctx.strokeStyle = `rgba(180, 120, 100, ${wormOpacity * 0.8})`;
            this.ctx.lineWidth = 4;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            
            this.ctx.beginPath();
            this.ctx.moveTo(worm.segments[0].x, worm.segments[0].y);
            
            for (let i = 1; i < worm.segments.length; i++) {
                this.ctx.lineTo(worm.segments[i].x, worm.segments[i].y);
            }
            
            this.ctx.stroke();
        });
    }

    drawPollutionEffects() {
        if (this.pollutionLevel < 0.1) return;

        // Pollution particles falling
        const particleCount = Math.floor(this.pollutionLevel * 30);
        const time = Date.now() / 500;

        for (let i = 0; i < particleCount; i++) {
            const x = (i * 50 + time * 20) % this.width;
            const y = ((time * 30 + i * 20) % this.height);
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(60, 50, 40, ${this.pollutionLevel * 0.3})`;
            this.ctx.fill();
        }

        // Toxic puddles
        if (this.pollutionLevel > 0.4) {
            for (let i = 0; i < 3; i++) {
                const x = (i + 1) * this.width / 4;
                const y = this.height * 0.45;
                const size = 20 + this.pollutionLevel * 30;
                
                const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
                gradient.addColorStop(0, `rgba(80, 100, 60, ${this.pollutionLevel * 0.4})`);
                gradient.addColorStop(1, 'transparent');
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.ellipse(x, y, size, size * 0.3, 0, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.drawSky();
        this.drawGrass();
        this.drawSoilLayers();
        this.drawPlants();
        this.drawWorms();
        this.drawPollutionEffects();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.heroSection = new HeroSection();
});
