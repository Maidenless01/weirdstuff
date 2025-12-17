# Drag Papers (Mobile + Desktop)

This page lets you drag cute "papers" around. It now works on both desktop and mobile using unified Pointer Events with responsive styles.

What changed:
- Mobile-friendly viewport added
- Responsive font/image sizes
- Unified drag via `drag.js` (Pointer Events)

Usage:
1. Open `index.html` in a browser.
2. Drag papers/images with touch (mobile) or mouse (desktop).

Note: The local images referenced (`images/1.jpeg`, `images/2.jpeg`, `images/3.jpg`) should exist; otherwise replace with your own.

Technical notes:
- Papers are randomly placed within the viewport on load to be easier to tap on mobile.
- CSS sets `touch-action: none` to enable custom dragging without scroll interference.

Cleanup:
- Removed legacy scripts [script.js](script.js) and [mobile.js](mobile.js); [drag.js](drag.js) now handles all input.

Thanks and Happy Coding.

## Deploy to Vercel
- **Static site:** No build step required; Vercel serves the repo root.
- **Config:** See [vercel.json](vercel.json) for caching headers. Optional [.vercelignore](.vercelignore) excludes non-essential files.

### Deploy via CLI (quickest)
1. Install the Vercel CLI:

```powershell
npm i -g vercel
```

2. From the project folder, initialize and deploy:

```powershell
vercel
vercel deploy --prod
```

Follow the prompts to log in and set the project. The production URL will be shown after deploy.

### Deploy via Vercel Dashboard (GitHub)
1. Push this folder to a GitHub repository.
2. In Vercel, create a New Project and import your repo.
3. Root Directory: use the repo root (contains `index.html`). No build command.
4. Deploy; Vercel will serve `index.html` at your project URL.
