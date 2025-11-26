/* =============================================
   EcoRoot - Automatic Impact Cycling Visualization
   ============================================= */

class ImpactCycler {
  constructor() {
    this.canvas = document.getElementById('impactCanvas');
    this.ctx = this.canvas?.getContext('2d');
    this.nextCanvas = document.getElementById('impactCanvasNext');
    this.nextCtx = this.nextCanvas?.getContext('2d');
    this.iconEl = document.getElementById('impactCycleIcon');
    this.titleEl = document.getElementById('impactCycleTitle');
    this.listEl = document.getElementById('impactCycleList');
    this.barEl = document.getElementById('impactCycleBar');

    if (!this.canvas) {
      console.error('ImpactCycler: Canvas not found!');
      return;
    }

    this.duration = 5500;
    this.fadeDuration = 500;
    this.index = 0; // used for overlay text content (next category)
    this.activeIndexForCanvas = 0; // currently visible on base canvas
    this.lastSwitch = performance.now();

    this.data = [
      {
        icon: '🌾',
        title: 'Effects on Plants & Crops',
        points: [
          'Poor or stunted growth',
          'Dull, unhealthy color',
          'Seed failure / early death',
          'Nutrient loss in topsoil',
          'Contaminated food products'
        ],
        colors: ['#4A7C59', '#2D5A3D'],
        visualize: 'plants'
      },
      {
        icon: '👤',
        title: 'Effects on Human Health',
        points: [
          'Skin & respiratory issues',
          'Food poisoning risks',
          'Children & farmers vulnerable',
          'Toxic exposure accumulation',
          'Long-term disease links'
        ],
        colors: ['#C23B22', '#E07B3C'],
        visualize: 'humans'
      },
      {
        icon: '🌍',
        title: 'Effects on Environment',
        points: [
          'Loss of fertility & biodiversity',
          'Ecosystem damage & collapse',
          'Water contamination spread',
          'Harmful gas/dust release',
          'Wildlife migration / die-off'
        ],
        colors: ['#2D5A3D', '#1E3D2A'],
        visualize: 'environment'
      }
    ];

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.renderCategory(true);
    requestAnimationFrame((t) => this.loop(t));
  }

  resizeCanvas() {
    // Use parent stack container for sizing
    const stack = this.canvas.parentElement;
    this.canvas.width = stack.clientWidth;
    this.canvas.height = 400;
    if (this.nextCanvas) {
      this.nextCanvas.width = stack.clientWidth;
      this.nextCanvas.height = 400;
    }
  }

  loop(timestamp) {
    const elapsed = timestamp - this.lastSwitch;
    const progress = Math.min(elapsed / this.duration, 1);
    this.barEl.style.width = (progress * 100) + '%';

    if (elapsed >= this.duration) {
      const upcomingIndex = (this.index + 1) % this.data.length;
      // Prepare next frame on overlay canvas (new category)
      if (this.nextCtx && this.nextCanvas) {
        this.drawBackgroundTo(this.nextCtx, 0, upcomingIndex);
        this.nextCanvas.style.opacity = '0';
        requestAnimationFrame(() => {
          this.nextCanvas.style.opacity = '1';
        });
      }

      this.lastSwitch = timestamp;
      // Update overlay text to next category with its own fade
      this.index = upcomingIndex;
      this.renderCategory();

      // After fade completes, commit new category to base canvas
      if (this.nextCanvas) {
        setTimeout(() => {
          this.activeIndexForCanvas = this.index;
          this.nextCanvas.style.opacity = '0';
        }, this.fadeDuration);
      } else {
        // Fallback if no overlay canvas available
        this.activeIndexForCanvas = this.index;
      }
    }

    // Continue drawing currently active category on base canvas
    this.drawBackgroundTo(this.ctx, progress, this.activeIndexForCanvas);
    requestAnimationFrame((t) => this.loop(t));
  }

  renderCategory(initial = false) {
    const d = this.data[this.index];

    if (!initial) {
      this.listEl.style.opacity = '0';
      this.titleEl.style.opacity = '0';
      this.iconEl.style.opacity = '0';
      setTimeout(() => {
        this.iconEl.textContent = d.icon;
        this.titleEl.textContent = d.title;
        this.listEl.innerHTML = d.points.map(p => `<li>${p}</li>`).join('');
        this.iconEl.style.opacity = '1';
        this.titleEl.style.opacity = '1';
        this.listEl.style.opacity = '1';
      }, this.fadeDuration);
    } else {
      this.iconEl.textContent = d.icon;
      this.titleEl.textContent = d.title;
      this.listEl.innerHTML = d.points.map(p => `<li>${p}</li>`).join('');
    }
  }

