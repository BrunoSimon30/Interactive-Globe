# Framer Motion Enhancements - Installation & Features

## 📦 Installation Required

Before running the app, install Framer Motion:

```bash
npm install framer-motion
```

**Note:** `@react-spring/three` is optional - camera animations work without it using Three.js lerp.

## ✨ New Features Added

### 1. **Smooth Animations with Framer Motion**

#### **Caption Component**
- Smooth fade-in with delay
- Animated text appearance
- Exit animations

#### **Division Cards**
- Staggered card entrance animations
- Hover scale and lift effects
- Smooth transitions between states
- Animated tag badges

#### **Division Detail**
- Sequential card animations
- Bullet point fade-in
- Button hover/tap animations
- Smooth page transitions

### 2. **Globe Enhancements**

#### **Camera Animation**
- Smooth zoom to region on click
- Automatic return to default view on back
- Smooth camera transitions using lerp

#### **Region Labels**
- Region names appear on hover
- Styled with region glow colors
- Text outline for visibility

### 3. **Interactive Animations**

- **Hover Effects**: Scale, lift, and glow on hover
- **Click Animations**: Button press feedback
- **Page Transitions**: Smooth fade between views
- **Staggered Animations**: Cards appear one by one

## 🎨 Animation Details

### Timing
- **Fade Duration**: 0.3s - 0.8s
- **Stagger Delay**: 0.1s per card
- **Hover Scale**: 1.02x - 1.05x
- **Camera Lerp**: 0.05 (smooth movement)

### Easing
- Default: `ease-in-out`
- Smooth transitions throughout
- Natural motion feel

## 🚀 Usage

After installing `framer-motion`, all animations will work automatically:

```bash
npm install framer-motion
npm run dev
```

## 📝 Notes

- All animations are performance-optimized
- Mobile-friendly (reduced motion support)
- No breaking changes to existing functionality
- Backward compatible

## 🔧 Customization

To adjust animation speeds, edit:
- **Caption**: `components/UI/Caption.jsx` - delay and duration
- **Cards**: `components/DivisionPortal/DivisionCards.jsx` - stagger delay
- **Camera**: `components/Globe/InteractiveGlobe.jsx` - lerp value (0.05)

