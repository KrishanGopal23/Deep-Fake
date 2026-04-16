# Deepfake Detector Frontend

Modern React + Tailwind frontend for the hosted Deepfake Detection model.

## Stack

- React with Vite
- Tailwind CSS
- Fetch-based API integration

## Run locally

```bash
cd frontend
npm install
npm run dev
```

## Production build

```bash
cd frontend
npm run build
```

## Deploy on Render

This repo includes a root-level `render.yaml` for Render Blueprint deploys.
For the Blueprint file, the publish path is set as `frontend/dist` because Render expects that path relative to the repo root.

If you prefer manual setup in the Render dashboard, use:

- Service type: `Static Site`
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment Variable:
  - `VITE_DEEPFAKE_API_BASE=https://krishangopal23-deepfake-detector.hf.space`

For single-page app routing, add a rewrite rule:

- Source: `/*`
- Destination: `/index.html`

## Environment

Copy `.env.example` to `.env` if you want to override the default hosted API:

```bash
VITE_DEEPFAKE_API_BASE=https://krishangopal23-deepfake-detector.hf.space
```

## API note

As wired in this frontend, the app first attempts `POST /run/predict` to match the requested integration path, then falls back to the currently working Gradio queue endpoint if the hosted Space responds differently.
