/* =============================================
   EcoRoot - Action Section
   Personalized action plan generator
   ============================================= */

class ActionSection {
    constructor() {
        this.contextSelector = Utils.$('#contextSelector');
        this.actionPlan = Utils.$('#actionPlan');
        this.generateBtn = Utils.$('#generatePlan');
        this.newPlanBtn = Utils.$('#newPlan');
        this.downloadBtn = Utils.$('#downloadPlan');
        this.planTitle = Utils.$('#planTitle');
        this.planSubtitle = Utils.$('#planSubtitle');
        
        this.selectedRole = null;
        this.selectedLocation = null;
        this.completedActions = [];

        this.actionData = {
            homeowner: {
                urban: {
                    title: 'Urban Homeowner Action Plan',
                    subtitle: 'Making a difference in city living',
                    immediate: [
                        { title: 'Test your soil', desc: 'Get a home soil testing kit to check for common contaminants', impact: 5 },
                        { title: 'Start a compost bin', desc: 'Reduce waste and create natural fertilizer for your plants', impact: 8 },
                        { title: 'Choose organic products', desc: 'Switch to organic fertilizers and pesticides for your garden', impact: 6 }
                    ],
                    shortTerm: [
                        { title: 'Create a rain garden', desc: 'Capture runoff and filter pollutants naturally', impact: 15 },
                        { title: 'Plant native species', desc: 'Native plants improve soil health without chemicals', impact: 12 },
                        { title: 'Join community garden', desc: 'Share knowledge and expand green spaces', impact: 10 }
                    ],
                    longTerm: [
                        { title: 'Advocate for green spaces', desc: 'Support local policies for urban soil protection', impact: 20 },
                        { title: 'Educate neighbors', desc: 'Share what you\'ve learned about soil health', impact: 15 },
                        { title: 'Monitor local contamination', desc: 'Stay informed about industrial activities in your area', impact: 18 }
                    ]
                },
                suburban: {
                    title: 'Suburban Homeowner Action Plan',
                    subtitle: 'Protecting your backyard ecosystem',
                    immediate: [
                        { title: 'Audit your lawn care', desc: 'Identify chemical products you can eliminate', impact: 7 },
                        { title: 'Install a compost system', desc: 'Turn yard waste into soil-enriching compost', impact: 9 },
                        { title: 'Mulch garden beds', desc: 'Protect soil from erosion and add organic matter', impact: 6 }
                    ],
                    shortTerm: [
                        { title: 'Create wildlife corridors', desc: 'Connect green spaces for healthier ecosystems', impact: 14 },
                        { title: 'Install permeable paving', desc: 'Reduce runoff and filter contaminants', impact: 16 },
                        { title: 'Start vermiculture', desc: 'Use worm composting for nutrient-rich soil', impact: 11 }
                    ],
                    longTerm: [
                        { title: 'Convert lawn to meadow', desc: 'Replace grass with native wildflowers', impact: 22 },
                        { title: 'Implement greywater system', desc: 'Reuse water while filtering contaminants', impact: 18 },
                        { title: 'Create neighborhood program', desc: 'Coordinate sustainable practices with neighbors', impact: 25 }
                    ]
                },
                rural: {
                    title: 'Rural Homeowner Action Plan',
                    subtitle: 'Stewarding the land for future generations',
                    immediate: [
                        { title: 'Comprehensive soil test', desc: 'Test for heavy metals, pH, and nutrient levels', impact: 8 },
                        { title: 'Map contamination sources', desc: 'Identify potential pollution sources on your property', impact: 7 },
                        { title: 'Protect water sources', desc: 'Create buffer zones around wells and streams', impact: 10 }
                    ],
                    shortTerm: [
                        { title: 'Plant cover crops', desc: 'Protect soil during off-seasons', impact: 15 },
                        { title: 'Establish composting operation', desc: 'Create large-scale composting for property use', impact: 18 },
                        { title: 'Create windbreaks', desc: 'Plant trees to prevent soil erosion', impact: 14 }
                    ],
                    longTerm: [
                        { title: 'Implement rotational practices', desc: 'Rotate land use to allow soil recovery', impact: 25 },
                        { title: 'Create wildlife sanctuary', desc: 'Dedicate portion of land to natural restoration', impact: 30 },
                        { title: 'Join land conservation program', desc: 'Protect your land through conservation easements', impact: 28 }
                    ]
                }
            },
            farmer: {
                urban: {
                    title: 'Urban Farmer Action Plan',
                    subtitle: 'Growing clean food in the city',
                    immediate: [
                        { title: 'Test all growing areas', desc: 'Check for lead and other urban contaminants', impact: 10 },
                        { title: 'Source clean inputs', desc: 'Verify compost and soil sources are uncontaminated', impact: 8 },
                        { title: 'Use raised beds', desc: 'Create barriers between crops and contaminated soil', impact: 9 }
                    ],
                    shortTerm: [
                        { title: 'Implement phytoremediation', desc: 'Use specific plants to clean contaminated areas', impact: 18 },
                        { title: 'Build community awareness', desc: 'Educate customers about soil health', impact: 12 },
                        { title: 'Create closed-loop systems', desc: 'Recycle all organic waste on-site', impact: 16 }
                    ],
                    longTerm: [
                        { title: 'Expand urban farming network', desc: 'Connect with other urban farmers for knowledge sharing', impact: 22 },
                        { title: 'Advocate for policy change', desc: 'Push for urban soil testing requirements', impact: 25 },
                        { title: 'Develop training programs', desc: 'Teach urban farming best practices', impact: 20 }
                    ]
                },
                suburban: {
                    title: 'Suburban Farmer Action Plan',
                    subtitle: 'Building sustainable local food systems',
                    immediate: [
                        { title: 'Soil health assessment', desc: 'Get comprehensive testing for all growing areas', impact: 9 },
                        { title: 'Eliminate synthetic inputs', desc: 'Transition to organic fertilizers and pest control', impact: 10 },
                        { title: 'Install water filtration', desc: 'Ensure irrigation water is contaminant-free', impact: 8 }
                    ],
                    shortTerm: [
                        { title: 'Implement no-till practices', desc: 'Protect soil structure and microbiome', impact: 18 },
                        { title: 'Create pollinator habitat', desc: 'Plant borders that support beneficial insects', impact: 14 },
                        { title: 'Start CSA program', desc: 'Connect directly with community for support', impact: 15 }
                    ],
                    longTerm: [
                        { title: 'Achieve organic certification', desc: 'Document and certify sustainable practices', impact: 28 },
                        { title: 'Implement agroforestry', desc: 'Integrate trees for long-term soil health', impact: 30 },
                        { title: 'Create farm education center', desc: 'Host workshops and school visits', impact: 25 }
                    ]
                },
                rural: {
                    title: 'Rural Farmer Action Plan',
                    subtitle: 'Leading agricultural regeneration',
                    immediate: [
                        { title: 'Complete soil mapping', desc: 'Test and map soil health across all fields', impact: 12 },
                        { title: 'Reduce chemical dependency', desc: 'Identify areas to cut synthetic inputs', impact: 11 },
                        { title: 'Protect water bodies', desc: 'Establish riparian buffers', impact: 10 }
                    ],
                    shortTerm: [
                        { title: 'Implement cover cropping', desc: 'Plant diverse cover crops in all rotations', impact: 20 },
                        { title: 'Integrate livestock', desc: 'Use animals for natural fertilization', impact: 22 },
                        { title: 'Join farmer network', desc: 'Share knowledge with regenerative farmers', impact: 15 }
                    ],
                    longTerm: [
                        { title: 'Full regenerative transition', desc: 'Implement comprehensive regenerative practices', impact: 35 },
                        { title: 'Carbon farming program', desc: 'Participate in carbon credit programs', impact: 30 },
                        { title: 'Create demonstration farm', desc: 'Host tours and training for other farmers', impact: 28 }
                    ]
                }
            },
            student: {
                urban: {
                    title: 'Urban Student Action Plan',
                    subtitle: 'Being the change in your community',
                    immediate: [
                        { title: 'Learn about local issues', desc: 'Research soil contamination in your area', impact: 5 },
                        { title: 'Start a school garden', desc: 'Create hands-on learning about soil health', impact: 8 },
                        { title: 'Reduce personal waste', desc: 'Minimize contributions to landfills', impact: 6 }
                    ],
                    shortTerm: [
                        { title: 'Organize cleanup events', desc: 'Lead community cleanups of contaminated areas', impact: 12 },
                        { title: 'Create awareness campaign', desc: 'Use social media to spread awareness', impact: 10 },
                        { title: 'Start composting program', desc: 'Implement composting at school', impact: 14 }
                    ],
                    longTerm: [
                        { title: 'Pursue environmental studies', desc: 'Consider careers in soil science or policy', impact: 20 },
                        { title: 'Lead youth environmental group', desc: 'Organize ongoing environmental action', impact: 18 },
                        { title: 'Advocate for curriculum change', desc: 'Push for soil education in schools', impact: 22 }
                    ]
                },
                suburban: {
                    title: 'Suburban Student Action Plan',
                    subtitle: 'Making your neighborhood greener',
                    immediate: [
                        { title: 'Audit home practices', desc: 'Help family switch to soil-friendly products', impact: 6 },
                        { title: 'Start backyard project', desc: 'Create a native plant or vegetable garden', impact: 7 },
                        { title: 'Research local ecology', desc: 'Learn about your local ecosystem', impact: 5 }
                    ],
                    shortTerm: [
                        { title: 'Create neighborhood map', desc: 'Document green spaces and potential contamination', impact: 11 },
                        { title: 'Organize youth volunteer group', desc: 'Coordinate regular environmental activities', impact: 13 },
                        { title: 'Partner with local businesses', desc: 'Get sponsors for environmental projects', impact: 12 }
                    ],
                    longTerm: [
                        { title: 'Establish permanent program', desc: 'Create lasting environmental initiatives', impact: 22 },
                        { title: 'Connect with universities', desc: 'Partner with researchers on local projects', impact: 18 },
                        { title: 'Run for student government', desc: 'Advocate for environmental policies', impact: 20 }
                    ]
                },
                rural: {
                    title: 'Rural Student Action Plan',
                    subtitle: 'Protecting your agricultural heritage',
                    immediate: [
                        { title: 'Learn farming practices', desc: 'Understand both traditional and modern methods', impact: 6 },
                        { title: 'Document family land', desc: 'Record soil health and land history', impact: 7 },
                        { title: 'Join 4-H or FFA', desc: 'Participate in agricultural education programs', impact: 8 }
                    ],
                    shortTerm: [
                        { title: 'Start soil monitoring project', desc: 'Track soil health changes over time', impact: 14 },
                        { title: 'Create youth farm network', desc: 'Connect with other young people in agriculture', impact: 12 },
                        { title: 'Develop sustainable business plan', desc: 'Plan for future sustainable farming', impact: 15 }
                    ],
                    longTerm: [
                        { title: 'Pursue agricultural education', desc: 'Study sustainable agriculture or soil science', impact: 25 },
                        { title: 'Plan family land succession', desc: 'Ensure sustainable practices continue', impact: 28 },
                        { title: 'Become community leader', desc: 'Lead local sustainability initiatives', impact: 24 }
                    ]
                }
            },
            business: {
                urban: {
                    title: 'Urban Business Owner Action Plan',
                    subtitle: 'Leading sustainable business practices',
                    immediate: [
                        { title: 'Audit waste practices', desc: 'Identify harmful materials in your waste stream', impact: 8 },
                        { title: 'Switch to green cleaning', desc: 'Use soil-safe cleaning products', impact: 6 },
                        { title: 'Assess property contamination', desc: 'Test soil if you have outdoor areas', impact: 9 }
                    ],
                    shortTerm: [
                        { title: 'Implement zero-waste policy', desc: 'Eliminate contributions to landfills', impact: 18 },
                        { title: 'Create green space', desc: 'Add plants or garden to your property', impact: 14 },
                        { title: 'Partner with local farms', desc: 'Source from sustainable local producers', impact: 16 }
                    ],
                    longTerm: [
                        { title: 'Achieve environmental certification', desc: 'Get B Corp or similar certification', impact: 28 },
                        { title: 'Lead business coalition', desc: 'Organize other businesses for collective action', impact: 25 },
                        { title: 'Fund remediation projects', desc: 'Support local soil cleanup efforts', impact: 30 }
                    ]
                },
                suburban: {
                    title: 'Suburban Business Owner Action Plan',
                    subtitle: 'Building sustainable commercial practices',
                    immediate: [
                        { title: 'Review supply chain', desc: 'Identify sources of potential contamination', impact: 9 },
                        { title: 'Landscape sustainably', desc: 'Use native plants and organic maintenance', impact: 7 },
                        { title: 'Proper chemical disposal', desc: 'Ensure all hazardous materials are disposed correctly', impact: 10 }
                    ],
                    shortTerm: [
                        { title: 'Install rain gardens', desc: 'Capture and filter parking lot runoff', impact: 16 },
                        { title: 'Create employee program', desc: 'Engage staff in sustainability initiatives', impact: 14 },
                        { title: 'Support local environmental groups', desc: 'Donate or volunteer for soil protection', impact: 12 }
                    ],
                    longTerm: [
                        { title: 'Retrofit building systems', desc: 'Upgrade to prevent all ground contamination', impact: 28 },
                        { title: 'Create industry standards', desc: 'Lead sector in environmental practices', impact: 32 },
                        { title: 'Develop training programs', desc: 'Share best practices with other businesses', impact: 25 }
                    ]
                },
                rural: {
                    title: 'Rural Business Owner Action Plan',
                    subtitle: 'Protecting land while growing business',
                    immediate: [
                        { title: 'Environmental impact assessment', desc: 'Understand your business\'s effect on local soil', impact: 10 },
                        { title: 'Secure chemical storage', desc: 'Prevent any leaks or spills', impact: 9 },
                        { title: 'Protect water sources', desc: 'Ensure operations don\'t contaminate groundwater', impact: 11 }
                    ],
                    shortTerm: [
                        { title: 'Implement best management practices', desc: 'Follow industry standards for environmental protection', impact: 18 },
                        { title: 'Create buffer zones', desc: 'Establish vegetation barriers around operations', impact: 16 },
                        { title: 'Support local agriculture', desc: 'Partner with and source from local farmers', impact: 14 }
                    ],
                    longTerm: [
                        { title: 'Achieve environmental leadership', desc: 'Become model for sustainable rural business', impact: 30 },
                        { title: 'Fund conservation programs', desc: 'Invest in local land protection', impact: 28 },
                        { title: 'Create succession plan', desc: 'Ensure environmental practices continue', impact: 25 }
                    ]
                }
            }
        };

        if (this.contextSelector) {
            this.init();
        }
    }

