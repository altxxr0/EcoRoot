/* =============================================
   EcoRoot - Consequences Section
   Interactive ecosystem diagram
   ============================================= */

class ConsequencesSection {
    constructor() {
        this.diagram = Utils.$('#ecosystemDiagram');
        this.modal = Utils.$('#impactModal');
        this.modalClose = Utils.$('#modalClose');
        this.modalIcon = Utils.$('#modalIcon');
        this.modalTitle = Utils.$('#modalTitle');
        this.modalBody = Utils.$('#modalBody');
        this.modalVisual = Utils.$('#modalVisual');
        
        this.impactData = {
            soil: {
                icon: '🌍',
                title: 'Polluted Soil - The Source',
                content: `
                    <p>Soil pollution is the silent crisis beneath our feet. When contaminants infiltrate the ground, they don't stay put – they spread through every connected system.</p>
                    <p><strong>Key facts:</strong></p>
                    <ul>
                        <li>Over 3 million sites in the EU alone are potentially contaminated</li>
                        <li>Soil degradation affects 33% of Earth's soils</li>
                        <li>It takes 1,000 years to generate just 3cm of topsoil</li>
                    </ul>
                    <div class="citations">
                        <p><strong>Sources:</strong></p>
                        <p class="citation">FAO (2015). Status of the World's Soil Resources.</p>
                        <p class="citation">European Environment Agency (2019). Contaminated sites in Europe.</p>
                        <p class="citation">UNCCD (2017). Global Land Outlook Report.</p>
                    </div>
                `,
                visual: 'soil-animation'
            },
            plants: {
                icon: '🌾',
                title: 'Crops & Plants - Contaminated Harvests',
                content: `
                    <p>Plants absorb nutrients – and pollutants – through their roots. Heavy metals and chemicals enter our food supply before we even realize it.</p>
                    <p><strong>The contamination pathway:</strong></p>
                    <ul>
                        <li>Roots absorb heavy metals like lead, cadmium, and arsenic</li>
                        <li>Toxins accumulate in edible parts (grains, leaves, fruits)</li>
                        <li>Reduced crop yields affect food security</li>
                        <li>Genetic damage to plants reduces biodiversity</li>
                    </ul>
                    <div class="citations">
                        <p><strong>Sources:</strong></p>
                        <p class="citation">WHO (2019). Heavy metals in food crops and health risks.</p>
                        <p class="citation">Journal of Environmental Quality (2018). Phytoremediation of heavy metal-contaminated soils.</p>
                    </div>
                `,
                visual: 'plant-animation'
            },
            water: {
                icon: '💧',
                title: 'Water Sources - Hidden Contamination',
                content: `
                    <p>Soil acts as Earth's filter, but overwhelmed with pollutants, contaminants leach into groundwater and surface water.</p>
                    <p><strong>Water pollution pathways:</strong></p>
                    <ul>
                        <li>Pesticides and fertilizers seep into aquifers</li>
                        <li>2 billion people rely on contaminated groundwater</li>
                        <li>Nitrate pollution affects drinking water globally</li>
                        <li>Contaminated irrigation spreads pollution to new areas</li>
                    </ul>
                    <div class="citations">
                        <p><strong>Sources:</strong></p>
                        <p class="citation">UNESCO (2020). World Water Development Report.</p>
                        <p class="citation">EPA (2021). Groundwater contamination sources and prevention.</p>
                    </div>
                `,
                visual: 'water-animation'
            },
            animals: {
                icon: '🦎',
                title: 'Wildlife - Ecosystem Collapse',
                content: `
                    <p>From earthworms to mammals, soil pollution disrupts entire food chains. The creatures that maintain soil health are the first to disappear.</p>
                    <p><strong>Wildlife impacts:</strong></p>
                    <ul>
                        <li>Earthworm populations decline by up to 50% in polluted soils</li>
                        <li>Bioaccumulation increases toxin levels up the food chain</li>
                        <li>Habitat destruction forces migration and extinction</li>
                        <li>Soil microorganisms essential for nutrient cycling disappear</li>
                    </ul>
                    <div class="citations">
                        <p><strong>Sources:</strong></p>
                        <p class="citation">IUCN (2020). Soil pollution impacts on biodiversity.</p>
                        <p class="citation">Environmental Toxicology and Chemistry (2019). Bioaccumulation in terrestrial ecosystems.</p>
                    </div>
                `,
                visual: 'animal-animation'
            },
            humans: {
                icon: '👨‍👩‍👧‍👦',
                title: 'Human Health - Direct Impacts',
                content: `
                    <p>We eat from contaminated soil, drink contaminated water, and breathe contaminated dust. The health impacts are devastating and often invisible.</p>
                    <p><strong>Health consequences:</strong></p>
                    <ul>
                        <li>Lead exposure causes developmental delays in 800+ million children</li>
                        <li>Increased cancer rates near contaminated sites</li>
                        <li>Neurological damage from heavy metal exposure</li>
                        <li>Respiratory issues from soil dust particles</li>
                        <li>Endocrine disruption from pesticide residues</li>
                    </ul>
                    <div class="citations">
                        <p><strong>Sources:</strong></p>
                        <p class="citation">UNICEF & Pure Earth (2020). The Toxic Truth: Children's exposure to lead pollution.</p>
                        <p class="citation">WHO (2021). Soil pollution and human health nexus.</p>
                        <p class="citation">The Lancet (2017). Health impacts of environmental contamination.</p>
                    </div>
                `,
                visual: 'health-animation'
            },
            economy: {
                icon: '📉',
                title: 'Economy - Hidden Costs',
                content: `
                    <p>Soil pollution costs the global economy hundreds of billions annually through lost agricultural productivity, healthcare costs, and remediation expenses.</p>
                    <p><strong>Economic impacts:</strong></p>
                    <ul>
                        <li>$400 billion annual cost of soil degradation globally</li>
                        <li>Reduced crop yields decrease farmer incomes</li>
                        <li>Property values plummet near contaminated sites</li>
                        <li>Remediation costs can exceed $100,000 per acre</li>
                        <li>Healthcare burden from pollution-related diseases</li>
                    </ul>
                    <div class="citations">
                        <p><strong>Sources:</strong></p>
                        <p class="citation">FAO & ITPS (2015). Economic valuation of soil degradation.</p>
                        <p class="citation">World Bank (2019). The hidden costs of soil degradation.</p>
                        <p class="citation">EPA (2020). Superfund site remediation cost analysis.</p>
                    </div>
                `,
                visual: 'economy-animation'
            },
            climate: {
                icon: '🌡️',
                title: 'Climate - A Vicious Cycle',
                content: `
                    <p>Healthy soil stores 3x more carbon than the atmosphere. Degraded soil releases carbon and worsens climate change.</p>
                    <p><strong>Climate connections:</strong></p>
                    <ul>
                        <li>Soil contains 2,500 billion tons of carbon</li>
                        <li>Degraded soils release stored CO2 into atmosphere</li>
                        <li>Reduced plant growth means less carbon capture</li>
                        <li>Climate change accelerates soil degradation</li>
                        <li>Extreme weather events worsen erosion and pollution spread</li>
                    </ul>
                    <div class="citations">
                        <p><strong>Sources:</strong></p>
                        <p class="citation">IPCC (2019). Climate Change and Land Report.</p>
                        <p class="citation">Nature (2017). Soil carbon sequestration impacts on global climate change.</p>
                        <p class="citation">Science (2018). Soil degradation and greenhouse gas emissions.</p>
                    </div>
                `,
                visual: 'climate-animation'
            }
        };

        if (this.diagram) {
            this.init();
        }
    }

