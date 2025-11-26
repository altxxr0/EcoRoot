/* =============================================
   EcoRoot - Causes Section
   Click-based pollution visualization with animated environment
   ============================================= */

class CausesSection {
    constructor() {
        this.canvas = document.getElementById('environmentCanvas');
        this.ctx = this.canvas?.getContext('2d');
        this.envStatus = document.getElementById('envStatus');
        this.activeEffectsPanel = document.getElementById('activeEffects');
        this.resetBtn = document.getElementById('resetCauses');
        this.detailCards = document.querySelectorAll('.detail-card');
        this.container = document.querySelector('.environment-visualization');

        this.activeSources = new Set();
        this.trees = [];
        this.mine = null;
        this.factory = null;
        this.contamination = [];
        this.wasteItems = [];
        this.plasticItems = [];
        this.chemicalClouds = [];
        this.animationId = null;
        this.groundY = 0;

        this.pollutionData = {
            deforestation: {
                name: 'Deforestation',
                icon: '🌲',
                effects: [
                    'Soil exposed to erosion',
                    'Loss of nutrients and organic matter',
                    'Habitat destruction for soil organisms'
                ],
                color: '#8B4513'
            },
            mining: {
                name: 'Mining Runoff',
                icon: '⛏️',
                effects: [
                    'Acid drainage into soil',
                    'Heavy metal contamination',
                    'Groundwater pollution'
                ],
                color: '#FF6B35'
            },
            industrial: {
                name: 'Industrial Waste',
                icon: '🏭',
                effects: [
                    'Toxic chemical release',
                    'Heavy metal accumulation',
                    'Air and soil contamination'
                ],
                color: '#4A4A4A'
            },
            pesticides: {
                name: 'Pesticides',
                icon: '🧪',
                effects: [
                    'Kills beneficial soil organisms',
                    'Chemical buildup in soil',
                    'Contaminates food chain'
                ],
                color: '#9ACD32'
            },
            waste: {
                name: 'Improper Waste',
                icon: '🗑️',
                effects: [
                    'Leachate seeps into soil',
                    'Pathogen contamination',
                    'Toxic substance release'
                ],
                color: '#8B7355'
            },
            plastic: {
                name: 'Plastic Waste',
                icon: '🛢️',
                effects: [
                    'Microplastic infiltration',
                    'Harmful additive leaching',
                    'Disrupts soil organisms'
                ],
                color: '#FF69B4'
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
        this.createInitialScene();
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
        this.createInitialScene();
    }

    createInitialScene() {
        // Create healthy trees
        this.trees = [];
        const treeCount = Math.floor(this.width / 80);
        for (let i = 0; i < treeCount; i++) {
            this.trees.push({
                x: 40 + i * ((this.width - 80) / Math.max(1, treeCount - 1)),
                y: this.groundY,
                height: 60 + Math.random() * 40,
                width: 15 + Math.random() * 15,
                alive: true,
                falling: false,
                fallAngle: 0,
                fallDirection: Math.random() > 0.5 ? 1 : -1,
                opacity: 1,
                stump: false
            });
        }

        // Create mine (initially hidden)
        this.mine = {
            x: this.width * 0.2,
            y: this.groundY + 10,
            active: false,
            acidLevel: 0,
            acidDroplets: [],
            poolSize: 0
        };

        // Create factory (initially hidden)
        this.factory = {
            x: this.width * 0.8,
            y: this.groundY - 60,
            active: false,
            smokeParticles: [],
            wasteBarrels: []
        };

        // Clear pollution effects
        this.contamination = [];
        this.wasteItems = [];
        this.plasticItems = [];
        this.chemicalClouds = [];
    }

    setupClickHandlers() {
        const sourceItems = document.querySelectorAll('.source-item');
        
        sourceItems.forEach(item => {
            item.addEventListener('click', () => {
                const sourceType = item.dataset.source;
                this.toggleSource(sourceType, item);
            });
        });
    }

    toggleSource(type, element) {
        if (this.activeSources.has(type)) {
            // Deactivate
            this.activeSources.delete(type);
            element.classList.remove('active');
            this.deactivatePollution(type);
        } else {
            // Activate
            this.activeSources.add(type);
            element.classList.add('active');
            this.activatePollution(type);
        }
        
        this.updateEffectsPanel();
        this.updateEnvironmentStatus();
        this.highlightDetailCard(type);
    }

    activatePollution(type) {
        switch(type) {
            case 'deforestation':
                this.startDeforestation();
                break;
            case 'mining':
                this.startMining();
                break;
            case 'industrial':
                this.startIndustrial();
                break;
            case 'pesticides':
                this.startPesticides();
                break;
            case 'waste':
                this.startWaste();
                break;
            case 'plastic':
                this.startPlastic();
                break;
        }
    }

    deactivatePollution(type) {
        // Pollution effects persist visually but stop adding new particles
        switch(type) {
            case 'mining':
                // Slow down acid but don't stop completely
                break;
            case 'industrial':
                this.factory.active = false;
                break;
        }
    }

    // ==========================================
    // DEFORESTATION EFFECT
    // ==========================================
    startDeforestation() {
        // Make trees start falling one by one
        let delay = 0;
        this.trees.forEach((tree, index) => {
            if (tree.alive && !tree.falling) {
                setTimeout(() => {
                    tree.falling = true;
                    tree.fallSpeed = 0.5 + Math.random() * 0.5;
                }, delay);
                delay += 200 + Math.random() * 300;
            }
        });
    }

    // ==========================================
    // MINING EFFECT
    // ==========================================
    startMining() {
        this.mine.active = true;
        this.mine.acidLevel = 0;
    }

    updateMining() {
        if (!this.mine.active || !this.activeSources.has('mining')) return;

        // Increase acid level
        if (this.mine.acidLevel < 100) {
            this.mine.acidLevel += 0.3;
        }

        // Create acid droplets
        if (Math.random() < 0.15) {
            this.mine.acidDroplets.push({
                x: this.mine.x + 30 + Math.random() * 40,
                y: this.mine.y + 20,
                vx: (Math.random() - 0.5) * 2,
                vy: 1 + Math.random() * 2,
                size: 3 + Math.random() * 4,
                opacity: 0.8
            });
        }

        // Update acid pool
        if (this.mine.poolSize < 80) {
            this.mine.poolSize += 0.1;
        }

        // Update droplets
        this.mine.acidDroplets = this.mine.acidDroplets.filter(d => {
            d.x += d.vx;
            d.y += d.vy;
            d.vy += 0.1;
            d.opacity -= 0.01;
            
            // Add contamination when droplet hits ground
            if (d.y > this.groundY + 50 && Math.random() < 0.3) {
                this.addContamination(d.x, this.groundY + 50, '#FF6B35');
            }
            
            return d.y < this.height && d.opacity > 0;
        });
    }

    // ==========================================
    // INDUSTRIAL EFFECT
    // ==========================================
    startIndustrial() {
        this.factory.active = true;
    }

    updateIndustrial() {
        if (!this.factory.active || !this.activeSources.has('industrial')) return;

        // Create smoke particles
        if (Math.random() < 0.3) {
            this.factory.smokeParticles.push({
                x: this.factory.x - 10,
                y: this.factory.y - 30,
                size: 10 + Math.random() * 15,
                opacity: 0.6,
                vx: -0.5 + Math.random(),
                vy: -1 - Math.random()
            });
        }

        // Create waste barrels occasionally
        if (Math.random() < 0.02 && this.factory.wasteBarrels.length < 5) {
            this.factory.wasteBarrels.push({
                x: this.factory.x - 40 - Math.random() * 60,
                y: this.groundY + 10,
                leaking: true,
                leakAmount: 0
            });
        }

        // Update smoke
        this.factory.smokeParticles = this.factory.smokeParticles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.size += 0.3;
            p.opacity -= 0.008;
            return p.opacity > 0;
        });

        // Update waste barrels
        this.factory.wasteBarrels.forEach(barrel => {
            if (barrel.leaking) {
                barrel.leakAmount += 0.5;
                if (Math.random() < 0.1) {
                    this.addContamination(barrel.x, this.groundY + 30, '#4A4A4A');
                }
            }
        });
    }