    init() {
        this.setupRoleSelector();
        this.setupLocationSelector();
        this.setupGenerateButton();
        this.setupNewPlanButton();
        this.setupDownloadButton();
        this.setupCounters();
    }

    setupRoleSelector() {
        const roleButtons = Utils.$$('#roleSelector .selector-btn');
        
        roleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                roleButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedRole = btn.dataset.role;
                this.checkGenerateButton();
            });
        });
    }

    setupLocationSelector() {
        const locationButtons = Utils.$$('#locationSelector .selector-btn');
        
        locationButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                locationButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedLocation = btn.dataset.location;
                this.checkGenerateButton();
            });
        });
    }

    checkGenerateButton() {
        const canGenerate = this.selectedRole && this.selectedLocation;
        this.generateBtn.disabled = !canGenerate;
    }

    setupGenerateButton() {
        this.generateBtn.addEventListener('click', () => {
            this.generateActionPlan();
        });
    }

    generateActionPlan() {
        const planData = this.actionData[this.selectedRole]?.[this.selectedLocation];
        if (!planData) return;

        this.completedActions = [];
        
        // Update plan header
        this.planTitle.textContent = planData.title;
        this.planSubtitle.textContent = planData.subtitle;

        // Populate action lists
        this.populateActionList('immediateActions', planData.immediate);
        this.populateActionList('shortTermActions', planData.shortTerm);
        this.populateActionList('longTermActions', planData.longTerm);

        // Calculate totals
        const totalActions = planData.immediate.length + planData.shortTerm.length + planData.longTerm.length;
        Utils.$('#totalCount').textContent = totalActions;
        
        // Show plan, hide selector
        this.contextSelector.style.display = 'none';
        this.actionPlan.style.display = 'block';
        this.actionPlan.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Save to local storage
        Utils.storage.set('ecoroot-plan', {
            role: this.selectedRole,
            location: this.selectedLocation,
            completed: []
        });
    }

    populateActionList(listId, actions) {
        const list = Utils.$(`#${listId}`);
        if (!list) return;

        list.innerHTML = '';

        actions.forEach((action, index) => {
            const actionId = `${listId}-${index}`;
            
            const li = Utils.createElement('li', { 'data-action-id': actionId });
            
            const checkbox = Utils.createElement('input', {
                type: 'checkbox',
                id: actionId,
                'data-impact': action.impact
            });
            
            checkbox.addEventListener('change', (e) => this.handleActionComplete(e, actionId, action.impact));

            const textDiv = Utils.createElement('div', { className: 'action-text' }, [
                Utils.createElement('span', { className: 'action-title' }, [action.title]),
                Utils.createElement('span', { className: 'action-desc' }, [action.desc])
            ]);

            li.appendChild(checkbox);
            li.appendChild(textDiv);
            list.appendChild(li);
        });
    }

    handleActionComplete(e, actionId, impact) {
        const li = e.target.closest('li');
        
        if (e.target.checked) {
            this.completedActions.push({ id: actionId, impact });
            li.classList.add('completed');
        } else {
            this.completedActions = this.completedActions.filter(a => a.id !== actionId);
            li.classList.remove('completed');
        }

        this.updateProgress();
    }

    updateProgress() {
        const totalActions = parseInt(Utils.$('#totalCount').textContent);
        const completed = this.completedActions.length;
        const totalImpact = this.completedActions.reduce((sum, a) => sum + a.impact, 0);
        const percentage = Math.round((completed / totalActions) * 100);

        Utils.$('#completedCount').textContent = completed;
        Utils.$('#impactScore').textContent = totalImpact;
        Utils.$('#overallProgress').style.width = `${percentage}%`;
        Utils.$('#progressText').textContent = `${percentage}% Complete`;

        // Save progress
        const savedPlan = Utils.storage.get('ecoroot-plan');
        if (savedPlan) {
            savedPlan.completed = this.completedActions;
            Utils.storage.set('ecoroot-plan', savedPlan);
        }
    }

    setupNewPlanButton() {
        this.newPlanBtn?.addEventListener('click', () => {
            // Reset UI
            this.actionPlan.style.display = 'none';
            this.contextSelector.style.display = 'block';
            
            // Reset selections
            Utils.$$('.selector-btn').forEach(btn => btn.classList.remove('active'));
            this.selectedRole = null;
            this.selectedLocation = null;
            this.generateBtn.disabled = true;
            
            // Clear storage
            Utils.storage.remove('ecoroot-plan');
        });
    }

    setupDownloadButton() {
        this.downloadBtn?.addEventListener('click', () => {
            this.downloadChecklist();
        });
    }

    downloadChecklist() {
        const planData = this.actionData[this.selectedRole]?.[this.selectedLocation];
        if (!planData) return;

        let content = `${planData.title}\n`;
        content += `${planData.subtitle}\n`;
        content += `${'='.repeat(50)}\n\n`;

        content += `IMMEDIATE ACTIONS (Start Today)\n`;
        content += `${'-'.repeat(30)}\n`;
        planData.immediate.forEach((action, i) => {
            const isCompleted = this.completedActions.some(a => a.id === `immediateActions-${i}`);
            content += `[${isCompleted ? 'X' : ' '}] ${action.title}\n`;
            content += `    ${action.desc}\n\n`;
        });

        content += `\nSHORT-TERM GOALS (This Month)\n`;
        content += `${'-'.repeat(30)}\n`;
        planData.shortTerm.forEach((action, i) => {
            const isCompleted = this.completedActions.some(a => a.id === `shortTermActions-${i}`);
            content += `[${isCompleted ? 'X' : ' '}] ${action.title}\n`;
            content += `    ${action.desc}\n\n`;
        });

        content += `\nLONG-TERM COMMITMENT (Ongoing)\n`;
        content += `${'-'.repeat(30)}\n`;
        planData.longTerm.forEach((action, i) => {
            const isCompleted = this.completedActions.some(a => a.id === `longTermActions-${i}`);
            content += `[${isCompleted ? 'X' : ' '}] ${action.title}\n`;
            content += `    ${action.desc}\n\n`;
        });

        content += `\n${'='.repeat(50)}\n`;
        content += `Generated by EcoRoot - ${new Date().toLocaleDateString()}\n`;
        content += `Together, we can heal our planet! 🌱\n`;

        // Create download
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'EcoRoot-Action-Plan.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    setupCounters() {
        const counters = Utils.$$('.counter-number');
        
        Utils.observeIntersection(counters, (entry) => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                const target = parseInt(entry.target.dataset.target);
                Utils.animateCounter(entry.target, target, 2500);
            }
        }, { threshold: 0.5 });
    }

    loadSavedPlan() {
        const savedPlan = Utils.storage.get('ecoroot-plan');
        if (savedPlan) {
            this.selectedRole = savedPlan.role;
            this.selectedLocation = savedPlan.location;
            this.completedActions = savedPlan.completed || [];
            
            // Restore UI
            Utils.$(`.selector-btn[data-role="${savedPlan.role}"]`)?.classList.add('active');
            Utils.$(`.selector-btn[data-location="${savedPlan.location}"]`)?.classList.add('active');
            
            // Generate plan and restore checkboxes
            this.generateActionPlan();
            
            this.completedActions.forEach(action => {
                const checkbox = Utils.$(`#${action.id}`);
                if (checkbox) {
                    checkbox.checked = true;
                    checkbox.closest('li')?.classList.add('completed');
                }
            });
            
            this.updateProgress();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.actionSection = new ActionSection();
    
    // Load saved plan if exists
    setTimeout(() => {
        window.actionSection.loadSavedPlan();
    }, 500);
});
