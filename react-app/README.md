# Drag Papers (React)

A React version of the draggable papers page, mobile-friendly using Pointer Events.

## Run Locally
```powershell
cd react-app
npm install
npm run dev
```
Open the local URL shown (e.g., http://localhost:5173).

## Build
```powershell
npm run build
npm run preview
```

## Deploy to Vercel
```powershell
vercel
vercel deploy --prod
```
- Framework preset: Vite/React (auto-detected)
- Output directory: `dist`

## Notes
- Images use placeholder URLs; replace with your own if needed.
- Dragging works on mobile and desktop; CSS sets `touch-action: none`.
