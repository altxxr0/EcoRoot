/* =============================================
   EcoRoot - FAQ Section
   Accordion functionality for FAQ items
   ============================================= */

class FAQSection {
    constructor() {
        this.faqItems = Utils.$$('.faq-item');
        this.init();
    }

    init() {
        if (this.faqItems.length === 0) return;

        this.setupAccordion();
        this.setupScrollAnimation();
    }

    setupAccordion() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            if (!question) return;

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                this.faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        if (otherQuestion) {
                            otherQuestion.setAttribute('aria-expanded', 'false');
                        }
                    }
                });

                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    question.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                    
                    // Smooth scroll to bring the opened item into view
                    setTimeout(() => {
                        const rect = item.getBoundingClientRect();
                        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
                        
                        if (!isVisible) {
                            item.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'nearest' 
                            });
                        }
                    }, 200);
                }
            });

            // Keyboard navigation
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    }

    setupScrollAnimation() {
        Utils.observeIntersection(this.faqItems, (entry) => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100 * Array.from(this.faqItems).indexOf(entry.target));
            }
        }, { threshold: 0.1 });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.faqSection = new FAQSection();
});
