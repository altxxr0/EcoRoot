/* =============================================
   EcoRoot - Solutions Section
   Drag-and-drop remediation techniques
   ============================================= */

class SolutionsSection {
    constructor() {
        this.canvas = Utils.$('#solutionCanvas');
        this.ctx = this.canvas?.getContext('2d');
        this.toolsContainer = Utils.$('#solutionTools');
        this.healthFill = Utils.$('#healthFill');
        this.healthStatus = Utils.$('#healthStatus');
        this.appliedList = Utils.$('#appliedList');
        this.resetBtn = Utils.$('#resetSolutions');
        this.soilContainer = Utils.$('.solution-soil-container');

        this.soilHealth = 10; // Start with severely polluted soil
        this.appliedSolutions = [];
        this.plants = [];
        this.particles = [];
        this.animationId = null;

        this.solutions = {
            phytoremediation: {
                name: 'Phytoremediation',
                icon: '🌻',
                effect: 15,
                description: 'Using plants to absorb and break down pollutants'
            },
            composting: {
                name: 'Composting',
                icon: '🍂',
                effect: 20,
                description: 'Adding organic matter to restore soil health'
            },
            bioremediation: {
                name: 'Bioremediation',
                icon: '🦠',
                effect: 25,
                description: 'Microorganisms that consume pollutants'
            },
            covercrops: {
                name: 'Cover Crops',
                icon: '🌿',
                effect: 10,
                description: 'Plants that protect and enrich soil'
            },
            soilamendments: {
                name: 'Soil Amendments',
                icon: 'ite',
                effect: 18,
                description: 'Biochar and lime to neutralize toxins'
            },
            filtration: {
                name: 'Filtration Systems',
                icon: '🔬',
                effect: 12,
                description: 'Removing contaminants from water'
            }
        };

        if (this.canvas) {
            this.init();
        }
    }

    init() {
        this.setupCanvas();
        this.setupDragAndDrop();
        this.setupResetButton();
        this.createInitialState();
        this.animate();
    }

    setupCanvas() {
        this.resize();
        window.addEventListener('resize', Utils.debounce(() => this.resize(), 200));
    }

