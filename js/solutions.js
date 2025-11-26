/* =============================================
   EcoRoot - Solutions Section
   Click-based restoration visualization
   ============================================= */

class SolutionsSection {
    constructor() {
        this.canvas = document.getElementById('restorationCanvas');
        this.ctx = this.canvas?.getContext('2d');
        this.restorationStatus = document.getElementById('restorationStatus');
        this.activeBenefitsPanel = document.getElementById('activeBenefits');
        this.resetBtn = document.getElementById('resetSolutions');
        this.detailCards = document.querySelectorAll('.solution-details .detail-card');
        this.container = document.querySelector('.restoration-visualization');

        this.activeMethods = new Set();
        this.plants = [];
        this.microbes = [];
        this.compostPiles = [];
        this.recyclingBins = [];
        this.coverCrops = [];
        this.cleanupParticles = [];
        this.healthLevel = 10; // Start polluted
        this.animationId = null;
        this.groundY = 0;

        this.solutionData = {
            phytoremediation: {
                name: 'Phytoremediation',
                icon: '🌻',
                benefits: [
                    'Plants absorb heavy metals from soil',
                    'Natural, sustainable cleanup method',
                    'Improves soil structure and biodiversity'
                ],
                color: '#FFD700'
            },
            composting: {
                name: 'Composting',
                icon: '🍂',
                benefits: [
                    'Organic waste becomes nutrient-rich fertilizer',
                    'Reduces methane from landfills',
                    'Adds beneficial microorganisms to soil'
                ],
                color: '#8B4513'
            },
            bioremediation: {
                name: 'Bioremediation',
                icon: '🦠',
                benefits: [
                    'Microbes break down toxic pollutants',
                    'Works on oil, pesticides, heavy metals',
                    'Cost-effective natural solution'
                ],
                color: '#4CAF50'
            },
            recycling: {
                name: 'Recycling',
                icon: '♻️',
                benefits: [
                    'Prevents waste from reaching soil',
                    'Reduces need for raw materials',
                    'Saves energy and reduces pollution'
                ],
                color: '#2196F3'
            },
            segregation: {
                name: 'Waste Segregation',
                icon: '🗂️',
                benefits: [
                    'Separates hazardous from regular waste',
                    'Enables proper disposal methods',
                    'Makes recycling more efficient'
                ],
                color: '#FF9800'
            },
            covercrops: {
                name: 'Cover Crops',
                icon: '🌿',
                benefits: [
                    'Prevents soil erosion',
                    'Adds organic matter when plowed',
                    'Reduces need for chemicals'
                ],
                color: '#4CAF50'
            }
        };

        if (this.canvas) {
            this.init();
        }
    }

    init() {
        this.setupCanvas();
        this.setupClickHandlers();
        this.setupResetButton();
        this.createPollutedScene();
        this.animate();
    }

