# EcoRoot - Soil Pollution Awareness Website

An interactive educational website about soil pollution with engaging scroll-triggered animations and drag-and-drop interactions.

## 🌱 Features

### Section 1: Hero/Introduction
- **Interaction**: Scroll-triggered animation
- Clean soil gradually becomes polluted as user scrolls down
- Animated statistics counters
- Particle effects and canvas-based soil visualization

### Section 2: Causes Exploration
- **Interaction**: Drag-and-drop pollution sources
- Drag factory, pesticide, plastic, and mining icons onto soil
- Visual feedback with contamination meter
- Detailed information cards about each pollutant

### Section 3: Consequences Visualization
- **Interaction**: Clickable ecosystem diagram
- Click elements (plants, animals, water, humans, economy, climate)
- Modal popups with detailed contamination pathways
- Animated visual representations

### Section 4: Solutions Simulator
- **Interaction**: Drag-and-drop remediation techniques
- Apply phytoremediation, composting, bioremediation, etc.
- Watch soil health improve with animations
- Plants grow as soil recovers

### Section 5: Action Section
- **Interaction**: Personalized action planner
- Select your context (homeowner/farmer/student/business + urban/suburban/rural)
- Get customized checklist with immediate, short-term, and long-term actions
- Track progress and download your action plan

## 🛠️ Technical Stack

- **HTML5**: Semantic structure for accessibility
- **CSS3**: Custom properties, CSS Grid, Flexbox, animations
- **JavaScript**: ES6+ modules, Canvas API, Intersection Observer
- **No frameworks**: Pure vanilla JS for performance

## 📁 Project Structure

```
EcoRoot/
├── index.html
├── css/
│   ├── styles.css       # Main styles
│   └── animations.css   # Animation keyframes
├── js/
│   ├── utils.js         # Utility functions
│   ├── hero.js          # Hero section logic
│   ├── causes.js        # Causes section drag-drop
│   ├── consequences.js  # Ecosystem diagram
│   ├── solutions.js     # Solutions simulator
│   ├── action.js        # Action plan generator
│   └── main.js          # App initialization
├── images/              # Image assets
└── README.md
```

## 🚀 Getting Started

1. Open the project folder
2. Launch `index.html` in a modern web browser
3. Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

## 🎨 Design System

### Colors (Earth-toned palette)
- Healthy Soil: `#5D4E37`
- Polluted Soil: `#2C2C2C`
- Leaf Green: `#4A7C59`
- Warning: `#D4A03B`
- Danger: `#C45C4B`

### Typography
- Display: Playfair Display
- Body: Open Sans

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Reduced motion preference support
- High contrast color choices

## 📱 Responsive Design

Fully responsive across:
- Mobile (< 480px)
- Tablet (< 768px)
- Desktop (> 1024px)

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

MIT License - Feel free to use for educational purposes!

---

Built with 💚 for our planet