    resize() {
        if (!this.soilContainer) return;
        this.canvas.width = this.soilContainer.offsetWidth;
        this.canvas.height = this.soilContainer.offsetHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    createInitialState() {
        // Create some pollution particles
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: Utils.random(0, this.width),
                y: Utils.random(this.height * 0.3, this.height),
                size: Utils.random(3, 8),
                opacity: Utils.random(0.3, 0.7),
                type: 'pollution'
            });
        }
    }

    setupDragAndDrop() {
        const tools = Utils.$$('.tool-item', this.toolsContainer);
        
        tools.forEach(tool => {
            tool.addEventListener('dragstart', (e) => this.handleDragStart(e));
            tool.addEventListener('dragend', (e) => this.handleDragEnd(e));
            
            // Touch events for mobile
            tool.addEventListener('touchstart', (e) => this.handleTouchStart(e));
            tool.addEventListener('touchmove', (e) => this.handleTouchMove(e));
            tool.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        });

        // Drop zone events
        this.soilContainer.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.soilContainer.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.soilContainer.addEventListener('drop', (e) => this.handleDrop(e));
    }

    handleDragStart(e) {
        const tool = e.target.closest('.tool-item');
        if (!tool || tool.classList.contains('applied')) return;
        
        tool.classList.add('dragging');
        e.dataTransfer.setData('text/plain', tool.dataset.solution);
        e.dataTransfer.effectAllowed = 'move';
    }

    handleDragEnd(e) {
        const tool = e.target.closest('.tool-item');
        if (tool) {
            tool.classList.remove('dragging');
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.soilContainer.classList.add('drag-over');
    }

    handleDragLeave(e) {
        if (!this.soilContainer.contains(e.relatedTarget)) {
            this.soilContainer.classList.remove('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        this.soilContainer.classList.remove('drag-over');
        
        const solutionType = e.dataTransfer.getData('text/plain');
        this.applySolution(solutionType);
    }

    // Touch event handlers
    handleTouchStart(e) {
        const tool = e.target.closest('.tool-item');
        if (!tool || tool.classList.contains('applied')) return;
        
        this.touchTool = tool;
        this.touchClone = tool.cloneNode(true);
        this.touchClone.style.position = 'fixed';
        this.touchClone.style.zIndex = '1000';
        this.touchClone.style.opacity = '0.8';
        this.touchClone.style.pointerEvents = 'none';
        this.touchClone.style.width = `${tool.offsetWidth}px`;
        document.body.appendChild(this.touchClone);
        
        const touch = e.touches[0];
        this.updateTouchClonePosition(touch);
    }

    handleTouchMove(e) {
        if (!this.touchClone) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        this.updateTouchClonePosition(touch);
        
        const containerRect = this.soilContainer.getBoundingClientRect();
        const isOverContainer = (
            touch.clientX >= containerRect.left &&
            touch.clientX <= containerRect.right &&
            touch.clientY >= containerRect.top &&
            touch.clientY <= containerRect.bottom
        );
        
        this.soilContainer.classList.toggle('drag-over', isOverContainer);
    }

    handleTouchEnd(e) {
        if (!this.touchClone) return;
        
        const touch = e.changedTouches[0];
        const containerRect = this.soilContainer.getBoundingClientRect();
        const isOverContainer = (
            touch.clientX >= containerRect.left &&
            touch.clientX <= containerRect.right &&
            touch.clientY >= containerRect.top &&
            touch.clientY <= containerRect.bottom
        );
        
        if (isOverContainer && this.touchTool) {
            this.applySolution(this.touchTool.dataset.solution);
        }
        
        this.soilContainer.classList.remove('drag-over');
        this.touchClone.remove();
        this.touchClone = null;
        this.touchTool = null;
    }

    updateTouchClonePosition(touch) {
        if (!this.touchClone) return;
        this.touchClone.style.left = `${touch.clientX - 50}px`;
        this.touchClone.style.top = `${touch.clientY - 30}px`;
    }

    applySolution(type) {
        if (this.appliedSolutions.includes(type)) return;
        
        const solution = this.solutions[type];
        if (!solution) return;

        this.appliedSolutions.push(type);
        this.soilHealth = Math.min(100, this.soilHealth + solution.effect);

        // Update UI
        this.updateHealthIndicator();
        this.addToAppliedList(solution);
        this.markToolAsApplied(type);
        this.createHealingEffect(type);
        
        // Add plants if health is improving
        if (this.soilHealth > 30) {
            this.addPlants(type);
        }

        // Remove pollution particles
        this.removePollutionParticles(solution.effect / 5);
    }

    updateHealthIndicator() {
        this.healthFill.style.width = `${this.soilHealth}%`;
        
        // Update status text and color
        let status, className;
        
        if (this.soilHealth < 30) {
            status = 'Severely Polluted';
            className = '';
        } else if (this.soilHealth < 60) {
            status = 'Recovering';
            className = 'recovering';
        } else if (this.soilHealth < 80) {
            status = 'Improving';
            className = 'recovering';
        } else {
            status = 'Healthy';
            className = 'healthy';
        }
        
        this.healthStatus.textContent = status;
        this.healthStatus.className = `health-status ${className}`;
    }

    addToAppliedList(solution) {
        const li = Utils.createElement('li', {}, [
            Utils.createElement('span', {}, [solution.icon]),
            solution.name
        ]);
        
        li.style.animation = 'fadeInUp 0.3s ease forwards';
        this.appliedList.appendChild(li);
    }

    markToolAsApplied(type) {
        const tool = Utils.$(`.tool-item[data-solution="${type}"]`);
        if (tool) {
            tool.classList.add('applied');
            tool.setAttribute('draggable', 'false');
        }
    }

    createHealingEffect(type) {
        // Create visual healing particles
        for (let i = 0; i < 15; i++) {
            const x = Utils.random(50, this.width - 50);
            const y = Utils.random(this.height * 0.3, this.height * 0.8);
            
            this.particles.push({
                x,
                y,
                size: Utils.random(4, 10),
                opacity: 1,
                type: 'healing',
                life: 60,
                color: this.getHealingColor(type)
            });
        }
    }

    getHealingColor(type) {
        const colors = {
            phytoremediation: '#7CB518',
            composting: '#8B7355',
            bioremediation: '#4A90A4',
            covercrops: '#4A7C59',
            soilamendments: '#D4A03B',
            filtration: '#87CEEB'
        };
        return colors[type] || '#4A7C59';
    }

    addPlants(type) {
        const plantCount = Math.floor(Utils.random(2, 5));
        
        for (let i = 0; i < plantCount; i++) {
            this.plants.push({
                x: Utils.random(50, this.width - 50),
                baseY: this.height * 0.28,
                height: 0,
                targetHeight: Utils.random(20, 50),
                swayOffset: Utils.random(0, Math.PI * 2),
                type: type,
                color: this.getHealingColor(type)
            });
        }
    }

    removePollutionParticles(count) {
        const pollutionParticles = this.particles.filter(p => p.type === 'pollution');
        const toRemove = Math.min(count, pollutionParticles.length);
        
        for (let i = 0; i < toRemove; i++) {
            const index = this.particles.findIndex(p => p.type === 'pollution');
            if (index > -1) {
                this.particles.splice(index, 1);
            }
        }
    }

    setupResetButton() {
        if (!this.resetBtn) return;
        
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    reset() {
        this.soilHealth = 10;
        this.appliedSolutions = [];
        this.plants = [];
        this.particles = [];
        
        // Reset UI
        this.healthFill.style.width = '10%';
        this.healthStatus.textContent = 'Severely Polluted';
        this.healthStatus.className = 'health-status';
        this.appliedList.innerHTML = '';
        
        // Reset tools
        Utils.$$('.tool-item', this.toolsContainer).forEach(tool => {
            tool.classList.remove('applied');
            tool.setAttribute('draggable', 'true');
        });
        
        // Recreate pollution particles
        this.createInitialState();
    }

    drawBackground() {
        const healthFactor = this.soilHealth / 100;
        
        // Sky gradient
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.height * 0.25);
        const skyColor = this.lerpColor('#5a9ab3', '#87CEEB', healthFactor);
        skyGradient.addColorStop(0, skyColor);
        skyGradient.addColorStop(1, this.lerpColor('#4a8aa3', '#E0F0FF', healthFactor));
        
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.width, this.height * 0.25);

        // Soil gradient
        const soilGradient = this.ctx.createLinearGradient(0, this.height * 0.25, 0, this.height);
        const topSoilColor = this.lerpColor('#3a3028', '#5D4E37', healthFactor);
        const deepSoilColor = this.lerpColor('#2c2420', '#4A3D30', healthFactor);
        
        soilGradient.addColorStop(0, this.lerpColor('#3A4D3A', '#4A7C59', healthFactor)); // Grass
        soilGradient.addColorStop(0.05, topSoilColor);
        soilGradient.addColorStop(0.5, deepSoilColor);
        soilGradient.addColorStop(1, this.lerpColor('#1e1a16', '#3D2B1F', healthFactor));
        
        this.ctx.fillStyle = soilGradient;
        this.ctx.fillRect(0, this.height * 0.25, this.width, this.height * 0.75);
    }

    drawPlants() {
        const time = Date.now() / 1000;

        this.plants.forEach(plant => {
            // Grow plants gradually
            if (plant.height < plant.targetHeight) {
                plant.height += 0.5;
            }

            if (plant.height < 1) return;

            const sway = Math.sin(time + plant.swayOffset) * 3;
            
            this.ctx.save();
            this.ctx.translate(plant.x, plant.baseY);

            // Stem
            this.ctx.strokeStyle = plant.color;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.quadraticCurveTo(sway / 2, -plant.height / 2, sway, -plant.height);
            this.ctx.stroke();

            // Leaf/flower at top
            this.ctx.fillStyle = plant.color;
            this.ctx.beginPath();
            this.ctx.arc(sway, -plant.height, 5, 0, Math.PI * 2);
            this.ctx.fill();

            // Side leaves
            for (let i = 1; i <= 2; i++) {
                const leafY = -plant.height * (i / 3);
                const leafSway = sway * (i / 3);
                
                this.ctx.beginPath();
                this.ctx.ellipse(leafSway + 5, leafY, 6, 3, 0.3, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.beginPath();
                this.ctx.ellipse(leafSway - 5, leafY - 3, 6, 3, -0.3, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        });
    }

    drawParticles() {
        this.particles.forEach((particle, index) => {
            if (particle.type === 'pollution') {
                // Pollution particles
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(60, 50, 40, ${particle.opacity})`;
                this.ctx.fill();
            } else if (particle.type === 'healing') {
                // Healing particles with life
                particle.life--;
                particle.opacity = particle.life / 60;
                particle.y -= 0.5;
                particle.size *= 0.98;

                if (particle.life <= 0) {
                    this.particles.splice(index, 1);
                    return;
                }

                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = particle.color.replace(')', `, ${particle.opacity})`).replace('rgb', 'rgba');
                
                // Add glow effect
                const gradient = this.ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 2
                );
                gradient.addColorStop(0, particle.color.replace(')', `, ${particle.opacity})`).replace('rgb', 'rgba'));
                gradient.addColorStop(1, 'transparent');
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            }
        });
    }

    drawWorms() {
        // Only show worms in healthier soil
        if (this.soilHealth < 40) return;

        const wormCount = Math.floor(this.soilHealth / 30);
        const time = Date.now() / 1000;

        for (let i = 0; i < wormCount; i++) {
            const x = (this.width / (wormCount + 1)) * (i + 1);
            const y = this.height * 0.5 + Math.sin(time + i) * 20;

            this.ctx.strokeStyle = `rgba(180, 120, 100, ${this.soilHealth / 150})`;
            this.ctx.lineWidth = 3;
            this.ctx.lineCap = 'round';
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            
            for (let j = 1; j <= 5; j++) {
                const segX = x + j * 4;
                const segY = y + Math.sin(time * 2 + i + j) * 3;
                this.ctx.lineTo(segX, segY);
            }
            
            this.ctx.stroke();
        }
    }

    drawSunshine() {
        if (this.soilHealth < 50) return;

        const opacity = (this.soilHealth - 50) / 100;
        const gradient = this.ctx.createRadialGradient(
            this.width * 0.8, 20, 0,
            this.width * 0.8, 20, 100
        );
        
        gradient.addColorStop(0, `rgba(255, 220, 100, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(255, 200, 50, ${opacity * 0.3})`);
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(this.width * 0.5, 0, this.width * 0.5, 150);
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

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.drawBackground();
        this.drawSunshine();
        this.drawParticles();
        this.drawPlants();
        this.drawWorms();
        
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
    window.solutionsSection = new SolutionsSection();
});