    setupCanvas() {
        this.resize();
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.resize(), 200);
        });
    }

    resize() {
        if (!this.container) return;
        
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.groundY = this.height * 0.35;
        this.createPollutedScene();
    }

    createPollutedScene() {
        // Start with polluted soil - no plants, some pollution particles
        this.plants = [];
        this.microbes = [];
        this.compostPiles = [];
        this.recyclingBins = [];
        this.coverCrops = [];
        this.cleanupParticles = [];
        
        // Add initial pollution markers
        for (let i = 0; i < 15; i++) {
            this.cleanupParticles.push({
                x: Math.random() * this.width,
                y: this.groundY + 20 + Math.random() * 80,
                size: 3 + Math.random() * 5,
                type: 'pollution',
                opacity: 0.6,
                color: '#8B4513'
            });
        }
    }

    setupClickHandlers() {
        const methodItems = document.querySelectorAll('.method-item');
        
        methodItems.forEach(item => {
            item.addEventListener('click', () => {
                const methodType = item.dataset.method;
                this.toggleMethod(methodType, item);
            });
        });
    }

    toggleMethod(type, element) {
        if (this.activeMethods.has(type)) {
            // Deactivate
            this.activeMethods.delete(type);
            element.classList.remove('active');
            this.deactivateSolution(type);
        } else {
            // Activate
            this.activeMethods.add(type);
            element.classList.add('active');
            this.activateSolution(type);
        }
        
        this.updateBenefitsPanel();
        this.updateRestorationStatus();
        this.highlightDetailCard(type);
    }

    activateSolution(type) {
        switch(type) {
            case 'phytoremediation':
                this.startPhytoremediation();
                break;
            case 'composting':
                this.startComposting();
                break;
            case 'bioremediation':
                this.startBioremediation();
                break;
            case 'recycling':
                this.startRecycling();
                break;
            case 'segregation':
                this.startSegregation();
                break;
            case 'covercrops':
                this.startCoverCrops();
                break;
        }
    }

    deactivateSolution(type) {
        // Solutions persist but stop adding new elements
    }

    // ==========================================
    // PHYTOREMEDIATION - Growing sunflowers
    // ==========================================
    startPhytoremediation() {
        const plantCount = 8;
        for (let i = 0; i < plantCount; i++) {
            setTimeout(() => {
                this.plants.push({
                    x: (i + 1) * (this.width / (plantCount + 1)),
                    y: this.groundY,
                    height: 0,
                    maxHeight: 60 + Math.random() * 40,
                    petalSize: 0,
                    growing: true,
                    bloomDelay: 30 + i * 10
                });
            }, i * 200);
        }
    }

    updatePhytoremediation() {
        if (!this.activeMethods.has('phytoremediation')) return;

        this.plants.forEach(plant => {
            if (plant.growing && plant.height < plant.maxHeight) {
                plant.height += 0.5;
                
                if (plant.bloomDelay > 0) {
                    plant.bloomDelay--;
                } else if (plant.petalSize < 15) {
                    plant.petalSize += 0.3;
                }
            }
            
            // Cleanup pollution nearby
            if (plant.height > 30 && Math.random() < 0.02) {
                this.cleanupParticles = this.cleanupParticles.filter(p => {
                    const dist = Math.sqrt((p.x - plant.x) ** 2 + (p.y - plant.y) ** 2);
                    if (dist < 50 && p.type === 'pollution') {
                        p.opacity -= 0.1;
                        return p.opacity > 0;
                    }
                    return true;
                });
            }
        });
    }

    // ==========================================
    // COMPOSTING - Compost piles with steam
    // ==========================================
    startComposting() {
        const pileX = this.width * 0.25;
        this.compostPiles.push({
            x: pileX,
            y: this.groundY + 10,
            size: 0,
            maxSize: 40,
            steam: [],
            nutrients: 0
        });
    }

    updateComposting() {
        if (!this.activeMethods.has('composting')) return;

        this.compostPiles.forEach(pile => {
            if (pile.size < pile.maxSize) {
                pile.size += 0.3;
            }
            
            // Generate steam
            if (Math.random() < 0.1 && pile.size > 20) {
                pile.steam.push({
                    x: pile.x + (Math.random() - 0.5) * pile.size,
                    y: pile.y,
                    size: 5 + Math.random() * 10,
                    opacity: 0.6,
                    vy: -0.5 - Math.random()
                });
            }
            
            // Update steam
            pile.steam = pile.steam.filter(s => {
                s.y += s.vy;
                s.size += 0.2;
                s.opacity -= 0.01;
                return s.opacity > 0 && s.y > this.groundY - 100;
            });
            
            // Spread nutrients
            if (pile.size >= pile.maxSize && Math.random() < 0.05) {
                this.cleanupParticles.push({
                    x: pile.x + (Math.random() - 0.5) * 60,
                    y: pile.y + 20,
                    size: 4,
                    type: 'nutrient',
                    opacity: 0.8,
                    color: '#8B4513',
                    sinking: true,
                    targetY: this.groundY + 40 + Math.random() * 40
                });
            }
        });
        
        // Update nutrient particles
        this.cleanupParticles.forEach(p => {
            if (p.type === 'nutrient' && p.sinking && p.y < p.targetY) {
                p.y += 0.5;
            }
        });
    }

    // ==========================================
    // BIOREMEDIATION - Microbes eating pollution
    // ==========================================
    startBioremediation() {
        for (let i = 0; i < 20; i++) {
            this.microbes.push({
                x: Math.random() * this.width,
                y: this.groundY + 20 + Math.random() * 80,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: 3 + Math.random() * 3,
                opacity: 0.7,
                eating: false
            });
        }
    }

    updateBioremediation() {
        if (!this.activeMethods.has('bioremediation')) return;

        this.microbes.forEach(microbe => {
            // Random movement
            microbe.x += microbe.vx;
            microbe.y += microbe.vy;
            
            // Bounce off boundaries
            if (microbe.x < 0 || microbe.x > this.width) microbe.vx *= -1;
            if (microbe.y < this.groundY + 10 || microbe.y > this.height - 10) microbe.vy *= -1;
            
            // Find and eat pollution
            const nearbyPollution = this.cleanupParticles.find(p => {
                if (p.type !== 'pollution') return false;
                const dist = Math.sqrt((p.x - microbe.x) ** 2 + (p.y - microbe.y) ** 2);
                return dist < 20;
            });
            
            if (nearbyPollution) {
                microbe.eating = true;
                nearbyPollution.opacity -= 0.02;
                if (nearbyPollution.opacity <= 0) {
                    this.cleanupParticles = this.cleanupParticles.filter(p => p !== nearbyPollution);
                }
            } else {
                microbe.eating = false;
            }
        });
    }

    // ==========================================
    // RECYCLING - Recycling bins collecting waste
    // ==========================================
    startRecycling() {
        const binX = this.width * 0.75;
        this.recyclingBins.push({
            x: binX,
            y: this.groundY + 10,
            collected: 0,
            particles: []
        });
    }

    updateRecycling() {
        if (!this.activeMethods.has('recycling')) return;

        this.recyclingBins.forEach(bin => {
            // Attract waste particles
            if (Math.random() < 0.1 && bin.collected < 20) {
                bin.particles.push({
                    x: Math.random() * this.width,
                    y: 0,
                    targetX: bin.x,
                    targetY: bin.y,
                    emoji: ['📦', '🥫', '📰', '♻️'][Math.floor(Math.random() * 4)],
                    collected: false
                });
            }
            
            // Update particles
            bin.particles.forEach(p => {
                if (!p.collected) {
                    const dx = p.targetX - p.x;
                    const dy = p.targetY - p.y;
                    p.x += dx * 0.05;
                    p.y += dy * 0.05;
                    
                    if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
                        p.collected = true;
                        bin.collected++;
                    }
                }
            });
            
            bin.particles = bin.particles.filter(p => !p.collected);
        });
    }

    // ==========================================
    // SEGREGATION - Waste sorting
    // ==========================================
    startSegregation() {
        // Visual: sorting bins appear
        const bins = [
            { x: this.width * 0.15, type: 'organic', color: '#4CAF50' },
            { x: this.width * 0.35, type: 'plastic', color: '#2196F3' },
            { x: this.width * 0.55, type: 'metal', color: '#9E9E9E' }
        ];
        
        bins.forEach(binData => {
            this.recyclingBins.push({
                ...binData,
                y: this.groundY + 10,
                items: 0
            });
        });
    }

    // ==========================================
    // COVER CROPS - Protective plant layer
    // ==========================================
    startCoverCrops() {
        const cropCount = 25;
        for (let i = 0; i < cropCount; i++) {
            this.coverCrops.push({
                x: (i * this.width / cropCount) + Math.random() * 20,
                y: this.groundY,
                height: 0,
                maxHeight: 15 + Math.random() * 15,
                growing: true
            });
        }
    }

    updateCoverCrops() {
        if (!this.activeMethods.has('covercrops')) return;

        this.coverCrops.forEach(crop => {
            if (crop.growing && crop.height < crop.maxHeight) {
                crop.height += 0.2;
            }
        });
    }

    // ==========================================
    // DRAWING METHODS
    // ==========================================
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.drawSky();
        this.drawSun();
        this.drawGround();
        this.drawSoilLayers();
        this.drawPollutionParticles();
        this.drawCompostPiles();
        this.drawRecyclingBins();
        this.drawCoverCrops();
        this.drawPlants();
        this.drawMicrobes();
    }

    drawSky() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.groundY);
        
        // Sky improves as health increases
        const healthFactor = this.healthLevel / 100;
        
        if (healthFactor < 0.3) {
            gradient.addColorStop(0, '#A0826D');
            gradient.addColorStop(1, '#B0A090');
        } else if (healthFactor < 0.7) {
            gradient.addColorStop(0, '#B0C4DE');
            gradient.addColorStop(1, '#D0E0F0');
        } else {
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(1, '#E0F6FF');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.groundY);
    }

    drawSun() {
        const sunX = this.width - 80;
        const sunY = 60;
        const sunOpacity = 0.4 + (this.healthLevel / 100) * 0.5;
        
        this.ctx.save();
        this.ctx.globalAlpha = sunOpacity;
        
        // Sun glow
        const glow = this.ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 60);
        glow.addColorStop(0, 'rgba(255, 200, 50, 0.8)');
        glow.addColorStop(0.5, 'rgba(255, 200, 50, 0.2)');
        glow.addColorStop(1, 'transparent');
        this.ctx.fillStyle = glow;
        this.ctx.fillRect(sunX - 60, sunY - 60, 120, 120);
        
        // Sun body
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(sunX, sunY, 30, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }

    drawGround() {
        // Grass improves with health
        const healthFactor = this.healthLevel / 100;
        const grassColor = healthFactor < 0.3 ? '#8B7355' : 
                          healthFactor < 0.7 ? '#9ACD32' : '#6B8E4E';
        
        this.ctx.fillStyle = grassColor;
        this.ctx.fillRect(0, this.groundY, this.width, 20);
        
        // Draw grass blades if healthy enough
        if (healthFactor > 0.5) {
            this.ctx.strokeStyle = '#5A7A42';
            this.ctx.lineWidth = 2;
            for (let x = 0; x < this.width; x += 8) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, this.groundY);
                this.ctx.lineTo(x + 2, this.groundY - 8 - Math.random() * 5);
                this.ctx.stroke();
            }
        }
    }

    drawSoilLayers() {
        const soilTop = this.groundY + 20;
        const healthFactor = this.healthLevel / 100;
        
        // Topsoil gets lighter/healthier
        const topsoilColor = healthFactor < 0.3 ? '#4A3D30' : 
                            healthFactor < 0.7 ? '#6D4C41' : '#8D6E63';
        this.ctx.fillStyle = topsoilColor;
        this.ctx.fillRect(0, soilTop, this.width, 40);
        
        // Subsoil
        this.ctx.fillStyle = '#4E342E';
        this.ctx.fillRect(0, soilTop + 40, this.width, 60);
        
        // Deep soil
        this.ctx.fillStyle = '#3E2723';
        this.ctx.fillRect(0, soilTop + 100, this.width, this.height - soilTop - 100);
    }

    drawPollutionParticles() {
        this.cleanupParticles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawPlants() {
        this.plants.forEach(plant => {
            // Stem
            this.ctx.fillStyle = '#2E7D32';
            this.ctx.fillRect(plant.x - 3, plant.y - plant.height, 6, plant.height);
            
            // Sunflower head
            if (plant.petalSize > 0) {
                // Petals
                this.ctx.fillStyle = '#FFD700';
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI * 2) / 8;
                    const px = plant.x + Math.cos(angle) * plant.petalSize;
                    const py = plant.y - plant.height + Math.sin(angle) * plant.petalSize;
                    
                    this.ctx.beginPath();
                    this.ctx.ellipse(px, py, plant.petalSize * 0.4, plant.petalSize * 0.6, angle, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
                // Center
                this.ctx.fillStyle = '#8B4513';
                this.ctx.beginPath();
                this.ctx.arc(plant.x, plant.y - plant.height, plant.petalSize * 0.5, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }

    drawMicrobes() {
        this.microbes.forEach(microbe => {
            this.ctx.save();
            this.ctx.globalAlpha = microbe.opacity;
            
            // Microbe body
            this.ctx.fillStyle = microbe.eating ? '#4CAF50' : '#76FF03';
            this.ctx.beginPath();
            this.ctx.arc(microbe.x, microbe.y, microbe.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Flagella/movement lines
            if (microbe.eating) {
                this.ctx.strokeStyle = '#4CAF50';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(microbe.x, microbe.y);
                this.ctx.lineTo(microbe.x - microbe.vx * 3, microbe.y - microbe.vy * 3);
                this.ctx.stroke();
            }
            
            this.ctx.restore();
        });
    }

    drawCompostPiles() {
        this.compostPiles.forEach(pile => {
            // Compost pile
            this.ctx.fillStyle = '#8B4513';
            this.ctx.beginPath();
            this.ctx.ellipse(pile.x, pile.y, pile.size, pile.size * 0.6, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Leaves/organic matter texture
            this.ctx.fillStyle = '#654321';
            for (let i = 0; i < 5; i++) {
                const x = pile.x + (Math.random() - 0.5) * pile.size;
                const y = pile.y + (Math.random() - 0.5) * pile.size * 0.6;
                this.ctx.fillRect(x - 2, y - 2, 4, 4);
            }
            
            // Steam
            pile.steam.forEach(s => {
                this.ctx.save();
                this.ctx.globalAlpha = s.opacity;
                this.ctx.fillStyle = '#E0E0E0';
                this.ctx.beginPath();
                this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            });
        });
    }

    drawRecyclingBins() {
        this.recyclingBins.forEach(bin => {
            // Bin body
            this.ctx.fillStyle = bin.color || '#2196F3';
            this.ctx.fillRect(bin.x - 15, bin.y - 30, 30, 35);
            
            // Recycling symbol
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('♻️', bin.x, bin.y - 10);
            
            // Floating particles
            if (bin.particles) {
                bin.particles.forEach(p => {
                    if (!p.collected) {
                        this.ctx.font = '14px Arial';
                        this.ctx.fillText(p.emoji, p.x, p.y);
                    }
                });
            }
        });
    }

    drawCoverCrops() {
        this.coverCrops.forEach(crop => {
            this.ctx.strokeStyle = '#4CAF50';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(crop.x, crop.y);
            this.ctx.lineTo(crop.x + 2, crop.y - crop.height);
            this.ctx.stroke();
        });
    }

    // ==========================================
    // UI UPDATES
    // ==========================================
    updateBenefitsPanel() {
        if (!this.activeBenefitsPanel) return;

        if (this.activeMethods.size === 0) {
            this.activeBenefitsPanel.innerHTML = `
                <div class="no-benefits">
                    <div class="no-benefits-icon">🌱</div>
                    <p>Click a solution to see how it benefits the environment</p>
                </div>
            `;
            return;
        }

        let html = '';
        this.activeMethods.forEach(method => {
            const data = this.solutionData[method];
            if (data) {
                html += `
                    <div class="benefit-item">
                        <div class="benefit-title">${data.icon} ${data.name}</div>
                        <div class="benefit-description">
                            ${data.benefits.map(b => `• ${b}`).join('<br>')}
                        </div>
                    </div>
                `;
            }
        });
        
        this.activeBenefitsPanel.innerHTML = html;
    }

    updateRestorationStatus() {
        if (!this.restorationStatus) return;

        // Increase health based on active methods
        const targetHealth = 10 + (this.activeMethods.size * 15);
        if (this.healthLevel < targetHealth) {
            this.healthLevel = Math.min(100, this.healthLevel + 0.2);
        }

        const health = this.healthLevel;
        
        this.restorationStatus.classList.remove('improving', 'healthy');
        
        if (health < 30) {
            this.restorationStatus.textContent = '☠️ Severely Polluted';
        } else if (health < 60) {
            this.restorationStatus.textContent = '⚠️ Improving';
            this.restorationStatus.classList.add('improving');
        } else if (health < 85) {
            this.restorationStatus.textContent = '🌱 Recovering Well';
            this.restorationStatus.classList.add('improving');
        } else {
            this.restorationStatus.textContent = '🌿 Healthy Soil';
            this.restorationStatus.classList.add('healthy');
        }
    }

    highlightDetailCard(type) {
        this.detailCards.forEach(card => {
            const cardType = card.dataset.solution;
            if (this.activeMethods.has(cardType)) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    setupResetButton() {
        if (!this.resetBtn) return;
        
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    reset() {
        // Clear active methods
        this.activeMethods.clear();
        
        // Reset UI
        document.querySelectorAll('.method-item').forEach(item => {
            item.classList.remove('active');
        });
        
        this.detailCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Reset health
        this.healthLevel = 10;
        
        // Recreate polluted scene
        this.createPollutedScene();
        this.updateBenefitsPanel();
        this.updateRestorationStatus();
    }

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    animate() {
        // Update all active solutions
        this.updatePhytoremediation();
        this.updateComposting();
        this.updateBioremediation();
        this.updateRecycling();
        this.updateCoverCrops();
        
        // Update restoration status periodically
        if (this.activeMethods.size > 0) {
            this.updateRestorationStatus();
        }
        
        // Draw everything
        this.draw();
        
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
    
    // Add interactive card toggle functionality
    const solutionCards = document.querySelectorAll('.solution-card');
    solutionCards.forEach(card => {
        card.addEventListener('click', () => {
            // Toggle expanded state
            const isExpanded = card.classList.contains('expanded');
            
            // Close other cards
            solutionCards.forEach(c => c.classList.remove('expanded'));
            
            // Toggle current card
            if (!isExpanded) {
                card.classList.add('expanded');
            }
        });
    });
});