    // ==========================================
    // PESTICIDES EFFECT
    // ==========================================
    startPesticides() {
        // Create chemical spray clouds
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.chemicalClouds.push({
                    x: 100 + Math.random() * (this.width - 200),
                    y: this.groundY - 20,
                    size: 40 + Math.random() * 30,
                    opacity: 0.5,
                    spreading: true
                });
            }, i * 400);
        }
    }

    updatePesticides() {
        if (!this.activeSources.has('pesticides')) return;

        // Add new clouds periodically
        if (Math.random() < 0.02) {
            this.chemicalClouds.push({
                x: 100 + Math.random() * (this.width - 200),
                y: this.groundY - 10,
                size: 30 + Math.random() * 20,
                opacity: 0.4,
                spreading: true
            });
        }

        // Update clouds
        this.chemicalClouds = this.chemicalClouds.filter(cloud => {
            if (cloud.spreading && cloud.size < 100) {
                cloud.size += 0.5;
                cloud.y += 0.2;
            }
            cloud.opacity -= 0.002;
            
            // Add soil contamination
            if (cloud.y > this.groundY && Math.random() < 0.05) {
                this.addContamination(cloud.x + (Math.random() - 0.5) * cloud.size, this.groundY + 20, '#9ACD32');
            }
            
            return cloud.opacity > 0;
        });
    }

    // ==========================================
    // WASTE EFFECT
    // ==========================================
    startWaste() {
        // Create garbage pile
        const pileX = this.width * 0.5;
        for (let i = 0; i < 15; i++) {
            this.wasteItems.push({
                x: pileX + (Math.random() - 0.5) * 80,
                y: this.groundY + 5 + Math.random() * 30,
                type: ['🗑️', '📦', '🥫', '📰', '🧃'][Math.floor(Math.random() * 5)],
                size: 15 + Math.random() * 10,
                rotation: Math.random() * 360,
                leaching: true
            });
        }
    }

    updateWaste() {
        if (!this.activeSources.has('waste')) return;

        // Add leachate contamination
        this.wasteItems.forEach(item => {
            if (item.leaching && Math.random() < 0.02) {
                this.addContamination(item.x, item.y + 20, '#8B7355');
            }
        });
    }

    // ==========================================
    // PLASTIC EFFECT
    // ==========================================
    startPlastic() {
        // Create scattered plastic items
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.plasticItems.push({
                    x: Math.random() * this.width,
                    y: this.groundY + Math.random() * 50,
                    size: 3 + Math.random() * 5,
                    color: ['#FF69B4', '#00CED1', '#FFD700', '#FF6347'][Math.floor(Math.random() * 4)],
                    opacity: 0.7 + Math.random() * 0.3
                });
            }, i * 100);
        }
    }

    updatePlastic() {
        if (!this.activeSources.has('plastic')) return;

        // Add more microplastics occasionally
        if (Math.random() < 0.03 && this.plasticItems.length < 50) {
            this.plasticItems.push({
                x: Math.random() * this.width,
                y: this.groundY + Math.random() * 60,
                size: 2 + Math.random() * 4,
                color: ['#FF69B4', '#00CED1', '#FFD700', '#FF6347'][Math.floor(Math.random() * 4)],
                opacity: 0.6 + Math.random() * 0.4
            });
        }
    }

    // ==========================================
    // CONTAMINATION HELPER
    // ==========================================
    addContamination(x, y, color) {
        this.contamination.push({
            x: x,
            y: y,
            size: 5 + Math.random() * 10,
            color: color,
            opacity: 0.4 + Math.random() * 0.3,
            growing: true
        });
    }

    updateContamination() {
        this.contamination = this.contamination.filter(c => {
            if (c.growing && c.size < 25) {
                c.size += 0.1;
            }
            // Slowly fade very old contamination
            if (c.size >= 25) {
                c.opacity -= 0.001;
            }
            return c.opacity > 0;
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
        this.drawContamination();
        this.drawMine();
        this.drawFactory();
        this.drawTrees();
        this.drawChemicalClouds();
        this.drawWaste();
        this.drawPlastic();
    }

    drawSky() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.groundY);
        
        if (this.activeSources.size > 3) {
            // Very polluted sky
            gradient.addColorStop(0, '#8B7355');
            gradient.addColorStop(1, '#A0826D');
        } else if (this.activeSources.size > 1) {
            // Moderately polluted
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(1, '#B0C4DE');
        } else {
            // Clean sky
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(1, '#E0F6FF');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.groundY);
    }

    drawSun() {
        const sunX = this.width - 80;
        const sunY = 60;
        const sunOpacity = this.activeSources.size > 2 ? 0.4 : 0.9;
        
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
        // Grass layer
        const grassColor = this.activeSources.has('deforestation') || this.activeSources.size > 2 
            ? '#8B7355' : '#6B8E4E';
        
        this.ctx.fillStyle = grassColor;
        this.ctx.fillRect(0, this.groundY, this.width, 20);
        
        // Draw grass blades if healthy
        if (!this.activeSources.has('deforestation') && this.activeSources.size < 3) {
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
        
        // Topsoil
        const topsoilColor = this.contamination.length > 10 ? '#5D4037' : '#6D4C41';
        this.ctx.fillStyle = topsoilColor;
        this.ctx.fillRect(0, soilTop, this.width, 40);
        
        // Subsoil
        this.ctx.fillStyle = '#4E342E';
        this.ctx.fillRect(0, soilTop + 40, this.width, 60);
        
        // Deep soil / rock
        this.ctx.fillStyle = '#3E2723';
        this.ctx.fillRect(0, soilTop + 100, this.width, this.height - soilTop - 100);
    }

    drawContamination() {
        this.contamination.forEach(c => {
            this.ctx.save();
            this.ctx.globalAlpha = c.opacity;
            
            const gradient = this.ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.size);
            gradient.addColorStop(0, c.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }

    drawTrees() {
        this.trees.forEach(tree => {
            this.ctx.save();
            
            if (tree.falling) {
                // Update fall animation
                tree.fallAngle += tree.fallSpeed;
                if (tree.fallAngle >= 90) {
                    tree.alive = false;
                    tree.stump = true;
                    tree.falling = false;
                }
            }
            
            if (tree.stump) {
                // Draw stump
                this.ctx.fillStyle = '#5D4037';
                this.ctx.fillRect(tree.x - tree.width / 2, tree.y - 15, tree.width, 20);
                this.ctx.restore();
                return;
            }
            
            // Apply fall rotation
            if (tree.falling) {
                this.ctx.translate(tree.x, tree.y);
                this.ctx.rotate((tree.fallAngle * tree.fallDirection * Math.PI) / 180);
                this.ctx.translate(-tree.x, -tree.y);
                this.ctx.globalAlpha = 1 - tree.fallAngle / 100;
            }
            
            // Draw trunk
            this.ctx.fillStyle = '#5D4037';
            this.ctx.fillRect(
                tree.x - tree.width / 4,
                tree.y - tree.height * 0.4,
                tree.width / 2,
                tree.height * 0.5
            );
            
            // Draw foliage (triangle layers)
            this.ctx.fillStyle = tree.alive ? '#2E7D32' : '#5D4037';
            
            for (let i = 0; i < 3; i++) {
                const layerY = tree.y - tree.height * 0.3 - i * tree.height * 0.25;
                const layerWidth = tree.width * (1.5 - i * 0.3);
                
                this.ctx.beginPath();
                this.ctx.moveTo(tree.x, layerY - tree.height * 0.3);
                this.ctx.lineTo(tree.x - layerWidth, layerY);
                this.ctx.lineTo(tree.x + layerWidth, layerY);
                this.ctx.closePath();
                this.ctx.fill();
            }
            
            this.ctx.restore();
        });
    }

    drawMine() {
        if (!this.mine.active && !this.activeSources.has('mining')) return;
        
        const m = this.mine;
        
        // Mine entrance
        this.ctx.fillStyle = '#2C2C2C';
        this.ctx.beginPath();
        this.ctx.arc(m.x + 40, m.y + 10, 35, Math.PI, 0);
        this.ctx.fill();
        
        // Mine frame
        this.ctx.strokeStyle = '#5D4037';
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.arc(m.x + 40, m.y + 10, 38, Math.PI, 0);
        this.ctx.stroke();
        
        // Support beams
        this.ctx.fillStyle = '#5D4037';
        this.ctx.fillRect(m.x + 5, m.y - 25, 8, 40);
        this.ctx.fillRect(m.x + 67, m.y - 25, 8, 40);
        
        // Draw acid pool
        if (m.poolSize > 0) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.7;
            
            const poolGradient = this.ctx.createRadialGradient(
                m.x + 40, m.y + 50, 0,
                m.x + 40, m.y + 50, m.poolSize
            );
            poolGradient.addColorStop(0, '#FF6B35');
            poolGradient.addColorStop(0.5, '#FF8C42');
            poolGradient.addColorStop(1, 'rgba(255, 107, 53, 0.3)');
            
            this.ctx.fillStyle = poolGradient;
            this.ctx.beginPath();
            this.ctx.ellipse(m.x + 40, m.y + 50, m.poolSize, m.poolSize * 0.4, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        }
        
        // Draw acid droplets
        m.acidDroplets.forEach(d => {
            this.ctx.save();
            this.ctx.globalAlpha = d.opacity;
            this.ctx.fillStyle = '#FF6B35';
            this.ctx.beginPath();
            this.ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        
        // Warning sign
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('⚠️ ACID', m.x + 40, m.y - 35);
    }

    drawFactory() {
        if (!this.factory.active && !this.activeSources.has('industrial')) return;
        
        const f = this.factory;
        
        // Main building
        this.ctx.fillStyle = '#424242';
        this.ctx.fillRect(f.x - 50, f.y, 80, 60);
        
        // Chimney
        this.ctx.fillStyle = '#5D4037';
        this.ctx.fillRect(f.x - 25, f.y - 40, 25, 50);
        
        // Windows
        this.ctx.fillStyle = '#FFD54F';
        for (let i = 0; i < 3; i++) {
            this.ctx.fillRect(f.x - 40 + i * 25, f.y + 15, 15, 15);
        }
        
        // Draw smoke
        f.smokeParticles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillStyle = '#616161';
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        
        // Draw waste barrels
        f.wasteBarrels.forEach(barrel => {
            // Barrel body
            this.ctx.fillStyle = '#1B5E20';
            this.ctx.fillRect(barrel.x - 10, barrel.y - 20, 20, 25);
            
            // Barrel bands
            this.ctx.fillStyle = '#2E7D32';
            this.ctx.fillRect(barrel.x - 10, barrel.y - 18, 20, 3);
            this.ctx.fillRect(barrel.x - 10, barrel.y - 5, 20, 3);
            
            // Hazard symbol
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('☢', barrel.x, barrel.y - 8);
            
            // Leak
            if (barrel.leaking && barrel.leakAmount > 0) {
                this.ctx.save();
                this.ctx.globalAlpha = 0.6;
                this.ctx.fillStyle = '#76FF03';
                this.ctx.beginPath();
                this.ctx.ellipse(barrel.x, barrel.y + 10, Math.min(barrel.leakAmount, 20), 5, 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
        });
    }

    drawChemicalClouds() {
        this.chemicalClouds.forEach(cloud => {
            this.ctx.save();
            this.ctx.globalAlpha = cloud.opacity;
            
            const gradient = this.ctx.createRadialGradient(
                cloud.x, cloud.y, 0,
                cloud.x, cloud.y, cloud.size
            );
            gradient.addColorStop(0, 'rgba(154, 205, 50, 0.6)');
            gradient.addColorStop(0.5, 'rgba(154, 205, 50, 0.3)');
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }

    drawWaste() {
        this.wasteItems.forEach(item => {
            this.ctx.save();
            this.ctx.translate(item.x, item.y);
            this.ctx.rotate((item.rotation * Math.PI) / 180);
            this.ctx.font = `${item.size}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(item.type, 0, 0);
            this.ctx.restore();
        });
    }

    drawPlastic() {
        this.plasticItems.forEach(item => {
            this.ctx.save();
            this.ctx.globalAlpha = item.opacity;
            this.ctx.fillStyle = item.color;
            this.ctx.beginPath();
            this.ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    // ==========================================
    // UI UPDATES
    // ==========================================
    updateEffectsPanel() {
        if (!this.activeEffectsPanel) return;

        if (this.activeSources.size === 0) {
            this.activeEffectsPanel.innerHTML = `
                <div class="no-effects">
                    <div class="no-effects-icon">🌱</div>
                    <p>Click a pollution source to see its environmental impact</p>
                </div>
            `;
            return;
        }

        let html = '';
        this.activeSources.forEach(source => {
            const data = this.pollutionData[source];
            if (data) {
                html += `
                    <div class="effect-item">
                        <div class="effect-title">${data.icon} ${data.name}</div>
                        <div class="effect-description">
                            ${data.effects.map(e => `• ${e}`).join('<br>')}
                        </div>
                    </div>
                `;
            }
        });
        
        this.activeEffectsPanel.innerHTML = html;
    }

    updateEnvironmentStatus() {
        if (!this.envStatus) return;

        const count = this.activeSources.size;
        
        if (count === 0) {
            this.envStatus.textContent = '🌿 Healthy Environment';
            this.envStatus.classList.remove('polluted');
        } else if (count <= 2) {
            this.envStatus.textContent = '⚠️ Mild Pollution';
            this.envStatus.classList.remove('polluted');
        } else if (count <= 4) {
            this.envStatus.textContent = '🔶 Moderate Pollution';
            this.envStatus.classList.add('polluted');
        } else {
            this.envStatus.textContent = '☠️ Severe Pollution';
            this.envStatus.classList.add('polluted');
        }
    }

    highlightDetailCard(type) {
        this.detailCards.forEach(card => {
            const cardType = card.dataset.cause;
            if (this.activeSources.has(cardType)) {
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
        // Clear active sources
        this.activeSources.clear();
        
        // Reset UI
        document.querySelectorAll('.source-item').forEach(item => {
            item.classList.remove('active');
        });
        
        this.detailCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Recreate scene
        this.createInitialScene();
        this.updateEffectsPanel();
        this.updateEnvironmentStatus();
    }

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    animate() {
        // Update all effects
        this.updateMining();
        this.updateIndustrial();
        this.updatePesticides();
        this.updateWaste();
        this.updatePlastic();
        this.updateContamination();
        
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
    window.causesSection = new CausesSection();
    
    // Add interactive card toggle functionality for cause cards
    const causeCards = document.querySelectorAll('.cause-card');
    causeCards.forEach(card => {
        card.addEventListener('click', () => {
            // Toggle expanded state
            const isExpanded = card.classList.contains('expanded');
            
            // Close other cards
            causeCards.forEach(c => c.classList.remove('expanded'));
            
            // Toggle current card
            if (!isExpanded) {
                card.classList.add('expanded');
            }
        });
    });
});