    init() {
        this.setupElements();
        this.setupModal();
        this.positionElements();
        this.setupAnimations();
    }

    setupElements() {
        const elements = Utils.$$('.ecosystem-element', this.diagram);
        
        elements.forEach(element => {
            element.addEventListener('click', (e) => {
                const type = element.dataset.element;
                this.showImpactModal(type);
            });

            // Hover effects
            element.addEventListener('mouseenter', () => {
                this.highlightConnections(element.dataset.element);
            });

            element.addEventListener('mouseleave', () => {
                this.resetConnections();
            });
        });
    }

    positionElements() {
        const elements = Utils.$$('.ecosystem-element:not(.central)', this.diagram);
        const radius = Math.min(this.diagram.offsetWidth, this.diagram.offsetHeight) * 0.35;
        const centerX = this.diagram.offsetWidth / 2;
        const centerY = this.diagram.offsetHeight / 2;

        elements.forEach((element, index) => {
            const angle = (index / elements.length) * Math.PI * 2 - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            element.style.left = `${x - 40}px`;
            element.style.top = `${y - 50}px`;

            // Update connection line
            const line = element.querySelector('.connection-line');
            if (line) {
                const lineLength = radius - 60;
                line.style.width = `${lineLength}px`;
                line.style.transform = `rotate(${(angle * 180 / Math.PI) + 180}deg)`;
            }
        });

        // Handle window resize
        window.addEventListener('resize', Utils.debounce(() => {
            this.positionElements();
        }, 200));
    }