  drawBackgroundTo(ctx, progress, index) {
    const d = this.data[index];
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, d.colors[0] + '22');
    grad.addColorStop(1, d.colors[1] + '11');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const centerX = w / 2;
    const centerY = h / 2;
    const time = performance.now();

    switch(d.visualize) {
      case 'plants':
        this.drawPlantsViz(ctx, centerX, centerY, time, d.colors);
        break;
      case 'humans':
        this.drawHumansViz(ctx, centerX, centerY, time, d.colors);
        break;
      case 'environment':
        this.drawEnvironmentViz(ctx, centerX, centerY, time, d.colors);
        break;
    }
  }

  drawPlantsViz(ctx, cx, cy, time, colors) {
    const soilY = cy + 80;
    
    // Multi-layer soil with depth gradient
    const soilGrad = ctx.createLinearGradient(cx, soilY - 20, cx, soilY + 60);
    soilGrad.addColorStop(0, '#A0826D');
    soilGrad.addColorStop(0.3, '#8B4513');
    soilGrad.addColorStop(0.7, '#654321');
    soilGrad.addColorStop(1, '#3D2817');
    ctx.fillStyle = soilGrad;
    ctx.fillRect(cx - 140, soilY - 20, 280, 80);
    
    // Soil texture lines
    ctx.strokeStyle = '#654321' + '55';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(cx - 140, soilY + i * 10);
      ctx.lineTo(cx + 140, soilY + i * 10);
      ctx.stroke();
    }
    
    // Toxic chemical pools in soil
    for (let i = 0; i < 4; i++) {
      const poolX = cx - 90 + i * 60;
      const poolY = soilY + 20 + Math.sin(time / 800 + i) * 3;
      ctx.fillStyle = '#C23B22' + '88';
      ctx.beginPath();
      ctx.ellipse(poolX, poolY, 18, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Bubbles rising from toxic pools
      const bubble = ((time / 1000 + i * 0.25) % 1);
      if (bubble < 0.8) {
        ctx.fillStyle = '#C23B22' + '66';
        ctx.beginPath();
        ctx.arc(poolX, poolY - bubble * 30, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Animated toxic particles flowing through soil
    for (let i = 0; i < 25; i++) {
      const x = cx - 120 + (i * 12) + Math.sin(time / 500 + i) * 4;
      const y = soilY + 5 + Math.cos(time / 600 + i * 2) * 8;
      const size = 2 + Math.sin(time / 400 + i) * 1;
      ctx.fillStyle = i % 3 === 0 ? '#FF4444' : '#C23B22';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Glow effect on particles
      if (i % 4 === 0) {
        ctx.fillStyle = '#FF4444' + '33';
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Plants with progressive health decline
    const plantCount = 6;
    for (let i = 0; i < plantCount; i++) {
      const x = cx - 100 + (i * 40);
      const health = 1 - (i / plantCount) * 0.75;
      
      // Root systems absorbing toxins
      ctx.strokeStyle = `rgba(139, 115, 85, ${health * 0.7})`;
      ctx.lineWidth = 2;
      for (let r = 0; r < 3; r++) {
        ctx.beginPath();
        ctx.moveTo(x, soilY);
        const rootX = x + (r - 1) * 15 + Math.sin(time / 1000 + r) * 2;
        const rootY = soilY + 18 + r * 4;
        ctx.quadraticCurveTo(x + (r - 1) * 8, soilY + 10, rootX, rootY);
        ctx.stroke();
      }
      
      // Plant stem with natural curve
      ctx.strokeStyle = health > 0.6 ? `rgba(74, 124, 89, ${health})` : `rgba(139, 115, 85, ${health})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      const stemHeight = 55 * health;
      const wobble = Math.sin(time / 1000 + i) * 2;
      ctx.moveTo(x, soilY);
      ctx.quadraticCurveTo(x + wobble, soilY - stemHeight / 2, x, soilY - stemHeight);
      ctx.stroke();
      
      // Multiple leaves at different heights
      const leafColor = health > 0.5 ? '#4A7C59' : (health > 0.3 ? '#8B7355' : '#A0826D');
      ctx.fillStyle = leafColor;
      for (let leaf = 0; leaf < 3; leaf++) {
        const leafY = soilY - stemHeight + leaf * 14;
        const leafHealth = health - leaf * 0.12;
        ctx.globalAlpha = Math.max(0.3, leafHealth);
        
        // Left leaf
        ctx.beginPath();
        ctx.ellipse(x - 10, leafY, 7 * health, 3.5 * health, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Right leaf
        ctx.beginPath();
        ctx.ellipse(x + 10, leafY, 7 * health, 3.5 * health, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      
      // Dead marker on very unhealthy plants
      if (health < 0.35) {
        ctx.font = '14px Arial';
        ctx.fillStyle = '#C23B22';
        ctx.globalAlpha = 0.7;
        ctx.fillText('✖', x - 5, soilY - stemHeight - 5);
        ctx.globalAlpha = 1;
      }
    }
    
    // Toxin absorption arrows from soil to plants
    ctx.strokeStyle = '#C23B22' + 'BB';
    ctx.lineWidth = 2;
    for (let i = 0; i < 7; i++) {
      const offset = (time / 900 + i * 0.3) % 1;
      const arrowX = cx - 80 + i * 30;
      const arrowY = soilY + 15 - offset * 55;
      if (offset > 0.1 && offset < 0.85) {
        ctx.globalAlpha = Math.sin(offset * Math.PI) * 0.8;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX, arrowY - 10);
        ctx.lineTo(arrowX - 3, arrowY - 6);
        ctx.moveTo(arrowX, arrowY - 10);
        ctx.lineTo(arrowX + 3, arrowY - 6);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    
    // Labels with backgrounds
    ctx.font = 'bold 11px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(cx - 135, soilY - 32, 100, 14);
    ctx.fillRect(cx - 55, soilY + 50, 130, 14);
    
    ctx.fillStyle = '#654321';
    ctx.fillText('Contaminated Soil', cx - 133, soilY - 22);
    ctx.fillStyle = '#C23B22';
    ctx.fillText('Heavy Metals & Toxins', cx - 53, soilY + 60);
  }

  drawHumansViz(ctx, cx, cy, time, colors) {
    // Farm field on left
    const farmX = cx - 105;
    const farmY = cy + 15;
    
    // Soil/field background
    ctx.fillStyle = '#8B7355' + '66';
    ctx.fillRect(farmX - 40, farmY, 80, 45);
    
    // Multiple crop rows showing contamination
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cropX = farmX - 25 + col * 22;
        const cropY = farmY + 12 + row * 13;
        const contamLevel = (row + col) / 5;
        
        // Crop plant
        ctx.font = '18px Arial';
        ctx.fillStyle = contamLevel > 0.5 ? '#8B7355' : '#4A7C59';
        ctx.globalAlpha = 0.75;
        ctx.fillText('🌾', cropX - 9, cropY);
        ctx.globalAlpha = 1;
        
        // Toxic dots on contaminated crops
        if (contamLevel > 0.4) {
          ctx.fillStyle = '#C23B22';
          for (let d = 0; d < 2; d++) {
            ctx.beginPath();
            ctx.arc(cropX + d * 5 - 2, cropY - 7, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
    
    // Warning signs in field
    ctx.font = '20px Arial';
    ctx.fillText('⚠️', farmX - 45, farmY - 8);
    ctx.fillText('☠️', farmX + 30, farmY - 8);
    
    // Harvest basket
    const basketX = farmX + 45;
    const basketY = cy - 18;
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(basketX, basketY, 16, 0, Math.PI, true);
    ctx.lineTo(basketX - 16, basketY + 8);
    ctx.lineTo(basketX + 16, basketY + 8);
    ctx.stroke();
    
    // Produce in basket
    ctx.font = '14px Arial';
    ctx.fillText('🥬', basketX - 13, basketY - 2);
    ctx.fillText('🍎', basketX + 2, basketY - 2);
    
    // Toxic particles from basket
    for (let i = 0; i < 4; i++) {
      const rise = ((time / 800 + i * 0.2) % 1);
      if (rise < 0.7) {
        ctx.fillStyle = '#C23B22';
        ctx.globalAlpha = 1 - rise;
        ctx.beginPath();
        ctx.arc(basketX - 8 + i * 4, basketY - 12 - rise * 22, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    
    // Consumption pathway - plate stage
    const plateX = cx - 10;
    ctx.fillStyle = '#E8E8E8';
    ctx.beginPath();
    ctx.ellipse(plateX, cy, 22, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.font = '22px Arial';
    ctx.fillText('🥗', plateX - 11, cy + 7);
    
    // Contamination flow animation
    const flow = (time / 2000) % 1;
    
    // Stage 1: Farm to plate
    if (flow < 0.5) {
      const stage1 = flow * 2;
      for (let i = 0; i < 4; i++) {
        const pf = (stage1 + i * 0.2) % 1;
        const px = basketX + (plateX - basketX) * pf;
        const py = basketY + (cy - basketY) * pf + Math.sin(pf * Math.PI * 3) * 7;
        ctx.fillStyle = '#C23B22';
        ctx.globalAlpha = Math.sin(pf * Math.PI) * 0.9;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    
    // Stage 2: Plate to human (ingestion)
    if (flow > 0.5) {
      const stage2 = (flow - 0.5) * 2;
      for (let i = 0; i < 4; i++) {
        const pf = (stage2 + i * 0.2) % 1;
        const px = plateX + (cx + 95 - plateX) * pf;
        const py = cy + Math.sin(pf * Math.PI * 3) * 9;
        ctx.fillStyle = '#FF4444';
        ctx.globalAlpha = Math.sin(pf * Math.PI) * 0.85;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    
    // Human with health effects
    const humanX = cx + 95;
    const humanY = cy;
    
    // Pulsing sick aura
    const auraSize = 40 + Math.sin(time / 500) * 6;
    ctx.fillStyle = colors[0] + '22';
    ctx.beginPath();
    ctx.arc(humanX, humanY, auraSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Body outline showing distress
    ctx.strokeStyle = colors[0] + '88';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(humanX, humanY, 36, 0, Math.PI * 2);
    ctx.stroke();
    
    // Sick human
    ctx.font = '48px Arial';
    ctx.fillText('🤢', humanX - 24, humanY + 18);
    
    // Health symptoms orbiting
    const symptoms = [
      { icon: '🤒', label: 'Fever' },
      { icon: '😷', label: 'Sick' },
      { icon: '💊', label: 'Meds' },
      { icon: '🌡️', label: 'Temp' },
      { icon: '🤮', label: 'Nausea' }
    ];
    
    symptoms.forEach((symptom, i) => {
      const angle = (time / 2500 + i * (Math.PI * 2 / symptoms.length)) % (Math.PI * 2);
      const radius = 52 + Math.sin(time / 1000 + i) * 4;
      const sx = humanX + Math.cos(angle) * radius;
      const sy = humanY + Math.sin(angle) * radius;
      
      ctx.font = '20px Arial';
      ctx.fillText(symptom.icon, sx - 10, sy + 10);
      
      // Small label
      ctx.font = 'bold 7px Arial';
      ctx.fillStyle = '#666';
      ctx.fillText(symptom.label, sx - 10, sy + 22);
    });
    
    // Health decline graph
    ctx.strokeStyle = '#C23B22';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(humanX - 28, humanY - 52);
    ctx.lineTo(humanX - 18, humanY - 48);
    ctx.lineTo(humanX - 8, humanY - 54);
    ctx.lineTo(humanX + 2, humanY - 46);
    ctx.lineTo(humanX + 12, humanY - 60);
    ctx.stroke();
    
    // Down arrow
    ctx.fillStyle = '#C23B22';
    ctx.beginPath();
    ctx.moveTo(humanX + 12, humanY - 60);
    ctx.lineTo(humanX + 8, humanY - 55);
    ctx.lineTo(humanX + 16, humanY - 55);
    ctx.fill();
    
    // Labels with backgrounds
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(farmX - 45, farmY - 22, 95, 13);
    ctx.fillRect(humanX - 28, humanY + 50, 75, 13);
    
    ctx.fillStyle = '#654321';
    ctx.fillText('Contaminated Farm', farmX - 43, farmY - 13);
    ctx.fillStyle = '#C23B22';
    ctx.fillText('Health Impact', humanX - 26, humanY + 59);
  }

  drawEnvironmentViz(ctx, cx, cy, time, colors) {
    const soilY = cy + 60;
    
    // Multi-layer contaminated soil with depth
    const soilGrad = ctx.createRadialGradient(cx, soilY, 10, cx, soilY, 100);
    soilGrad.addColorStop(0, '#8B4513');
    soilGrad.addColorStop(0.5, '#654321');
    soilGrad.addColorStop(1, '#3D2817');
    ctx.fillStyle = soilGrad;
    ctx.beginPath();
    ctx.ellipse(cx, soilY, 100, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Pulsing toxic contamination spreading outward
    const spread = 70 + Math.sin(time / 1000) * 12;
    const toxicGrad = ctx.createRadialGradient(cx, soilY, 0, cx, soilY, spread);
    toxicGrad.addColorStop(0, '#C23B22' + 'AA');
    toxicGrad.addColorStop(0.6, '#C23B22' + '44');
    toxicGrad.addColorStop(1, '#C23B22' + '00');
    ctx.fillStyle = toxicGrad;
    ctx.beginPath();
    ctx.ellipse(cx, soilY, spread, spread * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Contamination particles radiating outward
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const dist = 40 + ((time / 2000 + i * 0.05) % 1) * 60;
      const x = cx + Math.cos(angle) * dist;
      const y = soilY + Math.sin(angle) * dist * 0.3;
      const alpha = 1 - ((time / 2000 + i * 0.05) % 1);
      ctx.fillStyle = `rgba(194, 59, 34, ${alpha * 0.8})`;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // LEFT: Water contamination system
    const waterX = cx - 95;
    const waterY = cy - 10;
    
    // Water body with gradient (pond/groundwater)
    const waterGrad = ctx.createRadialGradient(waterX, waterY, 0, waterX, waterY, 45);
    waterGrad.addColorStop(0, '#6BB6D6');
    waterGrad.addColorStop(0.4, '#4A90A4');
    waterGrad.addColorStop(1, '#2D5A66');
    ctx.fillStyle = waterGrad;
    ctx.beginPath();
    ctx.ellipse(waterX, waterY, 45, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Contamination seeping from soil into water
    ctx.strokeStyle = '#C23B22' + '88';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(cx - 50, soilY - 10);
    ctx.quadraticCurveTo(cx - 70, cy + 20, waterX + 20, waterY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Polluted particles in water
    for (let i = 0; i < 12; i++) {
      const waveX = waterX - 30 + (i * 6);
      const waveY = waterY + Math.sin(time / 400 + i) * 3;
      ctx.fillStyle = i % 3 === 0 ? '#8B4513' : '#C23B22';
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(waveX, waveY, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    
    // Contaminated water droplets falling/leaching
    for (let i = 0; i < 4; i++) {
      const dropPhase = ((time / 600 + i * 0.25) % 1);
      if (dropPhase < 0.8) {
        const dx = waterX - 10 + i * 8;
        const dy = waterY + 30 + dropPhase * 30;
        ctx.fillStyle = `rgba(74, 144, 164, ${1 - dropPhase})`;
        ctx.beginPath();
        ctx.arc(dx, dy, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Water emoji with warning
    ctx.font = '28px Arial';
    ctx.fillText('💧', waterX - 14, waterY + 10);
    ctx.font = '16px Arial';
    ctx.fillText('⚠️', waterX + 20, waterY - 15);
    
    // TOP: Wildlife impact - multiple species affected
    const wildY = cy - 70;
    
    // Multiple animals showing distress/dying
    const animals = [
      { emoji: '🦎', x: -30, health: 0.4 },
      { emoji: '🐛', x: 0, health: 0.3 },
      { emoji: '🐝', x: 30, health: 0.5 }
    ];
    
    animals.forEach((animal, idx) => {
      const ax = cx + animal.x;
      
      // Sick/dying aura
      ctx.fillStyle = colors[0] + '22';
      ctx.beginPath();
      ctx.arc(ax, wildY, 18, 0, Math.PI * 2);
      ctx.fill();
      
      // Animal with fading health
      ctx.font = '26px Arial';
      ctx.globalAlpha = animal.health + Math.sin(time / 500 + idx) * 0.2;
      ctx.fillText(animal.emoji, ax - 13, wildY + 8);
      ctx.globalAlpha = 1;
      
      // Escape/migration arrows
      const fleePhase = ((time / 1800 + idx * 0.33) % 1);
      if (fleePhase < 0.7) {
        const arrowY = wildY - 20 - fleePhase * 30;
        ctx.strokeStyle = colors[1];
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1 - fleePhase;
        ctx.beginPath();
        ctx.moveTo(ax, arrowY);
        ctx.lineTo(ax, arrowY - 12);
        ctx.lineTo(ax - 4, arrowY - 8);
        ctx.moveTo(ax, arrowY - 12);
        ctx.lineTo(ax + 4, arrowY - 8);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });
    
    // Microorganism death in soil
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = '#C23B22';
    for (let i = 0; i < 6; i++) {
      const mx = cx - 40 + i * 15;
      const my = soilY - 15 + Math.sin(time / 500 + i) * 2;
      ctx.globalAlpha = 0.4 + Math.sin(time / 800 + i) * 0.3;
      ctx.fillText('✖', mx, my);
    }
    ctx.globalAlpha = 1;
    
    // RIGHT: Dead/dying vegetation showing biodiversity loss
    const plants = [
      { x: 70, y: 15, emoji: '🥀', size: '28px' },
      { x: 95, y: 30, emoji: '🥀', size: '24px' },
      { x: 115, y: 20, emoji: '🍂', size: '22px' }
    ];
    
    plants.forEach((plant, idx) => {
      const px = cx + plant.x;
      const py = cy + plant.y;
      const wilt = Math.sin(time / 1000 + idx) * 0.15;
      
      ctx.font = plant.size + ' Arial';
      ctx.globalAlpha = 0.5 + wilt;
      ctx.fillText(plant.emoji, px - 12, py);
      ctx.globalAlpha = 1;
    });
    
    // Toxic gas/dust clouds rising from soil
    const clouds = [
      { x: 55, y: -50, size: 20 },
      { x: 75, y: -45, size: 16 },
      { x: 95, y: -52, size: 18 }
    ];
    
    clouds.forEach((cloud, idx) => {
      const rise = ((time / 1500 + idx * 0.3) % 1);
      const cloudY = cy + cloud.y - rise * 20;
      const cloudSize = cloud.size + Math.sin(time / 700 + idx) * 3;
      
      ctx.fillStyle = `rgba(45, 90, 61, ${(1 - rise) * 0.5})`;
      ctx.beginPath();
      ctx.arc(cx + cloud.x, cloudY, cloudSize, 0, Math.PI * 2);
      ctx.arc(cx + cloud.x + 12, cloudY - 3, cloudSize * 0.6, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Biodiversity decline graph
    ctx.strokeStyle = '#C23B22';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 110, cy - 90);
    ctx.lineTo(cx - 95, cy - 85);
    ctx.lineTo(cx - 80, cy - 93);
    ctx.lineTo(cx - 65, cy - 80);
    ctx.lineTo(cx - 50, cy - 98);
    ctx.stroke();
    
    // Downward trend arrow
    ctx.fillStyle = '#C23B22';
    ctx.beginPath();
    ctx.moveTo(cx - 50, cy - 98);
    ctx.lineTo(cx - 55, cy - 93);
    ctx.lineTo(cx - 45, cy - 93);
    ctx.fill();
    
    // Soil fertility loss indicator
    ctx.font = 'bold 9px Arial';
    ctx.fillStyle = '#654321';
    ctx.fillText('Fertility', cx - 110, cy - 78);
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#C23B22';
    ctx.fillText('↓', cx - 107, cy - 63);
    
    // Labels with semi-transparent backgrounds
    ctx.font = 'bold 11px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(waterX - 32, waterY - 52, 90, 14);
    ctx.fillRect(cx + 38, soilY + 48, 95, 14);
    ctx.fillRect(cx - 25, wildY - 50, 85, 14);
    
    ctx.fillStyle = '#2D5A66';
    ctx.fillText('Water Pollution', waterX - 30, waterY - 42);
    ctx.fillStyle = '#654321';
    ctx.fillText('Ecosystem Collapse', cx + 40, soilY + 58);
    ctx.fillStyle = colors[1];
    ctx.fillText('Wildlife Exodus', cx - 23, wildY - 40);
  }
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  new ImpactCycler();
});
