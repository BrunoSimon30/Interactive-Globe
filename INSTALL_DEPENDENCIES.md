# Globe Pages - Dependencies Installation

## Required Dependencies

To use the new globe pages, you need to install these packages:

```bash
npm install d3 react-globe.gl topojson-client
```

## If PowerShell gives execution policy error:

**Option 1: Use Command Prompt (cmd)**
```cmd
npm install d3 react-globe.gl topojson-client
```

**Option 2: Change PowerShell Execution Policy (Run as Administrator)**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then run:
```powershell
npm install d3 react-globe.gl topojson-client
```

## Available Globe Pages

After installing dependencies, you can access:

1. **D3.js Globe** - `/globe-d3`
   - SVG-based interactive globe
   - Drag to rotate, scroll to zoom
   - Click countries to select
   - Auto-rotate feature
   - File: `pages/globe-d3.js`

2. **React Globe.gl** - `/globe-react-globe`
   - WebGL-based 3D globe
   - More realistic Earth texture
   - Smooth animations
   - File: `pages/globe-react-globe.js`

## Features

Both globes include:
- ✅ Interactive country selection
- ✅ Hover effects
- ✅ Modern dark theme with cyan accents
- ✅ Responsive design
- ✅ Smooth animations

