/* =============================================
   EcoRoot - Utility Functions
   ============================================= */

const Utils = {
    // DOM Helpers
    $(selector, context = document) {
        return context.querySelector(selector);
    },

    $$(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    },

    // Animation Helpers
    animate(element, keyframes, options = {}) {
        const defaultOptions = {
            duration: 300,
            easing: 'ease',
            fill: 'forwards'
        };
        return element.animate(keyframes, { ...defaultOptions, ...options });
    },

    // Smooth counter animation
    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = this.easeOutQuart(progress);
            const current = Math.floor(easeProgress * target);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    },

    // Easing functions
    easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    },

    easeInOutCubic(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    // Intersection Observer helper
    observeIntersection(elements, callback, options = {}) {
        const defaultOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => callback(entry));
        }, { ...defaultOptions, ...options });

        elements.forEach(el => observer.observe(el));
        return observer;
    },

    // Scroll progress calculation
    getScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        return docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    },

    // Get element's position relative to viewport
    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
            viewportTop: rect.top,
            viewportBottom: rect.bottom
        };
    },

    // Check if element is in viewport
    isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top < window.innerHeight - threshold &&
            rect.bottom > threshold
        );
    },

    // Smooth scroll to element
    scrollTo(target, offset = 0) {
        const element = typeof target === 'string' ? this.$(target) : target;
        if (!element) return;

        const targetPosition = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    // Generate unique ID
    generateId() {
        return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    // Local storage helpers
    storage: {
        get(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Storage get error:', e);
                return null;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage set error:', e);
                return false;
            }
        },
        remove(key) {
            localStorage.removeItem(key);
        }
    },

    // Color manipulation
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    },

    // Lerp (Linear interpolation)
    lerp(start, end, amount) {
        return start + (end - start) * amount;
    },

    // Clamp value between min and max
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    // Map value from one range to another
    map(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    },

    // Random number between range
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    // Random integer between range
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Create element with attributes
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key.startsWith('on')) {
                element.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        });

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });

        return element;
    },

    // Add class with animation frame for transitions
    addClass(element, className) {
        requestAnimationFrame(() => {
            element.classList.add(className);
        });
    },

    // Remove class with animation frame for transitions
    removeClass(element, className) {
        requestAnimationFrame(() => {
            element.classList.remove(className);
        });
    },

    // Toggle class
    toggleClass(element, className, force) {
        return element.classList.toggle(className, force);
    },

    // Wait for transition end
    onTransitionEnd(element, callback, property = null) {
        const handler = (e) => {
            if (property && e.propertyName !== property) return;
            element.removeEventListener('transitionend', handler);
            callback(e);
        };
        element.addEventListener('transitionend', handler);
    },

    // Wait for animation end
    onAnimationEnd(element, callback) {
        const handler = (e) => {
            element.removeEventListener('animationend', handler);
            callback(e);
        };
        element.addEventListener('animationend', handler);
    },

    // Detect touch device
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    // Get touch or mouse position
    getPointerPosition(event) {
        if (event.touches && event.touches.length > 0) {
            return {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
        }
        return {
            x: event.clientX,
            y: event.clientY
        };
    },

    // Format number with suffix
    formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
};

// Export for use in other modules
window.Utils = Utils;
