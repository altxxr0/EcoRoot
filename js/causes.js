/* =============================================
   EcoRoot - Causes Section
   Drag-and-drop pollution sources
   ============================================= */

class CausesSection {
    constructor() {
        this.dropZone = Utils.$('#soilDropZone');
        this.sourcesContainer = Utils.$('#pollutionSources');
        this.contaminationFill = Utils.$('#contaminationFill');
        this.contaminationPercent = Utils.$('#contaminationPercent');
        this.effectsList = Utils.$('#effectsList');
        this.dropHint = Utils.$('#dropHint');
        this.resetBtn = Utils.$('#resetCauses');
        this.detailCards = Utils.$$('.detail-card');
        
        this.contaminationLevel = 0;
        this.appliedPollutants = [];
        
        this.pollutantEffects = {
            industrial: {
                name: 'Industrial Waste',
                icon: '🏭',
                effect: 25,
                description: 'Heavy metals contaminating soil',
                details: [
                    'Lead accumulation detected',
                    'Mercury levels elevated',
                    'Cadmium present in groundwater'
                ]
            },
            pesticides: {
                name: 'Pesticides',
                icon: '🧪',
                effect: 25,
                description: 'Chemical compounds disrupting ecosystem',
                details: [
                    'Beneficial insects declining',
                    'Soil bacteria dying',
                    'Chemical residues in crops'
                ]
            },
            plastic: {
                name: 'Plastic Waste',
                icon: '🛢️',
                effect: 25,
                description: 'Microplastics infiltrating soil layers',
                details: [
                    'Microplastics detected',
                    'Nutrient absorption blocked',
                    'Water retention impaired'
                ]
            },
            mining: {
                name: 'Mining Runoff',
                icon: '⛏️',
                effect: 25,
                description: 'Acid drainage destroying soil pH',
                details: [
                    'Soil pH critically low',
                    'Heavy metals spreading',
                    'Vegetation unable to grow'
                ]
            }
        };

        if (this.dropZone) {
            this.init();
        }
    }

    init() {
        this.setupDragAndDrop();
        this.setupResetButton();
        this.drawInitialSoil();
        
        // Redraw soil on window resize
        window.addEventListener('resize', Utils.debounce(() => {
            this.drawInitialSoil();
        }, 250));
    }

