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
        icon: '🌱',
        title: 'Plant Damage',
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
        icon: '🍽️',
        title: 'Food Contamination',
        points: [
          'Toxins enter food chain',
          'Heavy metals in crops',
          'Pesticide residues accumulate',
          'Unsafe produce for consumption',
          'Bioaccumulation in livestock'
        ],
        colors: ['#E07B3C', '#D4A03B'],
        visualize: 'food'
      },
      {
        icon: '🏥',
        title: 'Health Crisis',
        points: [
          'Skin & respiratory issues',
          'Exposure leads to infection',
          'Children most vulnerable',
          'Toxic accumulation in body',
          'Long-term disease development'
        ],
        colors: ['#C23B22', '#E07B3C'],
        visualize: 'humans'
      },
      {
        icon: '🐾',
        title: 'Wildlife Impact',
        points: [
          'Habitat collapse & destruction',
          'Forced migration patterns',
          'Population die-off events',
          'Disrupted food chains',
          'Loss of biodiversity'
        ],
        colors: ['#8B4513', '#5D4E37'],
        visualize: 'wildlife'
      },
      {
        icon: '💧',
        title: 'Water Contamination',
        points: [
          'Leaching poisons groundwater',
          'Surface water pollution',
          'Aquifer contamination',
          'Unsafe drinking water',
          'Agricultural runoff spread'
        ],
        colors: ['#4A90A4', '#2D5A3D'],
        visualize: 'water'
      },
      {
        icon: '🌫️',
        title: 'Air Quality Degradation',
        points: [
          'Dust particles released',
          'Harmful gases escape',
          'Respiratory hazards',
          'Toxic aerosols spread',
          'Atmospheric contamination'
        ],
        colors: ['#6B7B8C', '#4A5D3A'],
        visualize: 'air'
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
      case 'food':
        this.drawFoodViz(ctx, centerX, centerY, time, d.colors);
        break;
      case 'humans':
        this.drawHumansViz(ctx, centerX, centerY, time, d.colors);
        break;
      case 'wildlife':
        this.drawWildlifeViz(ctx, centerX, centerY, time, d.colors);
        break;
      case 'water':
        this.drawWaterViz(ctx, centerX, centerY, time, d.colors);
        break;
      case 'air':
        this.drawAirViz(ctx, centerX, centerY, time, d.colors);
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

  drawFoodViz(ctx, cx, cy, time, colors) {
    // Contaminated food chain visualization
    const soilY = cy + 80;
    
    // Contaminated soil base
    const soilGrad = ctx.createLinearGradient(cx, soilY - 20, cx, soilY + 60);
    soilGrad.addColorStop(0, '#8B4513');
    soilGrad.addColorStop(0.5, '#654321');
    soilGrad.addColorStop(1, '#3D2817');
    ctx.fillStyle = soilGrad;
    ctx.fillRect(cx - 140, soilY - 20, 280, 80);
    
    // Toxic particles in soil
    ctx.fillStyle = colors[0];
    for (let i = 0; i < 20; i++) {
      const px = cx - 130 + (i * 13);
      const py = soilY + 10 + Math.sin(time / 600 + i) * 8;
      const size = 3 + Math.sin(time / 800 + i) * 1.5;
      ctx.globalAlpha = 0.6 + Math.sin(time / 500 + i) * 0.3;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    // Contaminated crops growing from soil
    const crops = [
      { x: -80, emoji: '🌾', size: 32, contamination: 0.8 },
      { x: -40, emoji: '🥕', size: 30, contamination: 0.9 },
      { x: 0, emoji: '🌽', size: 34, contamination: 0.7 },
      { x: 40, emoji: '🥬', size: 28, contamination: 0.85 },
      { x: 80, emoji: '🍅', size: 30, contamination: 0.75 }
    ];
    
    crops.forEach((crop, idx) => {
      const cropX = cx + crop.x;
      const cropY = soilY - 35;
      
      // Contamination warning glow
      const glowSize = 25 + Math.sin(time / 800 + idx) * 5;
      ctx.fillStyle = colors[0] + '33';
      ctx.beginPath();
      ctx.arc(cropX, cropY, glowSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Crop emoji
      ctx.font = `${crop.size}px Arial`;
      ctx.fillText(crop.emoji, cropX - crop.size/2, cropY + crop.size/3);
      
      // Warning symbol above crop
      const warningPhase = ((time / 1500 + idx * 0.2) % 1);
      if (warningPhase < 0.6) {
        ctx.font = 'bold 18px Arial';
        ctx.globalAlpha = 1 - warningPhase * 1.5;
        ctx.fillStyle = '#FF4444';
        ctx.fillText('⚠', cropX - 9, cropY - 30 - warningPhase * 15);
        ctx.globalAlpha = 1;
      }
    });
    
    // Food chain arrow showing contamination spread
    ctx.strokeStyle = colors[1];
    ctx.fillStyle = colors[1];
    ctx.lineWidth = 3;
    
    // Arrow from soil to crops
    ctx.beginPath();
    ctx.moveTo(cx - 100, soilY - 5);
    ctx.lineTo(cx - 80, soilY - 25);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 80, soilY - 25);
    ctx.lineTo(cx - 85, soilY - 20);
    ctx.lineTo(cx - 75, soilY - 20);
    ctx.fill();
    
    // Arrow from crops to consumption
    ctx.beginPath();
    ctx.moveTo(cx + 80, soilY - 30);
    ctx.lineTo(cx + 105, cy - 60);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 105, cy - 60);
    ctx.lineTo(cx + 100, cy - 55);
    ctx.lineTo(cx + 100, cy - 65);
    ctx.fill();
    
    // Plate with contaminated food
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(cx + 110, cy - 50, 35, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.font = '24px Arial';
    ctx.fillText('🍽️', cx + 98, cy - 45);
    
    // Danger symbol on plate
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#FF0000';
    ctx.fillText('☠', cx + 128, cy - 42);
    
    // Chemical formula labels
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = colors[0];
    const chemicals = ['Pb', 'Hg', 'Cd', 'As'];
    chemicals.forEach((chem, idx) => {
      const chemX = cx - 120 + idx * 60;
      const chemY = soilY + 35 + Math.sin(time / 700 + idx) * 3;
      ctx.globalAlpha = 0.7 + Math.sin(time / 500 + idx) * 0.3;
      ctx.fillText(chem, chemX, chemY);
    });
    ctx.globalAlpha = 1;
    
    // Labels
    ctx.font = 'bold 11px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(cx - 45, soilY + 68, 90, 14);
    ctx.fillStyle = '#654321';
    ctx.fillText('Contaminated Soil', cx - 43, soilY + 78);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(cx + 75, cy - 80, 70, 14);
    ctx.fillStyle = '#C23B22';
    ctx.fillText('Unsafe Food', cx + 77, cy - 70);
  }

  drawWildlifeViz(ctx, cx, cy, time, colors) {
    // Wildlife habitat destruction and migration
    const soilY = cy + 70;
    
    // Degraded habitat/soil
    const soilGrad = ctx.createLinearGradient(cx, soilY - 15, cx, soilY + 50);
    soilGrad.addColorStop(0, '#A0826D');
    soilGrad.addColorStop(0.5, '#8B4513');
    soilGrad.addColorStop(1, '#654321');
    ctx.fillStyle = soilGrad;
    ctx.fillRect(cx - 140, soilY - 15, 280, 65);
    
    // Pollution spread in habitat
    ctx.fillStyle = colors[0] + '44';
    for (let i = 0; i < 25; i++) {
      const px = cx - 130 + Math.random() * 260;
      const py = soilY + Math.random() * 50;
      const size = 2 + Math.random() * 4;
      const wobble = Math.sin(time / 600 + i * 0.5) * 2;
      ctx.beginPath();
      ctx.arc(px + wobble, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Affected wildlife species
    const wildlife = [
      { emoji: '🦎', x: -90, y: -40, health: 0.4, speed: 1.2 },
      { emoji: '🐛', x: -50, y: -20, health: 0.3, speed: 0.8 },
      { emoji: '🐝', x: -10, y: -50, health: 0.5, speed: 1.5 },
      { emoji: '🐦', x: 30, y: -60, health: 0.6, speed: 1.0 },
      { emoji: '🐸', x: 70, y: -30, health: 0.35, speed: 0.9 }
    ];
    
    wildlife.forEach((animal, idx) => {
      const ax = cx + animal.x;
      const ay = cy + animal.y;
      
      // Sick/dying aura
      ctx.fillStyle = colors[0] + '33';
      const auraSize = 20 + Math.sin(time / 700 + idx) * 4;
      ctx.beginPath();
      ctx.arc(ax, ay, auraSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Animal with fading health
      ctx.font = '28px Arial';
      const healthPulse = animal.health + Math.sin(time / 600 + idx) * 0.15;
      ctx.globalAlpha = Math.max(0.3, healthPulse);
      ctx.fillText(animal.emoji, ax - 14, ay + 9);
      ctx.globalAlpha = 1;
      
      // Migration/escape arrows
      const fleePhase = ((time / (1500 * animal.speed) + idx * 0.25) % 1);
      if (fleePhase < 0.65) {
        const arrowY = ay - 25 - fleePhase * 40;
        const arrowX = ax + Math.sin(fleePhase * Math.PI) * 15;
        ctx.strokeStyle = colors[1];
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 1 - fleePhase * 1.3;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX, arrowY - 15);
        ctx.lineTo(arrowX - 5, arrowY - 10);
        ctx.moveTo(arrowX, arrowY - 15);
        ctx.lineTo(arrowX + 5, arrowY - 10);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });
    
    // Dead vegetation showing habitat loss
    const deadPlants = [
      { x: -110, y: -15, emoji: '🥀' },
      { x: -70, y: 5, emoji: '🍂' },
      { x: 90, y: -10, emoji: '🥀' },
      { x: 120, y: 10, emoji: '🍂' }
    ];
    
    deadPlants.forEach((plant, idx) => {
      ctx.font = '26px Arial';
      const wilt = Math.sin(time / 1000 + idx) * 0.2;
      ctx.globalAlpha = 0.5 + wilt;
      ctx.fillText(plant.emoji, cx + plant.x, cy + plant.y);
    });
    ctx.globalAlpha = 1;
    
    // Biodiversity decline graph
    ctx.strokeStyle = '#C23B22';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 120, cy + 80);
    ctx.lineTo(cx - 100, cy + 75);
    ctx.lineTo(cx - 80, cy + 68);
    ctx.lineTo(cx - 60, cy + 55);
    ctx.lineTo(cx - 40, cy + 38);
    ctx.stroke();
    
    // Downward arrow on graph
    ctx.fillStyle = '#C23B22';
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy + 38);
    ctx.lineTo(cx - 45, cy + 33);
    ctx.lineTo(cx - 35, cy + 33);
    ctx.fill();
    
    // Population decline counter
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#FF0000';
    const decline = Math.floor(45 + Math.sin(time / 2000) * 5);
    ctx.fillText(`-${decline}%`, cx + 90, cy + 65);
    
    // Labels
    ctx.font = 'bold 11px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(cx - 35, cy - 85, 105, 14);
    ctx.fillStyle = colors[1];
    ctx.fillText('Species Migration', cx - 33, cy - 75);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(cx + 60, cy + 52, 90, 14);
    ctx.fillStyle = '#C23B22';
    ctx.fillText('Population Loss', cx + 62, cy + 62);
  }

  drawWaterViz(ctx, cx, cy, time, colors) {
    // Water contamination and leaching visualization
    const soilY = cy + 50;
    
    // Multi-layer soil showing leaching
    const soilGrad = ctx.createLinearGradient(cx, soilY - 20, cx, soilY + 70);
    soilGrad.addColorStop(0, '#A0826D');
    soilGrad.addColorStop(0.3, '#8B4513');
    soilGrad.addColorStop(0.6, '#654321');
    soilGrad.addColorStop(1, '#3D2817');
    ctx.fillStyle = soilGrad;
    ctx.fillRect(cx - 140, soilY - 20, 280, 90);
    
    // Pollutants in soil
    ctx.fillStyle = colors[0];
    for (let i = 0; i < 30; i++) {
      const px = cx - 120 + (i * 8);
      const py = soilY + Math.random() * 40;
      const size = 2 + Math.random() * 3;
      ctx.globalAlpha = 0.6 + Math.sin(time / 500 + i) * 0.3;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    // Leaching droplets moving downward
    for (let i = 0; i < 8; i++) {
      const dropX = cx - 100 + i * 30;
      const phase = ((time / 1200 + i * 0.15) % 1);
      const dropY = soilY + 5 + phase * 55;
      
      if (phase < 0.85) {
        // Droplet
        ctx.fillStyle = colors[0] + 'CC';
        ctx.beginPath();
        ctx.arc(dropX, dropY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(dropX, dropY);
        ctx.lineTo(dropX - 3, dropY - 6);
        ctx.lineTo(dropX + 3, dropY - 6);
        ctx.fill();
        
        // Trail
        ctx.strokeStyle = colors[0] + '55';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(dropX, dropY - 7);
        ctx.lineTo(dropX, dropY - 15);
        ctx.stroke();
      }
    }
    
    // Groundwater layer (contaminated)
    const waterY = cy + 95;
    const waterGrad = ctx.createLinearGradient(cx, waterY, cx, waterY + 30);
    waterGrad.addColorStop(0, '#4A90A4' + '88');
    waterGrad.addColorStop(0.5, '#2D5A66' + 'AA');
    waterGrad.addColorStop(1, '#1A3D47' + 'CC');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(cx - 140, waterY, 280, 30);
    
    // Contamination spreading in water
    const contaminants = [
      { x: -110, size: 25, speed: 0.8 },
      { x: -60, size: 30, speed: 1.0 },
      { x: -10, size: 20, speed: 1.2 },
      { x: 40, size: 28, speed: 0.9 },
      { x: 90, size: 22, speed: 1.1 }
    ];
    
    contaminants.forEach((blob, idx) => {
      const blobX = cx + blob.x + Math.sin(time / (1000 * blob.speed) + idx) * 15;
      const blobY = waterY + 15 + Math.sin(time / (800 * blob.speed) + idx * 0.5) * 5;
      
      ctx.fillStyle = colors[0] + '66';
      ctx.beginPath();
      ctx.arc(blobX, blobY, blob.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Ripple effect
      const ripplePhase = ((time / 1500 + idx * 0.2) % 1);
      if (ripplePhase < 0.6) {
        ctx.strokeStyle = colors[0] + Math.floor((1 - ripplePhase) * 100).toString(16);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(blobX, blobY, blob.size + ripplePhase * 15, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
    
    // Wave pattern on water surface
    ctx.strokeStyle = '#6AB0C6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = -140; x <= 140; x += 10) {
      const waveY = waterY + Math.sin((x + time / 300) * 0.1) * 3;
      if (x === -140) ctx.moveTo(cx + x, waveY);
      else ctx.lineTo(cx + x, waveY);
    }
    ctx.stroke();
    
    // Contaminated water droplet reaching aquifer
    ctx.font = '32px Arial';
    ctx.fillText('💧', cx - 16, waterY + 22);
    
    // Toxic symbol in water
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#FF4444';
    const toxicPulse = 0.7 + Math.sin(time / 600) * 0.3;
    ctx.globalAlpha = toxicPulse;
    ctx.fillText('☠', cx + 50, waterY + 20);
    ctx.globalAlpha = 1;
    
    // Arrow showing downward movement
    ctx.strokeStyle = colors[1];
    ctx.fillStyle = colors[1];
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 50, soilY + 30);
    ctx.lineTo(cx - 50, soilY + 55);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 50, soilY + 55);
    ctx.lineTo(cx - 55, soilY + 50);
    ctx.lineTo(cx - 45, soilY + 50);
    ctx.fill();
    
    // Chemical formulas
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = colors[0];
    const chemicals = ['NO₃', 'PO₄', 'NH₄'];
    chemicals.forEach((chem, idx) => {
      const chemX = cx - 100 + idx * 60;
      const chemY = waterY + 42 + Math.sin(time / 700 + idx) * 2;
      ctx.globalAlpha = 0.8;
      ctx.fillText(chem, chemX, chemY);
    });
    ctx.globalAlpha = 1;
    
    // Labels
    ctx.font = 'bold 11px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(cx - 35, soilY - 35, 70, 14);
    ctx.fillStyle = '#654321';
    ctx.fillText('Leaching', cx - 33, soilY - 25);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(cx - 60, waterY - 15, 120, 14);
    ctx.fillStyle = '#2D5A66';
    ctx.fillText('Groundwater Pollution', cx - 58, waterY - 5);
  }

  drawAirViz(ctx, cx, cy, time, colors) {
    // Air pollution from contaminated soil
    const soilY = cy + 80;
    
    // Contaminated soil base
    const soilGrad = ctx.createLinearGradient(cx, soilY - 20, cx, soilY + 60);
    soilGrad.addColorStop(0, '#A0826D');
    soilGrad.addColorStop(0.4, '#8B4513');
    soilGrad.addColorStop(1, '#654321');
    ctx.fillStyle = soilGrad;
    ctx.fillRect(cx - 140, soilY - 20, 280, 80);
    
    // Heat/volatilization waves rising from soil
    for (let i = 0; i < 5; i++) {
      const wavePhase = ((time / 2000 + i * 0.2) % 1);
      const waveY = soilY - 20 - wavePhase * 100;
      const waveAlpha = (1 - wavePhase) * 0.3;
      
      ctx.strokeStyle = colors[0] + Math.floor(waveAlpha * 255).toString(16).padStart(2, '0');
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = -120; x <= 120; x += 8) {
        const y = waveY + Math.sin((x + time / 200) * 0.1) * 8;
        if (x === -120) ctx.moveTo(cx + x, y);
        else ctx.lineTo(cx + x, y);
      }
      ctx.stroke();
    }
    
    // Dust particles being lifted
    for (let i = 0; i < 40; i++) {
      const particlePhase = ((time / 1500 + i * 0.05) % 1);
      const px = cx - 130 + (i % 15) * 18 + Math.sin(time / 800 + i) * 10;
      const py = soilY - particlePhase * 140;
      const size = 2 + Math.random() * 2;
      
      if (particlePhase < 0.9) {
        ctx.fillStyle = '#654321' + Math.floor((1 - particlePhase) * 200).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Toxic gas clouds rising
    const gasClouds = [
      { x: -80, baseY: -30, size: 35, speed: 1.0 },
      { x: -30, baseY: -50, size: 40, speed: 0.8 },
      { x: 20, baseY: -40, size: 38, speed: 1.2 },
      { x: 70, baseY: -45, size: 36, speed: 0.9 }
    ];
    
    gasClouds.forEach((cloud, idx) => {
      const risePhase = ((time / (1800 * cloud.speed) + idx * 0.25) % 1);
      const cloudY = cy + cloud.baseY - risePhase * 50;
      const cloudX = cx + cloud.x + Math.sin(time / 1000 + idx) * 8;
      const cloudSize = cloud.size + Math.sin(time / 700 + idx) * 4;
      const cloudAlpha = (1 - risePhase) * 0.6;
      
      // Multi-bubble cloud
      ctx.fillStyle = colors[0] + Math.floor(cloudAlpha * 255).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, cloudSize, 0, Math.PI * 2);
      ctx.arc(cloudX + cloudSize * 0.5, cloudY - 5, cloudSize * 0.6, 0, Math.PI * 2);
      ctx.arc(cloudX - cloudSize * 0.4, cloudY + 3, cloudSize * 0.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Toxic symbol in cloud
      if (risePhase < 0.6) {
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#FF0000' + Math.floor(cloudAlpha * 255 * 1.2).toString(16).padStart(2, '0');
        ctx.fillText('☠', cloudX - 8, cloudY + 5);
      }
    });
    
    // VOC molecules (volatile organic compounds)
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = colors[1];
    const vocs = ['CH₄', 'C₆H₆', 'VOC'];
    vocs.forEach((voc, idx) => {
      const vocPhase = ((time / 1400 + idx * 0.3) % 1);
      const vocX = cx - 90 + idx * 70 + Math.sin(time / 900 + idx) * 12;
      const vocY = soilY - 30 - vocPhase * 90;
      
      if (vocPhase < 0.8) {
        ctx.globalAlpha = 1 - vocPhase;
        ctx.fillText(voc, vocX, vocY);
      }
    });
    ctx.globalAlpha = 1;
    
    // Wind direction arrows showing spread
    const windArrows = [
      { x: -100, y: -70 },
      { x: -50, y: -85 },
      { x: 0, y: -90 },
      { x: 50, y: -80 }
    ];
    
    windArrows.forEach((arrow, idx) => {
      const arrowPhase = ((time / 1200 + idx * 0.15) % 1);
      const arrowX = cx + arrow.x + arrowPhase * 40;
      const arrowY = cy + arrow.y;
      
      if (arrowPhase < 0.7) {
        ctx.strokeStyle = '#87CEEB' + Math.floor((1 - arrowPhase) * 180).toString(16).padStart(2, '0');
        ctx.fillStyle = '#87CEEB' + Math.floor((1 - arrowPhase) * 180).toString(16).padStart(2, '0');
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(arrowX - 15, arrowY);
        ctx.lineTo(arrowX, arrowY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - 5, arrowY - 4);
        ctx.lineTo(arrowX - 5, arrowY + 4);
        ctx.fill();
      }
    });
    
    // Air quality indicator
    ctx.font = 'bold 32px Arial';
    ctx.fillText('🌫️', cx + 95, cy - 60);
    
    // AQI (Air Quality Index) meter
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx + 110, cy - 30, 25, Math.PI, Math.PI * 2);
    ctx.stroke();
    
    // Danger zone in red
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx + 110, cy - 30, 25, Math.PI * 0.7, Math.PI * 0.4, true);
    ctx.stroke();
    
    // Needle
    const needleAngle = Math.PI * 0.6 + Math.sin(time / 1000) * 0.1;
    ctx.strokeStyle = '#C23B22';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx + 110, cy - 30);
    ctx.lineTo(cx + 110 + Math.cos(needleAngle) * 22, cy - 30 + Math.sin(needleAngle) * 22);
    ctx.stroke();
    
    // Labels
    ctx.font = 'bold 11px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(cx - 45, soilY + 68, 90, 14);
    ctx.fillStyle = '#654321';
    ctx.fillText('Soil Emissions', cx - 43, soilY + 78);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(cx + 55, cy - 95, 110, 14);
    ctx.fillStyle = colors[1];
    ctx.fillText('Atmospheric Spread', cx + 57, cy - 85);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(cx + 80, cy - 10, 65, 14);
    ctx.fillStyle = '#C23B22';
    ctx.fillText('Poor AQI', cx + 82, cy);
  }
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  new ImpactCycler();
});
