# EcoRoot - AI Agent Instructions

## Project Overview
EcoRoot is a single-page, vanilla JavaScript educational website about soil pollution. It features five interactive sections connected by scroll-based navigation, each with unique Canvas API animations and user interactions. No frameworks or build tools—just pure HTML/CSS/JS.

## Architecture Pattern: Section-Based Class System

Each major section is a **self-contained ES6 class** with Canvas rendering, stored in `js/<section>.js`:
- `HeroSection` - Scroll-triggered soil degradation animation
- `CausesSection` - Click-based pollution source visualization  
- `ConsequencesSection` - Modal-based ecosystem impact diagram
- `SolutionsSection` - Click-based restoration/remediation visualization
- `ActionSection` - Personalized action plan generator with localStorage

**Initialization flow** (`js/main.js`):
```javascript
// Section classes auto-initialize via constructors, then:
document.addEventListener('DOMContentLoaded', () => {
    window.ecoRootApp = new EcoRootApp(); // Navigation, scroll effects
    window.notifications = new NotificationSystem();
});
```

## Critical Developer Knowledge

### Canvas Pattern
All interactive sections use `<canvas>` with `requestAnimationFrame` loops:
```javascript
class SectionName {
    constructor() {
        this.canvas = document.getElementById('specificCanvas');
        this.ctx = this.canvas?.getContext('2d');
        this.animationId = null;
        if (this.canvas) this.init();
    }
    
    animate() {
        // Draw frame
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}
```

Always null-check canvas (`this.canvas?.`) before initialization—sections may not exist on page load.

### Utils Global Singleton (`js/utils.js`)
**All sections depend on `Utils` object** exposed as `window.Utils`. Common helpers:
- `Utils.$()` / `Utils.$$()` - DOM selectors (returns Element/Array)
- `Utils.observeIntersection()` - Intersection Observer wrapper for scroll animations
- `Utils.throttle()` / `Utils.debounce()` - Event optimization
- `Utils.animateCounter()` - Number counting animations
- `Utils.random()` / `Utils.randomInt()` - Canvas particle/object positioning
- `Utils.storage.get/set()` - LocalStorage with JSON serialization

**Import pattern**: Utils loads first via `<script src="js/utils.js">` in `index.html`, then section scripts.

### CSS Custom Properties Design System (`css/styles.css`)
Color palette defined as CSS variables in `:root`:
- Primary green: `var(--color-primary)` `#2D5A3D`
- Soil colors: `var(--color-soil-healthy)` vs `var(--color-soil-polluted)`
- Typography: `var(--font-display)` (Playfair Display) for headings, `var(--font-body)` (Open Sans) for text

**Canvas colors must match CSS variables**—extract values via:
```javascript
getComputedStyle(document.documentElement).getPropertyValue('--color-soil-healthy');
```

### Data-Driven Interactions
Sections store interaction data as object literals (see `this.pollutionData` in `causes.js`, `this.actionData` in `action.js`). To add new pollution sources/solutions/actions:
1. Add entry to data object with icon, effects/benefits, color
2. Create corresponding HTML button/card with `data-source="key"` attribute
3. Handler automatically picks up via event delegation

## Navigation & State Management

### Single-Page Scroll Architecture
- Hash-based navigation (`#hero`, `#causes`, etc.) via `<a href="#section">`
- Active nav link updates in `main.js` based on scroll position (Intersection Observer)
- Smooth scroll handled by `Utils.scrollTo()` method
- Progress bar updates via `updateScrollProgress()` tracking `window.scrollY`

### No Router—Direct DOM Manipulation
State changes trigger CSS class toggles:
- `.active` for nav links, modals, mobile menu
- `.scrolled` on nav when `scrollY > 50`
- `.animated` for scroll-triggered elements via Intersection Observer

## File Organization Conventions

### JavaScript Module Pattern
Each `.js` file:
1. Top comment block with section description
2. Single ES6 class definition
3. Constructor initializes references to DOM elements
4. `init()` method sets up event listeners and starts animation loop
5. No exports—classes instantiate themselves or are called from `main.js`

### CSS Structure (`css/styles.css`)
Organized by:
1. `:root` custom properties (lines 1-50)
2. Reset & base styles
3. Layout utilities (Flexbox/Grid patterns)
4. Component styles (nav, sections, modals)
5. Section-specific styles (`.hero-section`, `.causes-section`, etc.)
6. Responsive breakpoints at end

Animation keyframes separated into `css/animations.css`.

## Common Development Tasks

### Adding New Canvas Animation
1. Define state properties in constructor (`this.particles = []`)
2. Create initialization method (`createParticles()`)
3. Add draw method called in `animate()` loop
4. Use `Utils.random()` for positioning, `Utils.lerp()` for smooth transitions

### Adding Interactive Elements
1. Add HTML with `data-*` attributes for identification
2. Use event delegation: `container.addEventListener('click', (e) => { if (e.target.matches('.selector')) {...} })`
3. Update visual feedback via Canvas redraw or CSS class toggle
4. Store state in class properties (avoid global variables)

### Testing Locally
Open `index.html` directly in browser (no server required for basic functionality). For localStorage/Canvas features, use local server:
```powershell
# Python (if installed)
python -m http.server 8000

# Node.js
npx serve
```

## Accessibility Considerations
- Reduced motion support: `window.matchMedia('(prefers-reduced-motion: reduce)')`—checked in `main.js` setupAccessibility
- Keyboard navigation: Escape closes modals, Tab navigation supported
- ARIA labels on interactive canvas elements (see `index.html` nav)
- Semantic HTML5 sections with proper heading hierarchy

## Performance Patterns
- **Canvas optimization**: Clear and redraw only changed regions when possible
- **Scroll throttling**: All scroll handlers use `Utils.throttle(fn, 50)`
- **Intersection Observer**: Lazy-animate elements only when visible
- **Debounced resize**: Canvas resize uses `Utils.debounce(fn, 200)`

## What NOT to Do
- ❌ Don't add build tools/bundlers—keep vanilla JS
- ❌ Don't create global variables—use class properties or Utils singleton
- ❌ Don't inline styles—use CSS custom properties and classes
- ❌ Don't block the main thread—use `requestAnimationFrame` for animations
- ❌ Don't forget Canvas null checks—sections lazy-load based on scroll position
