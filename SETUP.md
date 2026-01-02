# SJEG Globe Website - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Download Earth Texture

You need to download an Earth texture image for the globe to display properly.

**Option 1: Using PowerShell (Windows)**
```powershell
cd public/textures
Invoke-WebRequest -Uri "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg" -OutFile "earth.jpg"
```

**Option 2: Manual Download**
1. Visit: https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg
2. Save the image as `earth.jpg` in `public/textures/` folder

**Option 3: High Resolution (NASA)**
- Download from: https://visibleearth.nasa.gov/images/73884/blue-marble-land-surface-shallow-topography-and-shaded-relief
- Save as `earth.jpg` in `public/textures/` folder

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
little-jahsi/
├── components/
│   ├── Globe/
│   │   └── InteractiveGlobe.jsx    # Main 3D globe component
│   ├── DivisionPortal/
│   │   ├── DivisionCards.jsx       # Region division cards
│   │   └── DivisionDetail.jsx      # Division detail view
│   └── UI/
│       └── Caption.jsx              # Welcome caption
├── data/
│   └── regions.js                   # All region and division data
├── pages/
│   └── index.js                     # Main homepage
├── public/
│   └── textures/
│       └── earth.jpg                # Earth texture (you need to download)
└── styles/
    └── globals.css                  # Global styles
```

## 🎨 Features

- **Interactive 3D Globe**: Rotating Earth with clickable region hotspots
- **5 Main Regions**: 
  - Caribbean/Americas (Blue glow)
  - Africa (Green-gold glow)
  - Europe (White-gold glow)
  - Asia (Soft blue glow)
  - Global Impact (White glow)
- **Smooth Navigation**: Click regions → See divisions → View details
- **Futuristic Design**: Dark theme with neon accents

## 🎯 How It Works

1. **Homepage**: Shows rotating 3D globe with region hotspots
2. **Click Region**: Globe zooms, shows division cards for that region
3. **Click Division**: Shows detailed view with subdivisions
4. **Back Navigation**: Return to previous view

## 🔧 Customization

### Add/Edit Regions
Edit `data/regions.js` to modify:
- Region positions (lat/lng)
- Division names and descriptions
- Subdivision details
- Glow colors

### Change Colors
Edit `styles/globals.css` CSS variables:
- `--caribbean-glow`
- `--africa-glow`
- `--europe-glow`
- `--asia-glow`
- `--global-glow`

## 📝 Notes

- The globe works without texture (shows dark sphere), but looks better with Earth texture
- All regions are defined by coordinates, not texture mapping
- State management uses React useState (simple and effective)
- Components are optimized for performance

## 🐛 Troubleshooting

**Globe not showing?**
- Check if texture is downloaded in `public/textures/earth.jpg`
- Check browser console for errors
- Make sure `npm install` completed successfully

**Hotspots not clickable?**
- Check browser console for errors
- Verify regions data in `data/regions.js`

**Styling issues?**
- Clear browser cache
- Check if Tailwind CSS is compiling properly

## 🚢 Deployment

Build for production:
```bash
npm run build
npm start
```

The app is ready to deploy on Vercel, Netlify, or any Node.js hosting platform.