    setupDragAndDrop() {
        const sources = Utils.$$('.source-item', this.sourcesContainer);
        
        sources.forEach(source => {
            // Mouse events
            source.addEventListener('dragstart', (e) => this.handleDragStart(e));
            source.addEventListener('dragend', (e) => this.handleDragEnd(e));
            
            // Touch events for mobile
            source.addEventListener('touchstart', (e) => this.handleTouchStart(e));
            source.addEventListener('touchmove', (e) => this.handleTouchMove(e));
            source.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        });

        // Drop zone events
        this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));
    }

    handleDragStart(e) {
        const source = e.target.closest('.source-item');
        if (!source || source.classList.contains('applied')) return;
        
        source.classList.add('dragging');
        e.dataTransfer.setData('text/plain', source.dataset.type);
        e.dataTransfer.effectAllowed = 'move';
    }

    handleDragEnd(e) {
        const source = e.target.closest('.source-item');
        if (source) {
            source.classList.remove('dragging');
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.dropZone.classList.add('drag-over');
    }

    handleDragLeave(e) {
        if (!this.dropZone.contains(e.relatedTarget)) {
            this.dropZone.classList.remove('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        this.dropZone.classList.remove('drag-over');
        
        const pollutantType = e.dataTransfer.getData('text/plain');
        this.applyPollutant(pollutantType, e.clientX, e.clientY);
    }

    // Touch event handlers for mobile
    handleTouchStart(e) {
        const source = e.target.closest('.source-item');
        if (!source || source.classList.contains('applied')) return;
        
        this.touchSource = source;
        this.touchClone = source.cloneNode(true);
        this.touchClone.style.position = 'fixed';
        this.touchClone.style.zIndex = '1000';
        this.touchClone.style.opacity = '0.8';
        this.touchClone.style.pointerEvents = 'none';
        document.body.appendChild(this.touchClone);
        
        const touch = e.touches[0];
        this.updateTouchClonePosition(touch);
    }

    handleTouchMove(e) {
        if (!this.touchClone) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        this.updateTouchClonePosition(touch);
        
        // Check if over drop zone
        const dropRect = this.dropZone.getBoundingClientRect();
        const isOverDropZone = (
            touch.clientX >= dropRect.left &&
            touch.clientX <= dropRect.right &&
            touch.clientY >= dropRect.top &&
            touch.clientY <= dropRect.bottom
        );
        
        this.dropZone.classList.toggle('drag-over', isOverDropZone);
    }

    handleTouchEnd(e) {
        if (!this.touchClone) return;
        
        const touch = e.changedTouches[0];
        const dropRect = this.dropZone.getBoundingClientRect();
        const isOverDropZone = (
            touch.clientX >= dropRect.left &&
            touch.clientX <= dropRect.right &&
            touch.clientY >= dropRect.top &&
            touch.clientY <= dropRect.bottom
        );
        
        if (isOverDropZone && this.touchSource) {
            this.applyPollutant(this.touchSource.dataset.type, touch.clientX, touch.clientY);
        }
        
        this.dropZone.classList.remove('drag-over');
        this.touchClone.remove();
        this.touchClone = null;
        this.touchSource = null;
    }

    updateTouchClonePosition(touch) {
        if (!this.touchClone) return;
        const rect = this.touchClone.getBoundingClientRect();
        this.touchClone.style.left = `${touch.clientX - rect.width / 2}px`;
        this.touchClone.style.top = `${touch.clientY - rect.height / 2}px`;
    }

    applyPollutant(type, x, y) {
        if (this.appliedPollutants.includes(type)) return;
        
        const pollutant = this.pollutantEffects[type];
        if (!pollutant) return;

        this.appliedPollutants.push(type);
        this.contaminationLevel = Math.min(100, this.contaminationLevel + pollutant.effect);

        // Update UI
        this.updateContaminationMeter();
        this.addEffectToList(pollutant);
        this.markSourceAsApplied(type);
        this.updateDropZoneAppearance();
        this.highlightDetailCard(type);
        this.createDropEffect(x, y);
        this.addVisiblePollutantToSoil(type, x, y);
        this.updateSoilDamage();
        
        // Hide hint when first pollutant is added
        if (this.appliedPollutants.length === 1) {
            this.dropHint.classList.add('hidden');
        }
    }

    addVisiblePollutantToSoil(type, x, y) {
        const dropZoneRect = this.dropZone.getBoundingClientRect();
        const pollutant = this.pollutantEffects[type];
        
        // Create main pollutant icon in soil
        const pollutantIcon = Utils.createElement('div', { 
            className: `dropped-pollutant pollutant-${type}`,
            'data-type': type
        });
        
        // Calculate position relative to drop zone
        let relX = ((x - dropZoneRect.left) / dropZoneRect.width) * 100;
        let relY = ((y - dropZoneRect.top) / dropZoneRect.height) * 100;
        
        // Keep within bounds
        relX = Math.max(10, Math.min(90, relX));
        relY = Math.max(20, Math.min(80, relY));
        
        pollutantIcon.style.left = `${relX}%`;
        pollutantIcon.style.top = `${relY}%`;
        pollutantIcon.innerHTML = `<span class="pollutant-emoji">${pollutant.icon}</span>`;
        
        this.dropZone.appendChild(pollutantIcon);
        
        // Add multiple scattered debris items based on pollution type
        this.addPollutionDebris(type, relX, relY);
    }

    addPollutionDebris(type, centerX, centerY) {
        const debrisItems = this.getDebrisForType(type);
        
        debrisItems.forEach((debris, index) => {
            setTimeout(() => {
                const debrisEl = Utils.createElement('div', { 
                    className: `pollution-debris debris-${type}` 
                });
                
                // Scatter around the drop point
                const angle = (index / debrisItems.length) * Math.PI * 2;
                const distance = Utils.random(8, 25);
                const offsetX = Math.cos(angle) * distance;
                const offsetY = Math.sin(angle) * distance;
                
                debrisEl.style.left = `${Math.max(5, Math.min(95, centerX + offsetX))}%`;
                debrisEl.style.top = `${Math.max(15, Math.min(85, centerY + offsetY))}%`;
                debrisEl.innerHTML = debris;
                debrisEl.style.fontSize = `${Utils.random(12, 20)}px`;
                debrisEl.style.animationDelay = `${index * 0.1}s`;
                
                this.dropZone.appendChild(debrisEl);
            }, index * 50);
        });
    }

    getDebrisForType(type) {
        const debrisMap = {
            industrial: ['⚙️', '🔩', '🛢️', '💨', '⚠️', '🏭', '💀'],
            pesticides: ['💧', '☠️', '🧫', '🦟', '💀', '⚗️', '🧪'],
            plastic: ['🥤', '🛍️', '📦', '🧴', '🥡', '🔋', '💊'],
            mining: ['💎', '⛏️', '🪨', '⚫', '🟤', '💀', '☢️']
        };
        return debrisMap[type] || ['⚠️'];
    }

    updateSoilDamage() {
        // Update soil color based on contamination level
        const soilLayers = Utils.$$('.soil-layer', this.dropZone);
        const level = this.contaminationLevel;
        
        // Calculate damage colors
        let topsoilColor, subsoilColor, bedrockColor;
        
        if (level <= 25) {
            topsoilColor = `rgb(${74 + level * 2}, ${124 - level * 2}, ${89 - level * 2})`;
            subsoilColor = `rgb(${93 - level}, ${77 - level}, ${55})`;
        } else if (level <= 50) {
            topsoilColor = `rgb(${124 + (level - 25) * 2}, ${74 - (level - 25)}, ${39 - (level - 25)})`;
            subsoilColor = `rgb(${68 + (level - 25)}, ${52 - (level - 25) * 0.5}, ${55 + (level - 25) * 0.5})`;
        } else if (level <= 75) {
            topsoilColor = `rgb(${174 - (level - 50)}, ${49 - (level - 50) * 0.5}, ${14})`;
            subsoilColor = `rgb(${93 + (level - 50) * 0.5}, ${27}, ${68})`;
        } else {
            topsoilColor = `rgb(${124 - (level - 75) * 0.5}, ${24}, ${14})`;
            subsoilColor = `rgb(${118}, ${27 - (level - 75) * 0.3}, ${68 + (level - 75) * 0.5})`;
        }
        
        // Apply colors to layers if they exist
        if (soilLayers.length > 0) {
            soilLayers[0].style.background = topsoilColor;
            if (soilLayers[1]) soilLayers[1].style.background = subsoilColor;
        }
        
        // Add contamination overlay effect
        this.dropZone.style.setProperty('--contamination-level', level / 100);
        
        // Add dead vegetation markers at higher levels
        if (level >= 50 && !this.deadVegetationAdded) {
            this.addDeadVegetation();
            this.deadVegetationAdded = true;
        }
        
        if (level >= 75 && !this.severeWarningAdded) {
            this.addSevereWarning();
            this.severeWarningAdded = true;
        }
    }

    addDeadVegetation() {
        const deadPlants = ['🥀', '🍂', '🍁', '🪹'];
        deadPlants.forEach((plant, index) => {
            const plantEl = Utils.createElement('div', { className: 'dead-vegetation' });
            plantEl.innerHTML = plant;
            plantEl.style.left = `${20 + index * 20}%`;
            plantEl.style.top = `${Utils.random(5, 20)}%`;
            plantEl.style.animationDelay = `${index * 0.2}s`;
            this.dropZone.appendChild(plantEl);
        });
    }

    addSevereWarning() {
        const warning = Utils.createElement('div', { className: 'severe-warning' });
        warning.innerHTML = '☢️ SEVERE CONTAMINATION ☢️';
        this.dropZone.appendChild(warning);
    }

    updateContaminationMeter() {
        this.contaminationFill.style.width = `${this.contaminationLevel}%`;
        this.contaminationPercent.textContent = `${this.contaminationLevel}%`;
        
        // Change color based on level
        if (this.contaminationLevel > 75) {
            this.contaminationPercent.style.color = '#C45C4B';
        } else if (this.contaminationLevel > 50) {
            this.contaminationPercent.style.color = '#D4A03B';
        }
    }

    addEffectToList(pollutant) {
        const li = Utils.createElement('li', { className: 'effect-item' }, [
            Utils.createElement('span', { className: 'effect-icon' }, [pollutant.icon]),
            Utils.createElement('span', { className: 'effect-name' }, [pollutant.name])
        ]);
        
        li.style.animation = 'fadeInLeft 0.3s ease forwards';
        this.effectsList.appendChild(li);
    }

    markSourceAsApplied(type) {
        const source = Utils.$(`.source-item[data-type="${type}"]`);
        if (source) {
            source.classList.add('applied');
            source.setAttribute('draggable', 'false');
        }
    }

    updateDropZoneAppearance() {
        // Remove all pollution classes
        for (let i = 1; i <= 4; i++) {
            this.dropZone.classList.remove(`polluted-${i}`);
        }
        
        // Add appropriate class based on number of pollutants
        if (this.appliedPollutants.length > 0) {
            this.dropZone.classList.add(`polluted-${this.appliedPollutants.length}`);
        }
    }

    highlightDetailCard(type) {
        this.detailCards.forEach(card => {
            const isActive = card.dataset.cause === type;
            card.classList.toggle('active', isActive || card.classList.contains('active'));
        });
    }

    createDropEffect(x, y) {
        const dropZoneRect = this.dropZone.getBoundingClientRect();
        const relativeX = x - dropZoneRect.left;
        const relativeY = y - dropZoneRect.top;
        
        // Create ripple effect
        const ripple = Utils.createElement('div', { className: 'drop-effect' });
        ripple.style.left = `${relativeX}px`;
        ripple.style.top = `${relativeY}px`;
        
        this.dropZone.appendChild(ripple);
        
        // Remove after animation
        setTimeout(() => ripple.remove(), 600);
        
        // Create pollution particles
        for (let i = 0; i < 10; i++) {
            this.createPollutionParticle(relativeX, relativeY);
        }
    }

    createPollutionParticle(x, y) {
        const particle = Utils.createElement('div', { className: 'pollution-particle' });
        particle.style.left = `${x + Utils.random(-30, 30)}px`;
        particle.style.top = `${y + Utils.random(-30, 30)}px`;
        particle.style.animationDelay = `${Utils.random(0, 0.3)}s`;
        
        this.dropZone.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }

    drawInitialSoil() {
        const canvas = Utils.$('#causesSoilCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = this.dropZone.getBoundingClientRect();
        
        // Set canvas size
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Create clean, modern soil gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#5D7A4A');    // Muted green surface
        gradient.addColorStop(0.05, '#4A6B3D'); // Darker green
        gradient.addColorStop(0.12, '#5D4E37'); // Rich brown topsoil
        gradient.addColorStop(0.35, '#4A3D30'); // Darker brown
        gradient.addColorStop(0.7, '#3D2B1F');  // Deep earth
        gradient.addColorStop(1, '#2A1F15');    // Bedrock
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add subtle texture only
        this.addSoilTexture(ctx, canvas.width, canvas.height);
        
        // Add clean soil layer lines
        this.drawSoilLayers(ctx, canvas.width, canvas.height);
    }
    
    addSoilTexture(ctx, width, height) {
        // Subtle organic texture - less is more
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * width;
            const y = 20 + Math.random() * (height - 20);
            const size = Math.random() * 2 + 0.5;
            const alpha = Math.random() * 0.15;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
            ctx.fill();
        }
        
        // Sparse lighter particles for minerals
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * width;
            const y = height * 0.3 + Math.random() * (height * 0.7);
            const size = Math.random() * 3 + 1;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(160, 140, 120, ${Math.random() * 0.3})`;
            ctx.fill();
        }
    }
    
    drawSoilLayers(ctx, width, height) {
        // Clean, subtle layer lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        
        // Surface line
        ctx.beginPath();
        ctx.moveTo(0, height * 0.12);
        ctx.lineTo(width, height * 0.12);
        ctx.stroke();
        
        // Mid layer
        ctx.beginPath();
        ctx.moveTo(0, height * 0.35);
        ctx.lineTo(width, height * 0.35);
        ctx.stroke();
        
        // Deep layer
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.moveTo(0, height * 0.7);
        ctx.lineTo(width, height * 0.7);
        ctx.stroke();
        
        // Subsoil/bedrock boundary  
        ctx.beginPath();
        ctx.moveTo(0, height * 0.6);
        for (let x = 0; x < width; x += 20) {
            ctx.lineTo(x, height * 0.6 + (Math.random() - 0.5) * 15);
        }
        ctx.stroke();
    }

    setupResetButton() {
        if (!this.resetBtn) return;
        
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    reset() {
        this.contaminationLevel = 0;
        this.appliedPollutants = [];
        this.deadVegetationAdded = false;
        this.severeWarningAdded = false;
        
        // Reset meter
        this.contaminationFill.style.width = '0%';
        this.contaminationPercent.textContent = '0%';
        this.contaminationPercent.style.color = '';
        
        // Clear effects list
        this.effectsList.innerHTML = '';
        
        // Reset sources
        Utils.$$('.source-item', this.sourcesContainer).forEach(source => {
            source.classList.remove('applied');
            source.setAttribute('draggable', 'true');
        });
        
        // Reset drop zone appearance
        for (let i = 1; i <= 4; i++) {
            this.dropZone.classList.remove(`polluted-${i}`);
        }
        
        // Remove all visible pollutants from soil
        Utils.$$('.dropped-pollutant', this.dropZone).forEach(el => el.remove());
        Utils.$$('.pollution-debris', this.dropZone).forEach(el => el.remove());
        Utils.$$('.dead-vegetation', this.dropZone).forEach(el => el.remove());
        Utils.$$('.severe-warning', this.dropZone).forEach(el => el.remove());
        
        // Reset soil layer colors
        const soilLayers = Utils.$$('.soil-layer', this.dropZone);
        if (soilLayers.length > 0) {
            soilLayers[0].style.background = '';
            if (soilLayers[1]) soilLayers[1].style.background = '';
        }
        
        // Reset contamination level CSS variable
        this.dropZone.style.setProperty('--contamination-level', 0);
        
        // Reset detail cards
        this.detailCards.forEach(card => card.classList.remove('active'));
        
        // Show hint again
        this.dropHint.classList.remove('hidden');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.causesSection = new CausesSection();
});