    setupModal() {
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.closeModal());
        }

        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    showImpactModal(type) {
        const data = this.impactData[type];
        if (!data) return;

        // Split content and citations
        const contentParts = data.content.split('<div class="citations">');
        const mainContent = contentParts[0];
        const citations = contentParts[1] ? '<div class="citations">' + contentParts[1] : '';

        this.modalIcon.textContent = data.icon;
        this.modalTitle.textContent = data.title;
        this.modalBody.innerHTML = mainContent;
        this.renderVisual(data.visual);
        
        // Add citations after visual if they exist
        if (citations) {
            this.modalVisual.insertAdjacentHTML('afterend', citations);
        }

        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear any dynamically added citations
        const citations = this.modal.querySelector('.citations');
        if (citations && !this.modalBody.contains(citations)) {
            citations.remove();
        }
    }

    renderVisual(visualType) {
        this.modalVisual.innerHTML = '';

        switch (visualType) {
            case 'soil-animation':
                this.modalVisual.innerHTML = this.createSoilVisual();
                break;
            case 'plant-animation':
                this.modalVisual.innerHTML = this.createPlantVisual();
                break;
            case 'water-animation':
                this.modalVisual.innerHTML = this.createWaterVisual();
                break;
            case 'animal-animation':
                this.modalVisual.innerHTML = this.createAnimalVisual();
                break;
            case 'health-animation':
                this.modalVisual.innerHTML = this.createHealthVisual();
                break;
            case 'economy-animation':
                this.modalVisual.innerHTML = this.createEconomyVisual();
                break;
            case 'climate-animation':
                this.modalVisual.innerHTML = this.createClimateVisual();
                break;
        }
    }

    createSoilVisual() {
        return `
            <div class="visual-container soil-visual">
                <div class="soil-layer healthy">Healthy Topsoil</div>
                <div class="soil-layer contaminated">Contaminated Layer</div>
                <div class="soil-layer deep">Deep Soil</div>
                <div class="pollution-indicator">
                    <span class="indicator-dot"></span>
                    <span>Pollutants spreading</span>
                </div>
            </div>
            <style>
                .soil-visual {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .soil-layer {
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    font-weight: 500;
                    animation: fadeInUp 0.5s ease forwards;
                }
                .soil-layer.healthy { background: #5D4E37; color: white; opacity: 0; animation-delay: 0.1s; }
                .soil-layer.contaminated { background: #3A3028; color: #C45C4B; opacity: 0; animation-delay: 0.2s; }
                .soil-layer.deep { background: #2A2420; color: #9A9590; opacity: 0; animation-delay: 0.3s; }
                .pollution-indicator {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 10px;
                    color: #C45C4B;
                }
                .indicator-dot {
                    width: 10px;
                    height: 10px;
                    background: #C45C4B;
                    border-radius: 50%;
                    animation: pulse 1s ease infinite;
                }
            </style>
        `;
    }

    createPlantVisual() {
        return `
            <div class="visual-container plant-visual">
                <div class="plant-diagram">
                    <div class="plant-part leaves">🌿 Leaves (toxins accumulate)</div>
                    <div class="plant-part stem">🌱 Stem (transport pathway)</div>
                    <div class="plant-part roots">🫚 Roots (absorb pollutants)</div>
                </div>
                <div class="arrow-indicator">↑ Contamination flows upward</div>
            </div>
            <style>
                .plant-visual {
                    text-align: center;
                }
                .plant-diagram {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .plant-part {
                    padding: 12px;
                    border-radius: 8px;
                    font-weight: 500;
                    animation: fadeInUp 0.5s ease forwards;
                    opacity: 0;
                }
                .plant-part.leaves { background: rgba(124, 181, 24, 0.2); animation-delay: 0.3s; }
                .plant-part.stem { background: rgba(74, 124, 89, 0.2); animation-delay: 0.2s; }
                .plant-part.roots { background: rgba(196, 92, 75, 0.2); animation-delay: 0.1s; }
                .arrow-indicator {
                    margin-top: 15px;
                    color: #C45C4B;
                    font-weight: 600;
                }
            </style>
        `;
    }

    createWaterVisual() {
        return `
            <div class="visual-container water-visual">
                <div class="water-flow">
                    <div class="flow-item">💧 Surface Water</div>
                    <div class="flow-arrow">↓</div>
                    <div class="flow-item contaminated">🟤 Contaminated Soil</div>
                    <div class="flow-arrow">↓</div>
                    <div class="flow-item">💧 Groundwater</div>
                </div>
            </div>
            <style>
                .water-visual {
                    text-align: center;
                }
                .water-flow {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }
                .flow-item {
                    padding: 12px 24px;
                    background: rgba(74, 144, 164, 0.2);
                    border-radius: 8px;
                    font-weight: 500;
                }
                .flow-item.contaminated {
                    background: rgba(196, 92, 75, 0.2);
                }
                .flow-arrow {
                    font-size: 1.5rem;
                    color: #4A90A4;
                    animation: bounce 1s ease infinite;
                }
            </style>
        `;
    }

    createAnimalVisual() {
        return `
            <div class="visual-container animal-visual">
                <div class="food-chain">
                    <span class="chain-item">🦅</span>
                    <span class="chain-arrow">←</span>
                    <span class="chain-item">🐍</span>
                    <span class="chain-arrow">←</span>
                    <span class="chain-item">🐸</span>
                    <span class="chain-arrow">←</span>
                    <span class="chain-item">🐛</span>
                    <span class="chain-arrow">←</span>
                    <span class="chain-item contaminated">🌱</span>
                </div>
                <p class="visual-caption">Toxins bioaccumulate up the food chain</p>
            </div>
            <style>
                .animal-visual {
                    text-align: center;
                }
                .food-chain {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .chain-item {
                    font-size: 2rem;
                    padding: 8px;
                    background: rgba(74, 124, 89, 0.1);
                    border-radius: 50%;
                }
                .chain-item.contaminated {
                    background: rgba(196, 92, 75, 0.2);
                }
                .chain-arrow {
                    color: #C45C4B;
                    font-weight: bold;
                }
                .visual-caption {
                    margin-top: 15px;
                    color: #666;
                    font-style: italic;
                }
            </style>
        `;
    }

    createHealthVisual() {
        return `
            <div class="visual-container health-visual">
                <div class="health-impacts">
                    <div class="impact-item">🧠 Neurological</div>
                    <div class="impact-item">🫁 Respiratory</div>
                    <div class="impact-item">💔 Cardiovascular</div>
                    <div class="impact-item">🦴 Developmental</div>
                </div>
            </div>
            <style>
                .health-visual {
                    text-align: center;
                }
                .health-impacts {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }
                .impact-item {
                    padding: 15px;
                    background: rgba(196, 92, 75, 0.1);
                    border-radius: 8px;
                    font-weight: 500;
                    border-left: 3px solid #C45C4B;
                    animation: fadeInLeft 0.3s ease forwards;
                    opacity: 0;
                }
                .impact-item:nth-child(1) { animation-delay: 0.1s; }
                .impact-item:nth-child(2) { animation-delay: 0.2s; }
                .impact-item:nth-child(3) { animation-delay: 0.3s; }
                .impact-item:nth-child(4) { animation-delay: 0.4s; }
            </style>
        `;
    }

    createEconomyVisual() {
        return `
            <div class="visual-container economy-visual">
                <div class="cost-breakdown">
                    <div class="cost-item">
                        <span class="cost-label">Lost Productivity</span>
                        <div class="cost-bar" style="width: 80%;"></div>
                        <span class="cost-value">$200B</span>
                    </div>
                    <div class="cost-item">
                        <span class="cost-label">Healthcare Costs</span>
                        <div class="cost-bar" style="width: 60%;"></div>
                        <span class="cost-value">$120B</span>
                    </div>
                    <div class="cost-item">
                        <span class="cost-label">Remediation</span>
                        <div class="cost-bar" style="width: 40%;"></div>
                        <span class="cost-value">$80B</span>
                    </div>
                </div>
            </div>
            <style>
                .economy-visual {
                    padding: 10px;
                }
                .cost-breakdown {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .cost-item {
                    display: grid;
                    grid-template-columns: 120px 1fr 60px;
                    align-items: center;
                    gap: 10px;
                }
                .cost-label {
                    font-weight: 500;
                    font-size: 0.9rem;
                }
                .cost-bar {
                    height: 20px;
                    background: linear-gradient(90deg, #C45C4B, #D4A03B);
                    border-radius: 10px;
                    animation: progressGrow 1s ease forwards;
                }
                .cost-value {
                    font-weight: 700;
                    color: #C45C4B;
                }
            </style>
        `;
    }

    createClimateVisual() {
        return `
            <div class="visual-container climate-visual">
                <div class="climate-cycle">
                    <div class="cycle-item">🌍 Soil Degradation</div>
                    <div class="cycle-arrow">→</div>
                    <div class="cycle-item">💨 CO2 Release</div>
                    <div class="cycle-arrow">→</div>
                    <div class="cycle-item">🌡️ Temperature Rise</div>
                    <div class="cycle-arrow">→</div>
                    <div class="cycle-item">🌧️ Extreme Weather</div>
                    <div class="cycle-arrow cycle-back">↩</div>
                </div>
                <p class="visual-caption">A self-reinforcing cycle of destruction</p>
            </div>
            <style>
                .climate-visual {
                    text-align: center;
                }
                .climate-cycle {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                }
                .cycle-item {
                    padding: 10px 15px;
                    background: rgba(212, 160, 59, 0.2);
                    border-radius: 8px;
                    font-weight: 500;
                    font-size: 0.9rem;
                }
                .cycle-arrow {
                    color: #D4A03B;
                    font-size: 1.5rem;
                }
                .cycle-back {
                    width: 100%;
                    text-align: center;
                    color: #C45C4B;
                }
                .visual-caption {
                    margin-top: 15px;
                    color: #666;
                    font-style: italic;
                }
            </style>
        `;
    }

    highlightConnections(elementType) {
        const elements = Utils.$$('.ecosystem-element', this.diagram);
        
        elements.forEach(element => {
            if (element.dataset.element === elementType || element.dataset.element === 'soil') {
                element.style.transform = element.classList.contains('central') 
                    ? 'translate(-50%, -50%) scale(1.1)'
                    : 'scale(1.15)';
                element.style.zIndex = '20';
            } else {
                element.style.opacity = '0.5';
            }
        });
    }

    resetConnections() {
        const elements = Utils.$$('.ecosystem-element', this.diagram);
        
        elements.forEach(element => {
            element.style.transform = element.classList.contains('central')
                ? 'translate(-50%, -50%)'
                : '';
            element.style.opacity = '';
            element.style.zIndex = '';
        });
    }

    setupAnimations() {
        // Animate elements when section comes into view
        Utils.observeIntersection([this.diagram], (entry) => {
            if (entry.isIntersecting) {
                this.animateElements();
            }
        }, { threshold: 0.3 });
    }

    animateElements() {
        const elements = Utils.$$('.ecosystem-element', this.diagram);
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = element.classList.contains('central')
                ? 'translate(-50%, -50%) scale(0.8)'
                : 'scale(0.8)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = element.classList.contains('central')
                    ? 'translate(-50%, -50%) scale(1)'
                    : 'scale(1)';
            }, index * 100);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.consequencesSection = new ConsequencesSection();
});
