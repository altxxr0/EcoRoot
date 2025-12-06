// ===== EcoRoot Interactive Presentation =====
// Fullscreen slide-based narrative with branching choices

document.addEventListener('DOMContentLoaded', () => {
  const qs = s => document.querySelector(s);
  const qsa = s => Array.from(document.querySelectorAll(s));
  const choiceTemplates = {};
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.documentElement.classList.add('motion-ready');

  // ===== STATE MANAGEMENT =====
  const state = {
    currentSlide: 0,
    causesChoice: null,
    preventionChoice: null,
    waterChoice: null,
    plantsChoice: null
  };

  // ===== DOM REFERENCES =====
  const presentationContainer = qs('.presentation-container');
  const slides = qsa('.slide');
  const modal = qs('.modal');
  const modalMessage = qs('.modal-message');
  const modalRetry = qs('#modal-retry');
  const startBtn = qs('[data-action="start"]');
  const continueBtn = qs('[data-action="continue"]');
  const restartBtn = qs('[data-action="restart"]');
  const causesVisual = qs('[data-visual="causes"]');
  const preventionVisual = qs('[data-visual="prevention"]');

  const causeElements = {
    truck: qs('[data-slide="2"] #waste-truck'),
    wastePile: qs('[data-slide="2"] #waste-pile'),
    pollutionCloud: qs('[data-slide="2"] .pollution-cloud-layer'),
    healingWave: qs('[data-slide="2"] .healing-wave-layer'),
    alertBeacon: qs('[data-slide="2"] .alert-beacon')
  };

  const preventionElements = {
    hazardLines: qs('[data-slide="3"] .hazard-lines'),
    healingRings: qs('[data-slide="3"] .healing-rings'),
    soilSparkles: qs('[data-slide="3"] .soil-sparkles'),
    hazardDump: qs('[data-slide="3"] #hazard-dump'),
    compostStation: qs('[data-slide="3"] #compost-station'),
    remediationLayer: qs('[data-slide="3"] #remediation-layer')
  };

  const waterElements = {
    river: qs('[data-slide="4"] #river-flow'),
    aquifer: qs('[data-slide="4"] #aquifer'),
    plume: qs('[data-slide="4"] #runoff-plume'),
    treatment: qs('[data-slide="4"] #treatment-plant'),
    buffer: qs('[data-slide="4"] #buffer-strip'),
    droplet: qs('[data-slide="4"] #water-droplet'),
    reeds: qs('[data-slide="4"] #riparian-reeds'),
    fish: qs('[data-slide="4"] #fish-school'),
    buoy: qs('[data-slide="4"] #sensor-buoy'),
    well: qs('[data-slide="4"] #water-well'),
    wellWater: qs('[data-slide="4"] #water-well .well-water'),
    culvert: qs('[data-slide="4"] #culvert'),
    community: qs('[data-slide="4"] #community-row')
  };

  const plantElements = {
    healthyCrops: qsa('[data-slide="5"] .crop.healthy'),
    sickCrops: qsa('[data-slide="5"] .crop.sick'),
    crate: qs('[data-slide="5"] #produce-crate'),
    rejectCrate: qs('[data-slide="5"] #reject-crate'),
    toxicityWave: qs('[data-slide="5"] #toxicity-wave'),
    nutrientSparkle: qs('[data-slide="5"] #nutrient-sparkle'),
    microbeLayer: qs('[data-slide="5"] #microbe-layer'),
    soilKit: qs('[data-slide="5"] #soil-kit'),
    safetyGear: qs('[data-slide="5"] #safety-gear'),
    nutrientMeter: qs('[data-slide="5"] #nutrient-meter'),
    meterBar: qs('[data-slide="5"] #nutrient-meter .meter-bar')
  };

  const sceneConfigs = {
    causes: { element: causesVisual, states: ['state-clean', 'state-polluted'] },
    prevention: { element: preventionVisual, states: ['state-heal', 'state-neglect'] }
  };

  const causeAnimationTargets = [
    { element: causeElements.truck, classes: ['anim-truck-drive', 'anim-truck-dump'] },
    { element: causeElements.wastePile, classes: ['anim-waste-surge', 'anim-waste-clear'] },
    { element: causeElements.pollutionCloud, classes: ['anim-cloud-burst'] },
    { element: causeElements.healingWave, classes: ['anim-wave'] },
    { element: causeElements.alertBeacon, classes: ['anim-beacon'] }
  ];

  const preventionAnimationTargets = [
    { element: preventionElements.hazardLines, classes: ['anim-hazard'] },
    { element: preventionElements.healingRings, classes: ['anim-heal'] },
    { element: preventionElements.soilSparkles, classes: ['anim-sparkle'] },
    { element: preventionElements.compostStation, classes: ['anim-compost-pop'] },
    { element: preventionElements.remediationLayer, classes: ['anim-remediation-rise'] },
    { element: preventionElements.hazardDump, classes: ['anim-hazard-shock'] }
  ];

  qsa('.choices[data-scene]').forEach(container => {
    const sceneKey = container.dataset.scene;
    if (sceneKey && !choiceTemplates[sceneKey]) {
      choiceTemplates[sceneKey] = container.innerHTML.trim();
    }
  });

  function setSceneState(sceneKey, nextState) {
    const config = sceneConfigs[sceneKey];
    if (!config || !config.element) return;
    config.states.forEach(cls => config.element.classList.remove(cls));
    if (nextState) {
      config.element.classList.add(nextState);
    }
  }

  function playAnimation(element, className) {
    if (!element) return;
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
  }

  function resetAnimationTargets(targets) {
    targets.forEach(target => {
      if (!target.element) return;
      target.classes.forEach(cls => target.element.classList.remove(cls));
    });
  }

  function isPositiveChoice(sceneName, choiceValue) {
    switch (sceneName) {
      case 'causes':
        return choiceValue === 'clean';
      case 'prevention':
        return choiceValue !== 'ignore';
      case 'water':
        return choiceValue !== 'ignore-water';
      case 'plants':
        return choiceValue !== 'sell';
      default:
        return false;
    }
  }

  function onChoiceButtonClick(evt) {
    const btn = evt.currentTarget;
    const sceneName = btn.getAttribute('data-scene');
    const slide = btn.closest('.slide');
    if (!slide || !sceneName) return;
    const slideIndex = parseInt(slide.getAttribute('data-slide'), 10);
    const choiceValue = btn.getAttribute('data-choice');

    qsa(`[data-slide="${slideIndex}"] .choice-btn[data-scene="${sceneName}"]`).forEach(b =>
      b.classList.remove('selected')
    );
    btn.classList.add('selected');

    const isCorrect = isPositiveChoice(sceneName, choiceValue);
    handleChoice(slideIndex, choiceValue, isCorrect, sceneName);
  }

  function attachChoiceHandler(btn) {
    if (!btn || btn.dataset.bound === 'true') return;
    btn.dataset.bound = 'true';
    btn.addEventListener('click', onChoiceButtonClick);
  }

  function bindChoiceButtons(scope = document) {
    if (!scope) return;
    scope.querySelectorAll('.choice-btn').forEach(attachChoiceHandler);
  }

  const sequenceSelectors = [
    '.slide-content > *',
    '.content-panel > *',
    '.visual-panel .visual-wrap',
    '.choices .choice-btn',
    '.controls',
    '.summary-box > *',
    '.takeaway-box > *',
    '.actions-grid > *',
    '.grid > *',
    '.action-details > *'
  ];

  function triggerSequence(root) {
    if (!root || prefersReducedMotion.matches) return;
    const seen = new Set();
    const ordered = [];
    ordered.push(...root.children);
    sequenceSelectors.forEach(selector => {
      root.querySelectorAll(selector).forEach(node => ordered.push(node));
    });

    ordered.forEach((node, index) => {
      if (!node || seen.has(node)) return;
      seen.add(node);
      node.style.setProperty('--sequence-index', index);
      node.classList.remove('sequence-enter');
      void node.offsetWidth;
      node.classList.add('sequence-enter');
    });
  }

  // ===== CORE SLIDE NAVIGATION =====
  function goToSlide(slideIndex) {
    if (slideIndex < 0 || slideIndex >= slides.length) return;

    const previousSlide = slides[state.currentSlide];
    const targetSlide = slides[slideIndex];

    slides.forEach((slide, idx) => {
      if (idx !== slideIndex) slide.classList.remove('active');
    });

    if (
      previousSlide &&
      previousSlide !== targetSlide &&
      previousSlide.classList.contains('active')
    ) {
      previousSlide.classList.add('slide-leaving');
      setTimeout(() => previousSlide.classList.remove('slide-leaving'), 450);
    }

    if (targetSlide) {
      targetSlide.classList.add('active');
      state.currentSlide = slideIndex;
      triggerSequence(targetSlide);
    }
  }

  function nextSlide() {
    if (state.currentSlide < slides.length - 1) {
      goToSlide(state.currentSlide + 1);
    }
  }

  function previousSlide() {
    if (state.currentSlide > 0) {
      goToSlide(state.currentSlide - 1);
    }
  }

  // ===== CHOICE HANDLING =====
  function handleChoice(slideIndex, choiceValue, isCorrect, sceneName) {
    // Store the choice
    if (sceneName === 'causes') {
      state.causesChoice = choiceValue;
    } else if (sceneName === 'prevention') {
      state.preventionChoice = choiceValue;
    } else if (sceneName === 'water') {
      state.waterChoice = choiceValue;
    } else if (sceneName === 'plants') {
      state.plantsChoice = choiceValue;
    }

    const currentSlide = slides[slideIndex];
    const contentPanel = currentSlide ? currentSlide.querySelector('.content-panel') : null;
    const choicesDiv = contentPanel ? contentPanel.querySelector('.choices') : null;
    const nextBtn = currentSlide ? currentSlide.querySelector('.btn-next') : null;

    if (isCorrect) {
      // CORRECT CHOICE: Show success message, enable next button
      animateVisualSuccess(sceneName);

      // Update content panel
      if (choicesDiv) {
        choicesDiv.innerHTML = `
          <div style="text-align: center; padding: 20px; animation: slideInUp 0.5s ease-out;">
            <h3 style="color: var(--accent); font-size: 1.5rem; margin: 0 0 10px;">✓ Excellent Choice!</h3>
            <p style="color: var(--text-secondary); margin: 0;">${getSuccessMessage(sceneName)}</p>
          </div>
        `;
      }

      if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.textContent = 'Continue to Next Section →';
        nextBtn.style.animation = 'slideInUp 0.5s ease-out 0.3s both';
      }
    } else {
      // INCORRECT CHOICE: Show failure message, disable next button
      animateVisualFail(sceneName);

      // Update content panel
      if (choicesDiv) {
        choicesDiv.innerHTML = `
          <div style="text-align: center; padding: 20px; animation: slideInUp 0.5s ease-out;">
            <h3 style="color: var(--danger); font-size: 1.5rem; margin: 0 0 10px;">✗ That didn't work...</h3>
            <p style="color: var(--text-secondary); margin: 10px 0;">${getFailureMessage(sceneName)}</p>
            <button class="btn btn-secondary retry-choice" style="margin-top: 15px;">Try a Different Choice</button>
          </div>
        `;

        // Add retry handler
        const retryBtn = choicesDiv.querySelector('.retry-choice');
        if (retryBtn) {
          retryBtn.addEventListener('click', () => {
            // Reset the slide
            resetSlideChoices(slideIndex, sceneName);
          });
        }
      }

      if (nextBtn) {
        nextBtn.disabled = true;
      }
    }
  }

  function getSuccessMessage(sceneName) {
    if (sceneName === 'causes') {
      return 'The factory adopted clean disposal practices. The environment is protected!';
    } else if (sceneName === 'prevention') {
      return 'The community took action to remediate the soil. Nature is healing!';
    } else if (sceneName === 'water') {
      return 'Runoff was filtered and groundwater stayed clear for every downstream neighbor.';
    } else if (sceneName === 'plants') {
      return 'Healthy soil grew nutrient-rich crops, keeping toxic harvests off the table.';
    }
    return 'Great decision!';
  }

  function getFailureMessage(sceneName) {
    if (sceneName === 'causes') {
      return 'Industrial pollution devastated the local ecosystem. Choose differently to protect the environment.';
    } else if (sceneName === 'prevention') {
      return 'Without action, the damage persists and spreads. Choose to take remediation action.';
    } else if (sceneName === 'water') {
      return 'Toxins washed into rivers and aquifers, putting wells and wetlands at risk. Try a cleaner runoff strategy.';
    } else if (sceneName === 'plants') {
      return 'Contaminated soil produced unhealthy crops that no one should eat. Pick a restorative farming step.';
    }
    return 'This choice led to negative consequences.';
  }

  function resetSlideChoices(slideIndex, sceneName) {
    const currentSlide = slides[slideIndex];
    const contentPanel = currentSlide ? currentSlide.querySelector('.content-panel') : null;
    const choicesDiv = contentPanel ? contentPanel.querySelector('.choices') : null;
    const nextBtn = currentSlide ? currentSlide.querySelector('.btn-next') : null;

    // Clear the state
    if (sceneName === 'causes') {
      state.causesChoice = null;
    } else if (sceneName === 'prevention') {
      state.preventionChoice = null;
    } else if (sceneName === 'water') {
      state.waterChoice = null;
    } else if (sceneName === 'plants') {
      state.plantsChoice = null;
    }

    // Reset visual
    if (sceneName === 'causes') {
      resetCausesVisuals();
    } else if (sceneName === 'prevention') {
      resetPreventionVisuals();
    } else if (sceneName === 'water') {
      resetWaterVisuals();
    } else if (sceneName === 'plants') {
      resetPlantsVisuals();
    }

    // Restore choice buttons
    if (choicesDiv) {
      const targetScene = choicesDiv.dataset.scene || sceneName;
      const template = targetScene ? choiceTemplates[targetScene] : null;
      if (template) {
        choicesDiv.innerHTML = template;
        bindChoiceButtons(choicesDiv);
      }
    }

    if (nextBtn) {
      nextBtn.disabled = true;
      nextBtn.textContent = 'Next Section';
      nextBtn.style.animation = 'none';
    }

    if (currentSlide && currentSlide.classList.contains('active')) {
      triggerSequence(currentSlide);
    }
  }

  function animateVisualSuccess(sceneName) {
    if (sceneName === 'causes') {
      animateCausesSuccess();
    } else if (sceneName === 'prevention') {
      animatePreventionSuccess();
    } else if (sceneName === 'water') {
      animateWaterSuccess();
    } else if (sceneName === 'plants') {
      animatePlantsSuccess();
    }
  }

  function animateVisualFail(sceneName) {
    if (sceneName === 'causes') {
      animateCausesFail();
    } else if (sceneName === 'prevention') {
      animatePreventionFail();
    } else if (sceneName === 'water') {
      animateWaterFail();
    } else if (sceneName === 'plants') {
      animatePlantsFail();
    }
  }

  function resetCausesVisuals() {
    const factory = qs('[data-slide="2"] .factory');
    const smoke = qs('[data-slide="2"] .smoke');
    const truck = qs('[data-slide="2"] #waste-truck');
    const wastePile = qs('[data-slide="2"] #waste-pile');
    const plant = qs('[data-slide="2"] .plant');
    const soil = qs('[data-slide="2"] .soil');
    const groundHighlight = qs('[data-slide="2"] #ground-highlight-causes');

    if (factory) {
      factory.style.opacity = '';
      factory.style.filter = '';
      factory.style.transform = '';
    }

    if (smoke) {
      smoke.style.opacity = '';
      smoke.style.transform = '';
      smoke.style.filter = '';
      smoke.style.animation = '';
    }

    if (truck) {
      truck.style.opacity = '';
      truck.style.right = '';
      truck.style.transform = '';
    }

    if (wastePile) {
      wastePile.style.opacity = '';
      wastePile.style.transform = '';
      wastePile.style.background = '';
      wastePile.style.filter = '';
    }

    if (plant) {
      plant.style.transform = '';
      plant.style.filter = '';
      plant.style.opacity = '';
    }

    if (soil) {
      soil.style.background = '';
      soil.style.filter = '';
    }

    if (groundHighlight) {
      groundHighlight.style.opacity = '';
      groundHighlight.style.transform = '';
    }

    setSceneState('causes', null);
    resetAnimationTargets(causeAnimationTargets);
  }

  function resetPreventionVisuals() {
    const soil = qs('[data-slide="3"] .soil');
    const plants = qsa('[data-slide="3"] .plant');

    if (soil) {
      soil.style.background = '';
      soil.style.filter = '';
    }

    plants.forEach(plant => {
      plant.style.transform = '';
      plant.style.filter = '';
      plant.style.opacity = '';
    });

    setSceneState('prevention', null);
    resetAnimationTargets(preventionAnimationTargets);
  }

  function resetWaterVisuals() {
    Object.values(waterElements).forEach(element => {
      if (!element) return;
      element.style.transition = '';
      element.style.filter = '';
      element.style.background = '';
      element.style.opacity = '';
      element.style.transform = '';
      element.style.animation = '';
    });

    if (waterElements.wellWater) {
      waterElements.wellWater.style.height = '';
    }
  }

  function resetPlantsVisuals() {
    plantElements.healthyCrops.forEach(crop => {
      crop.style.transition = '';
      crop.style.transform = '';
      crop.style.filter = '';
      crop.style.opacity = '';
    });

    plantElements.sickCrops.forEach(crop => {
      crop.style.transition = '';
      crop.style.transform = '';
      crop.style.filter = '';
      crop.style.opacity = '';
    });

    if (plantElements.crate) {
      plantElements.crate.style.transition = '';
      plantElements.crate.style.transform = '';
      plantElements.crate.style.filter = '';
    }

    if (plantElements.rejectCrate) {
      plantElements.rejectCrate.style.transition = '';
      plantElements.rejectCrate.style.transform = '';
      plantElements.rejectCrate.style.filter = '';
      plantElements.rejectCrate.style.opacity = '';
    }

    if (plantElements.toxicityWave) {
      plantElements.toxicityWave.style.opacity = '';
      plantElements.toxicityWave.style.transform = '';
      plantElements.toxicityWave.style.animation = '';
    }

    if (plantElements.nutrientSparkle) {
      plantElements.nutrientSparkle.style.opacity = '';
      plantElements.nutrientSparkle.style.animation = '';
    }

    if (plantElements.microbeLayer) {
      plantElements.microbeLayer.style.opacity = '';
      plantElements.microbeLayer.style.transform = '';
    }

    if (plantElements.soilKit) {
      plantElements.soilKit.style.transform = '';
      plantElements.soilKit.style.filter = '';
      plantElements.soilKit.style.opacity = '';
    }

    if (plantElements.safetyGear) {
      plantElements.safetyGear.style.transform = '';
      plantElements.safetyGear.style.filter = '';
      plantElements.safetyGear.style.opacity = '';
    }

    if (plantElements.nutrientMeter) {
      plantElements.nutrientMeter.style.transform = '';
      plantElements.nutrientMeter.style.filter = '';
    }

    if (plantElements.meterBar) {
      plantElements.meterBar.style.background = '';
      plantElements.meterBar.style.boxShadow = '';
      plantElements.meterBar.style.animation = '';
    }
  }

  // ===== ANIMATIONS =====
  function animateCausesSuccess() {
    // Truck arrives and picks up waste, plant thrives, soil improves
    const factory = qs('[data-slide="2"] .factory');
    const truck = qs('[data-slide="2"] #waste-truck');
    const wastePile = qs('[data-slide="2"] #waste-pile');
    const plant = qs('[data-slide="2"] .plant');
    const soil = qs('[data-slide="2"] .soil');
    const smoke = qs('[data-slide="2"] .smoke');
    const groundHighlight = qs('[data-slide="2"] #ground-highlight-causes');

    setSceneState('causes', 'state-clean');

    // Factory continues but less prominent
    if (factory) {
      factory.style.transition = 'all 1s ease-out';
      factory.style.filter = 'brightness(0.9)';
    }

    // Reduce smoke
    if (smoke) {
      smoke.style.transition = 'all 1.2s ease-out';
      smoke.style.opacity = '0.2';
      smoke.style.transform = 'scaleY(0.5) translateY(-20px)';
    }

    // Truck drives in to pick up waste
    if (truck) {
      truck.style.transition = 'opacity 0.4s ease';
      truck.style.opacity = '1';
      truck.style.right = '25px';
      playAnimation(truck, 'anim-truck-drive');
    }

    // Waste pile shrinks and disappears
    if (wastePile) {
      setTimeout(() => {
        playAnimation(wastePile, 'anim-waste-clear');
      }, 300);
    }

    // Plant thrives - grows and glows
    if (plant) {
      setTimeout(() => {
        plant.style.transition = 'all 1s ease-out';
        plant.style.transform = 'scale(1.35) translateY(-15px)';
        plant.style.filter = 'brightness(1.25) drop-shadow(0 0 25px #56c596)';
      }, 600);
    }

    // Ground highlight appears under thriving plant
    if (groundHighlight) {
      setTimeout(() => {
        groundHighlight.style.transition = 'all 0.8s ease-out';
        groundHighlight.style.opacity = '1';
      }, 700);
    }

    // Soil improves
    if (soil) {
      setTimeout(() => {
        soil.style.transition = 'all 1s ease-out';
        soil.style.background = 'linear-gradient(90deg, #6b7a4e 0%, #7a8a5e 100%)';
        soil.style.filter = 'brightness(1.15) saturate(1.3)';
      }, 600);
    }

    playAnimation(causeElements.healingWave, 'anim-wave');
  }

  function animateCausesFail() {
    // Factory pumps more waste, waste pile grows, plants wilt, soil becomes toxic
    const factory = qs('[data-slide="2"] .factory');
    const smoke = qs('[data-slide="2"] .smoke');
    const wastePile = qs('[data-slide="2"] #waste-pile');
    const plant = qs('[data-slide="2"] .plant');
    const soil = qs('[data-slide="2"] .soil');

    setSceneState('causes', 'state-polluted');

    // Factory intensifies - gets darker/hotter
    if (factory) {
      factory.style.transition = 'all 1s ease-out';
      factory.style.filter = 'brightness(0.7) drop-shadow(0 0 20px #ff6b6b)';
      factory.style.transform = 'scale(1.05)';
    }

    // Heavy smoke animation - continuous pumping
    if (smoke) {
      smoke.style.animation = 'none';
      smoke.style.transition = 'none';
      // Create animated smoke effect
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const newSmoke = smoke.cloneNode(true);
          newSmoke.style.transition = 'all 2s linear';
          newSmoke.style.opacity = '0.6';
          newSmoke.style.transform = `scaleY(2) translateY(-${50 + i * 20}px)`;
          smoke.parentElement.appendChild(newSmoke);
          setTimeout(() => newSmoke.remove(), 2000);
        }, i * 300);
      }
    }

    // Waste pile grows significantly
    if (wastePile) {
      playAnimation(wastePile, 'anim-waste-surge');
    }

    // Plant wilts and grays
    if (plant) {
      setTimeout(() => {
        plant.style.transition = 'all 1.2s ease-out';
        plant.style.transform = 'scaleY(0.6) translateY(10px) rotateZ(-8deg)';
        plant.style.filter = 'grayscale(100%) brightness(0.35) saturate(0) hue-rotate(10deg)';
      }, 300);
    }

    // Soil becomes toxic - red/brown and darkened
    if (soil) {
      setTimeout(() => {
        soil.style.transition = 'all 1s ease-out';
        soil.style.background = 'linear-gradient(90deg, #4a2a1a 0%, #2a1a0a 100%)';
        soil.style.filter = 'brightness(0.5) saturate(0.2) hue-rotate(5deg) drop-shadow(inset 0 0 20px rgba(255, 107, 107, 0.3))';
      }, 600);
    }

    playAnimation(causeElements.pollutionCloud, 'anim-cloud-burst');
    playAnimation(causeElements.alertBeacon, 'anim-beacon');
    playAnimation(causeElements.truck, 'anim-truck-dump');
  }

  function animatePreventionSuccess() {
    // Community action - trees grow, soil brightens, people celebrate
    const soil = qs('[data-slide="3"] .soil');
    const plants = qsa('[data-slide="3"] .plant');

    setSceneState('prevention', 'state-heal');

    // Soil heals - becomes vibrant green-brown
    if (soil) {
      soil.style.transition = 'all 1.2s ease-out';
      soil.style.background = 'linear-gradient(90deg, #7a8a5e 0%, #8a9a6e 100%)';
      soil.style.filter = 'brightness(1.3) saturate(1.5)';
    }

    // Plants multiply and grow
    plants.forEach((plant, i) => {
      setTimeout(() => {
        plant.style.transition = 'all 0.8s ease-out';
        plant.style.transform = 'scale(1.3) translateY(-15px)';
        plant.style.filter = 'brightness(1.25) drop-shadow(0 0 25px #56c596)';
      }, i * 200);
    });

    playAnimation(preventionElements.healingRings, 'anim-heal');
    playAnimation(preventionElements.soilSparkles, 'anim-sparkle');
    playAnimation(preventionElements.compostStation, 'anim-compost-pop');
    playAnimation(preventionElements.remediationLayer, 'anim-remediation-rise');
  }

  function animatePreventionFail() {
    // Inaction - plants wilt, soil darkens, becomes desolate
    const soil = qs('[data-slide="3"] .soil');
    const plants = qsa('[data-slide="3"] .plant');

    setSceneState('prevention', 'state-neglect');

    // Soil becomes barren
    if (soil) {
      soil.style.transition = 'all 1s ease-out';
      soil.style.background = 'linear-gradient(90deg, #3a2a1a 0%, #2a1a0a 100%)';
      soil.style.filter = 'brightness(0.5) saturate(0)';
    }

    // Plants wilt
    plants.forEach((plant, i) => {
      setTimeout(() => {
        plant.style.transition = 'all 0.8s ease-out';
        plant.style.transform = 'scaleY(0.6) translateY(10px)';
        plant.style.filter = 'grayscale(100%) brightness(0.3)';
      }, i * 150);
    });

    playAnimation(preventionElements.hazardLines, 'anim-hazard');
    playAnimation(preventionElements.hazardDump, 'anim-hazard-shock');
  }

  function animateWaterSuccess() {
    const {
      river,
      aquifer,
      plume,
      treatment,
      buffer,
      droplet,
      reeds,
      fish,
      buoy,
      well,
      wellWater,
      culvert,
      community
    } = waterElements;

    if (river) {
      river.style.transition = 'all 1s ease-out';
      river.style.filter = 'brightness(1.2) saturate(1.2)';
      river.style.background = 'linear-gradient(180deg,#1bb3e5,#1fd6ff,#0e6f97)';
    }

    if (aquifer) {
      aquifer.style.transition = 'all 0.9s ease-out';
      aquifer.style.filter = 'brightness(1.15) saturate(1.2)';
    }

    if (plume) {
      setTimeout(() => {
        plume.style.transition = 'all 0.8s ease-out';
        plume.style.opacity = '0';
        plume.style.transform = 'scale(0.7) translateY(10px)';
        plume.style.filter = 'blur(6px)';
      }, 150);
    }

    if (treatment) {
      treatment.style.transition = 'all 0.8s ease-out';
      treatment.style.transform = 'translateY(0) scale(1)';
      treatment.style.opacity = '1';
    }

    if (buffer) {
      buffer.style.transition = 'all 0.8s ease-out';
      buffer.style.opacity = '1';
      buffer.style.transform = 'scaleX(1)';
      buffer.style.animation = 'bufferPulse 1.8s ease-out forwards';
    }

    if (droplet) {
      droplet.style.opacity = '1';
      droplet.style.animation = 'none';
      void droplet.offsetWidth;
      droplet.style.animation = 'dropletRise 1.6s ease-out forwards';
    }

    if (reeds) {
      reeds.style.opacity = '0.95';
      reeds.style.transform = 'translateY(-6px)';
    }

    if (fish) {
      fish.style.opacity = '1';
      fish.style.filter = 'drop-shadow(0 8px 14px rgba(0,0,0,0.35))';
    }

    if (buoy) {
      buoy.style.transform = 'translate(-50%,-8px)';
      buoy.style.filter = 'drop-shadow(0 14px 22px rgba(86,197,150,0.45))';
    }

    if (well) {
      well.style.filter = 'drop-shadow(0 15px 35px rgba(86,197,150,0.4))';
      well.style.transform = 'translateY(-5px)';
    }

    if (wellWater) {
      wellWater.style.height = '70%';
      wellWater.style.filter = 'brightness(1.2)';
    }

    if (culvert) {
      culvert.style.filter = 'brightness(0.85)';
      culvert.style.transform = 'translateX(-6px)';
    }

    if (community) {
      community.style.opacity = '1';
      community.style.filter = 'drop-shadow(0 16px 30px rgba(86,197,150,0.35))';
    }
  }

  function animateWaterFail() {
    const {
      river,
      aquifer,
      plume,
      treatment,
      buffer,
      droplet,
      reeds,
      fish,
      buoy,
      well,
      wellWater,
      culvert,
      community
    } = waterElements;

    if (river) {
      river.style.transition = 'all 0.9s ease-out';
      river.style.filter = 'brightness(0.55) saturate(0.7)';
      river.style.background = 'linear-gradient(180deg,#0a3447,#07222f,#040f17)';
    }

    if (aquifer) {
      aquifer.style.transition = 'all 0.9s ease-out';
      aquifer.style.filter = 'brightness(0.6) saturate(0.8)';
    }

    if (plume) {
      plume.style.transition = 'all 0.8s ease-out';
      plume.style.opacity = '0.95';
      plume.style.transform = 'scale(1.25) translate(-25px, -10px)';
      plume.style.filter = 'blur(0)';
    }

    if (treatment) {
      treatment.style.transition = 'all 0.8s ease-out';
      treatment.style.transform = 'translateY(30px) scale(0.9)';
      treatment.style.opacity = '0.4';
    }

    if (buffer) {
      buffer.style.transition = 'all 0.8s ease-out';
      buffer.style.opacity = '0.2';
      buffer.style.transform = 'scaleX(0.6)';
      buffer.style.animation = '';
    }

    if (droplet) {
      droplet.style.opacity = '0';
      droplet.style.animation = '';
    }

    if (reeds) {
      reeds.style.opacity = '0.5';
      reeds.style.transform = 'translateY(8px)';
    }

    if (fish) {
      fish.style.opacity = '0.3';
      fish.style.filter = 'grayscale(0.5)';
    }

    if (buoy) {
      buoy.style.transform = 'translate(-50%,10px)';
      buoy.style.filter = 'grayscale(0.3) brightness(0.8)';
    }

    if (well) {
      well.style.filter = 'brightness(0.7)';
      well.style.transform = 'translateY(6px)';
    }

    if (wellWater) {
      wellWater.style.height = '40%';
      wellWater.style.filter = 'brightness(0.7)';
    }

    if (culvert) {
      culvert.style.filter = 'drop-shadow(0 0 18px rgba(255,107,107,0.4)) brightness(1.2)';
      culvert.style.transform = 'translateX(6px)';
    }

    if (community) {
      community.style.opacity = '0.7';
      community.style.filter = 'drop-shadow(0 10px 18px rgba(0,0,0,0.6))';
    }
  }

  function animatePlantsSuccess() {
    const {
      healthyCrops,
      sickCrops,
      crate,
      rejectCrate,
      toxicityWave,
      nutrientSparkle,
      microbeLayer,
      soilKit,
      safetyGear,
      nutrientMeter,
      meterBar
    } = plantElements;

    healthyCrops.forEach((crop, index) => {
      setTimeout(() => {
        crop.style.transition = 'all 0.8s ease-out';
        crop.style.transform = 'scale(1.2) translateY(-15px)';
        crop.style.filter = 'brightness(1.2) drop-shadow(0 0 18px rgba(86,197,150,0.6))';
      }, index * 120);
    });

    sickCrops.forEach((crop, index) => {
      setTimeout(() => {
        crop.style.transition = 'all 0.8s ease-out';
        crop.style.transform = 'scale(1.05) translateY(-8px)';
        crop.style.filter = 'brightness(1) saturate(1.2)';
        crop.style.opacity = '0.95';
      }, 200 + index * 120);
    });

    if (crate) {
      crate.style.transition = 'all 0.9s ease-out';
      crate.style.transform = 'translateY(0)';
      crate.style.filter = 'brightness(1.1) drop-shadow(0 10px 25px rgba(86,197,150,0.4))';
    }

    if (rejectCrate) {
      rejectCrate.style.transition = 'all 0.8s ease-out';
      rejectCrate.style.transform = 'translateY(40px)';
      rejectCrate.style.opacity = '0.2';
    }

    if (toxicityWave) {
      toxicityWave.style.transition = 'all 0.7s ease-out';
      toxicityWave.style.opacity = '0';
    }

    if (nutrientSparkle) {
      nutrientSparkle.style.opacity = '0.85';
      nutrientSparkle.style.animation = 'sparkleRise 2.4s ease-in-out infinite';
    }

    if (microbeLayer) {
      microbeLayer.style.opacity = '0.75';
      microbeLayer.style.transform = 'scale(1.05) translateY(-5px)';
    }

    if (soilKit) {
      soilKit.style.transform = 'translateY(0)';
      soilKit.style.filter = 'drop-shadow(0 10px 20px rgba(86,197,150,0.4))';
      soilKit.style.opacity = '1';
    }

    if (safetyGear) {
      safetyGear.style.transform = 'rotate(0deg) translateY(0)';
      safetyGear.style.filter = 'drop-shadow(0 8px 18px rgba(86,197,150,0.35))';
      safetyGear.style.opacity = '1';
    }

    if (nutrientMeter) {
      nutrientMeter.style.transform = 'translateY(-5px)';
      nutrientMeter.style.filter = 'drop-shadow(0 12px 30px rgba(86,197,150,0.45))';
    }

    if (meterBar) {
      meterBar.style.background = 'linear-gradient(180deg,#56c596,#9ef7c8,#d8ff9b)';
      meterBar.style.boxShadow = '0 0 16px rgba(86,197,150,0.6)';
      meterBar.style.animation = 'sparkleRise 2s ease-in-out infinite';
    }
  }

  function animatePlantsFail() {
    const {
      healthyCrops,
      sickCrops,
      crate,
      rejectCrate,
      toxicityWave,
      nutrientSparkle,
      microbeLayer,
      soilKit,
      safetyGear,
      nutrientMeter,
      meterBar
    } = plantElements;

    healthyCrops.forEach((crop, index) => {
      setTimeout(() => {
        crop.style.transition = 'all 0.7s ease-out';
        crop.style.transform = 'scale(0.85) translateY(12px)';
        crop.style.filter = 'grayscale(0.5) brightness(0.6)';
      }, index * 100);
    });

    sickCrops.forEach((crop, index) => {
      setTimeout(() => {
        crop.style.transition = 'all 0.7s ease-out';
        crop.style.transform = 'scale(0.8) translateY(18px) rotate(-4deg)';
        crop.style.filter = 'grayscale(0.7) brightness(0.45)';
        crop.style.opacity = '0.6';
      }, 150 + index * 100);
    });

    if (crate) {
      crate.style.transition = 'all 0.9s ease-out';
      crate.style.transform = 'translateY(30px)';
      crate.style.filter = 'grayscale(0.3) brightness(0.7)';
    }

    if (rejectCrate) {
      rejectCrate.style.transition = 'all 0.9s ease-out';
      rejectCrate.style.transform = 'translateY(0)';
      rejectCrate.style.opacity = '1';
      rejectCrate.style.filter = 'drop-shadow(0 10px 25px rgba(255,107,107,0.4))';
    }

    if (toxicityWave) {
      toxicityWave.style.opacity = '0.75';
      toxicityWave.style.transform = 'scale(1.05)';
      toxicityWave.style.animation = 'toxicityPulse 3s ease-in-out infinite';
    }

    if (nutrientSparkle) {
      nutrientSparkle.style.opacity = '0';
      nutrientSparkle.style.animation = '';
    }

    if (microbeLayer) {
      microbeLayer.style.opacity = '0.2';
      microbeLayer.style.transform = 'scale(0.95)';
    }

    if (soilKit) {
      soilKit.style.transform = 'translateY(30px) rotate(-6deg)';
      soilKit.style.filter = 'grayscale(0.3) brightness(0.85)';
      soilKit.style.opacity = '0.8';
    }

    if (safetyGear) {
      safetyGear.style.transform = 'rotate(-18deg) translateY(25px)';
      safetyGear.style.filter = 'grayscale(0.4) brightness(0.8)';
      safetyGear.style.opacity = '0.8';
    }

    if (nutrientMeter) {
      nutrientMeter.style.transform = 'translateY(10px)';
      nutrientMeter.style.filter = 'brightness(0.7)';
    }

    if (meterBar) {
      meterBar.style.background = 'linear-gradient(180deg,#ff6b6b,#ff956b,#ffcd6b)';
      meterBar.style.boxShadow = '0 0 10px rgba(255,107,107,0.4)';
      meterBar.style.animation = '';
    }
  }

  // ===== MODAL HANDLING =====
  function showModal(message) {
    if (modalMessage) modalMessage.textContent = message;
    modal.classList.remove('hidden');
  }

  function hideModal() {
    modal.classList.add('hidden');
  }

  // ===== FINAL SUMMARY GENERATION =====
  function generateConclusion() {
    const summaryBox = qs('[data-slide="6"] .summary-box');
    if (!summaryBox) return;

    const outcomes = {
      causes: state.causesChoice === 'clean',
      prevention:
        state.preventionChoice === 'compost' ||
        state.preventionChoice === 'phytoremediation',
      water: state.waterChoice && state.waterChoice !== 'ignore-water',
      plants: state.plantsChoice && state.plantsChoice !== 'sell'
    };

    const descriptors = [
      {
        key: 'causes',
        label: 'Industry & Policy',
        good: 'Regulated disposal kept toxins out of soil and air.',
        bad: 'Unchecked dumping let pollution seep into everything.'
      },
      {
        key: 'prevention',
        label: 'Community Remediation',
        good: 'Neighbors composted, planted remediators, and rebuilt soil life.',
        bad: 'Inaction let legacy contamination linger underground.'
      },
      {
        key: 'water',
        label: 'Water Resources',
        good: 'Runoff filters kept rivers, wetlands, and wells clear.',
        bad: 'Leaching chemicals clouded streams and aquifers.'
      },
      {
        key: 'plants',
        label: 'Food & Plants',
        good: 'Biochar, rotation, and testing delivered safe harvests.',
        bad: 'Crops carried toxins forward into the food chain.'
      }
    ];

    const positiveCount = Object.values(outcomes).filter(Boolean).length;

    let heading = '⚠️ Fragile Future';
    let intro =
      'Most systems stayed polluted, showing how quickly soil stress spreads to water and food.';

    if (positiveCount === 4) {
      heading = '🌿 Regenerative Momentum';
      intro = 'Every layer—from factories to farms—aligned, so soil, water, and harvests all healed.';
    } else if (positiveCount >= 2) {
      heading = '⚖️ Mixed Outcomes';
      intro = 'Some interventions worked, but gaps elsewhere kept the ecosystem on shaky ground.';
    }

    const listMarkup = descriptors
      .map(desc => `<li><strong>${desc.label}:</strong> ${outcomes[desc.key] ? desc.good : desc.bad}</li>`)
      .join('');

    summaryBox.innerHTML = `
      <h3>${heading}</h3>
      <p>${intro}</p>
      <ul class="outcome-list">${listMarkup}</ul>
    `;
  }

  // ===== EVENT LISTENERS =====

  // Start button (Hero slide)
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      goToSlide(1);
    });
  }

  // Continue button (Intro slide)
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      goToSlide(2);
    });
  }

  // Restart button (Conclusion slide)
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      state.currentSlide = 0;
      state.causesChoice = null;
      state.preventionChoice = null;
      state.waterChoice = null;
      state.plantsChoice = null;
      goToSlide(0);
      hideModal();

      [
        { index: 2, name: 'causes' },
        { index: 3, name: 'prevention' },
        { index: 4, name: 'water' },
        { index: 5, name: 'plants' }
      ].forEach(scene => resetSlideChoices(scene.index, scene.name));

      // Reset all choice buttons
      qsa('.choice-btn').forEach(btn => btn.classList.remove('selected'));

      // Reset all next buttons to disabled
      qsa('.btn-next').forEach(btn => (btn.disabled = true));

      // Reset visuals
      qsa('.plant').forEach(p => {
        p.style.transition = 'all 0.3s ease';
        p.style.transform = '';
        p.style.filter = '';
      });
      qsa('.soil').forEach(s => {
        s.style.transition = 'all 0.3s ease';
        s.style.background = '';
        s.style.filter = '';
      });
      qsa('.pollutant').forEach(poll => {
        poll.style.opacity = '0';
        poll.style.transform = 'translateY(-40px)';
      });
    });
  }

  bindChoiceButtons(document);

  // Next buttons (Scene progression)
  qsa('.btn-next').forEach(btn => {
    btn.addEventListener('click', function() {
      if (this.disabled) return;

      const currentSlide = parseInt(
        this.closest('.slide').getAttribute('data-slide'),
        10
      );
      const nextSlideIndex = currentSlide + 1;

      // Special handling for conclusion
      if (nextSlideIndex === slides.length - 1) {
        generateConclusion();
      }

      goToSlide(nextSlideIndex);
    });
  });

  // Modal retry button
  if (modalRetry) {
    modalRetry.addEventListener('click', () => {
      hideModal();
      
      // Clear the wrong choice and deselect buttons
      if (state.causesChoice === 'dump') {
        state.causesChoice = null;
        qsa('[data-slide="2"] .choice-btn').forEach(b => b.classList.remove('selected'));
      }
      if (state.preventionChoice === 'ignore') {
        state.preventionChoice = null;
        qsa('[data-slide="3"] .choice-btn').forEach(b => b.classList.remove('selected'));
      }
    });
  }

  // Close modal by clicking outside
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        hideModal();
        
        // Clear the wrong choice and deselect buttons when closing modal
        if (state.causesChoice === 'dump') {
          state.causesChoice = null;
          qsa('[data-slide="2"] .choice-btn').forEach(b => b.classList.remove('selected'));
        }
        if (state.preventionChoice === 'ignore') {
          state.preventionChoice = null;
          qsa('[data-slide="3"] .choice-btn').forEach(b => b.classList.remove('selected'));
        }
      }
    });
  }

  function setupScrollAnimations() {
    if (prefersReducedMotion.matches) return;
    const scrollTargets = qsa('.fade-in, .card, .action-card, .hero-stats .stat');
    if (!scrollTargets.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in-view');
          triggerSequence(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold:0.25, rootMargin:'0px 0px -50px 0px' }
    );

    scrollTargets.forEach(target => observer.observe(target));
  }

  function setupHeroParallax() {
    if (prefersReducedMotion.matches) return;
    const heroSlide = qs('.hero-slide');
    if (!heroSlide) return;

    heroSlide.addEventListener('pointermove', e => {
      const rect = heroSlide.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
      const heroOffsetX = relativeX * 30;
      const heroOffsetY = relativeY * 24;
      heroSlide.style.setProperty('--hero-parallaxX', `${heroOffsetX.toFixed(2)}px`);
      heroSlide.style.setProperty('--hero-parallaxY', `${heroOffsetY.toFixed(2)}px`);
      heroSlide.style.setProperty('--sun-parallaxX', `${(heroOffsetX * 0.4).toFixed(2)}px`);
      heroSlide.style.setProperty('--sun-parallaxY', `${(heroOffsetY * 0.4).toFixed(2)}px`);
    });

    heroSlide.addEventListener('pointerleave', () => {
      heroSlide.style.setProperty('--hero-parallaxX', '0px');
      heroSlide.style.setProperty('--hero-parallaxY', '0px');
      heroSlide.style.setProperty('--sun-parallaxX', '0px');
      heroSlide.style.setProperty('--sun-parallaxY', '0px');
    });
  }

  // ===== KEYBOARD NAVIGATION =====
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      const nextBtn = qs('.slide.active .btn-next:not([disabled])');
      if (nextBtn) nextBtn.click();
    }
    if (e.key === 'ArrowLeft' && state.currentSlide > 0) {
      previousSlide();
    }
    if (e.key === 'Escape') {
      hideModal();
    }
  });

  // ===== INITIALIZATION =====
  goToSlide(0);
  setupScrollAnimations();
  setupHeroParallax();

  // Expose state for debugging
  window.ecoroot = { state, goToSlide, nextSlide };
});
