# KYN × VAMOS Website

A responsive event website for the KYN × VAMOS Chennai Half Marathon 2026. It brings race information, event experiences, partner highlights, FAQs, and registration links together in one page.

## Features

- Event overview, date countdown, race distances, prizes, and venue details
- Responsive layouts for desktop and mobile
- Race day experience and corporate partner showcases
- Interactive 3D partner carousel built with React
- Accessible navigation and reduced-motion-aware effects

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local address printed by Vite (normally `http://localhost:8000`).

## Build

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`.

## Project structure

- `index.html` — page content and event interactions
- `refinement.css` — site styling and responsive layouts
- `src/` — React entry point and partner carousel
- `assets/` — images and illustrations used by the website

## Notes

This is an event information website. Registration links lead to the event's registration service; this repository does not implement registration or process payments. Brand marks and partner artwork belong to their respective owners. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
