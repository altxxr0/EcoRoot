/* =============================================
   EcoRoot - Main JavaScript
   Navigation, scroll effects, and initialization
   ============================================= */

class EcoRootApp {
    constructor() {
        this.nav = Utils.$('#mainNav');
        this.navLinks = Utils.$$('.nav-link');
        this.navToggle = Utils.$('.nav-toggle');
        this.scrollProgress = Utils.$('#scrollProgress');
        this.sections = Utils.$$('section');
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupSmoothScrolling();
        this.setupAnimations();
        this.setupAccessibility();
        this.updateBodyBackground(); // Set initial background
    }

    setupNavigation() {
        // Mobile menu toggle
        this.navToggle?.addEventListener('click', () => {
            const navLinksContainer = Utils.$('.nav-links');
            navLinksContainer?.classList.toggle('active');
            this.navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                Utils.$('.nav-links')?.classList.remove('active');
                this.navToggle?.classList.remove('active');
            });
        });

        // Update nav style on scroll
        window.addEventListener('scroll', Utils.throttle(() => {
            this.updateNavStyle();
            this.updateActiveNavLink();
            this.updateScrollProgress();
            this.updateBodyBackground();
        }, 50));
    }

    updateNavStyle() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            this.nav?.classList.add('scrolled');
        } else {
            this.nav?.classList.remove('scrolled');
        }
    }

    updateBodyBackground() {
        const heroSection = Utils.$('#hero');
        if (!heroSection) return;
        
        const heroHeight = heroSection.offsetHeight;
        const scrollY = window.scrollY;
        
        // If we're in the hero section (top ~80% of hero height), use hero background
        if (scrollY < heroHeight * 0.8) {
            document.body.style.backgroundColor = '#2A1F15'; // Match hero gradient start
        } else {
            document.body.style.backgroundColor = ''; // Reset to default from CSS
        }
    }

    updateActiveNavLink() {
        let currentSection = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    updateScrollProgress() {
        const progress = Utils.getScrollProgress();
        if (this.scrollProgress) {
            this.scrollProgress.style.width = `${progress}%`;
        }
    }

    setupScrollEffects() {
        // Animate elements on scroll
        const animatedElements = Utils.$$('.animate-on-scroll');
        
        if (animatedElements.length > 0) {
            Utils.observeIntersection(animatedElements, (entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        }

        // Parallax effect for hero section
        const heroContent = Utils.$('.hero-content');
        if (heroContent) {
            window.addEventListener('scroll', Utils.throttle(() => {
                const scrollY = window.scrollY;
                const heroHeight = Utils.$('#hero')?.offsetHeight || 0;
                
                if (scrollY < heroHeight) {
                    // Slower parallax movement
                    const translateY = scrollY * 0.15;
                    // Content stays fully visible until 40% scroll, then fades more gradually
                    const fadeStart = heroHeight * 0.4;
                    const fadeRange = heroHeight * 0.5;
                    const opacity = scrollY < fadeStart ? 1 : 1 - ((scrollY - fadeStart) / fadeRange);
                    heroContent.style.transform = `translateY(${translateY}px)`;
                    heroContent.style.opacity = Math.max(0, opacity);
                }
            }, 16));
        }
    }

    setupSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const navHeight = this.nav?.offsetHeight || 0;
                    Utils.scrollTo(target, navHeight);
                }
            });
        });
    }

    setupAnimations() {
        // Add animation classes to elements
        this.addAnimationClasses();
        
        // Initialize section counters
        this.initializeCounters();
    }

    addAnimationClasses() {
        // Cards and interactive elements (NOT section headers - they should always be visible)
        Utils.$$('.detail-card, .impact-stat, .story-card').forEach((el, index) => {
            el.classList.add('animate-on-scroll');
            el.classList.add(`stagger-${(index % 4) + 1}`);
        });
    }

    initializeCounters() {
        const counters = Utils.$$('.stat-number[data-target], .counter-number[data-target]');
        
        Utils.observeIntersection(counters, (entry) => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                const target = parseInt(entry.target.dataset.target);
                Utils.animateCounter(entry.target, target, 2000);
            }
        }, { threshold: 0.5 });
    }

    setupAccessibility() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Escape key closes modals
            if (e.key === 'Escape') {
                Utils.$$('.modal.active, .impact-modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
                document.body.style.overflow = '';
            }
        });

        // Focus management
        Utils.$$('button, a, input, [tabindex]').forEach(el => {
            el.addEventListener('focus', () => {
                el.classList.add('focus-visible');
            });
            el.addEventListener('blur', () => {
                el.classList.remove('focus-visible');
            });
        });

        // Reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.classList.add('reduced-motion');
        }
    }
}

// Notification system
class NotificationSystem {
    constructor() {
        this.container = null;
        this.createContainer();
    }

    createContainer() {
        this.container = Utils.createElement('div', {
            className: 'notification-container',
            style: 'position: fixed; top: 80px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;'
        });
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 3000) {
        const notification = Utils.createElement('div', {
            className: `notification notification-${type}`,
            style: `
                padding: 12px 20px;
                background: ${type === 'success' ? '#4A7C59' : type === 'error' ? '#C45C4B' : '#4A90A4'};
                color: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideInRight 0.3s ease;
            `
        }, [message]);

        this.container.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Main app
    window.ecoRootApp = new EcoRootApp();
    
    // Notification system
    window.notifications = new NotificationSystem();
    
    // Log initialization
    console.log('🌱 EcoRoot initialized successfully!');
    
    // Show welcome notification after a delay
    setTimeout(() => {
        window.notifications?.show('Welcome to EcoRoot! Scroll down to explore.', 'info', 4000);
    }, 2000);
});

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.classList.add('page-hidden');
    } else {
        document.body.classList.remove('page-hidden');
    }
});

// Service worker registration (for PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}
