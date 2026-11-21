# SANCHITA AI

A Bengali + English voice-enabled personal assistant built as a Progressive Web App (PWA). It runs as a website and can be installed on Android from a supported browser.

## Features

- Bengali and English text chat
- Browser speech recognition (where supported) and speech synthesis
- AI replies through a private Node.js backend and OpenAI Responses API
- Built-in local commands: time, date, open Google, open YouTube, help
- Installable PWA with basic offline shell caching
- Responsive sci-fi dashboard

## Requirements

- Node.js 20+
- An OpenAI API key for AI chat (optional; built-in commands work without it)
- Chrome or another browser with Web Speech API support for voice input

## Run locally

```bash
npm install
cp .env.example .env
```

Edit `.env` and add your own key:

```env
OPENAI_API_KEY=your_private_key
AI_MODEL=gpt-5.5
PORT=3000
```

Then run:

```bash
npm start
```

Open `http://localhost:3000`.

**Never put your real API key in `public/app.js`, GitHub, or any browser code.** The key belongs only in the server environment.

## Deploy from GitHub to Render

1. Create a GitHub repository and upload all project files.
2. Sign in to Render and choose **New → Web Service**.
3. Connect the GitHub repository.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variable `OPENAI_API_KEY` with your private API key.
7. Optionally add `AI_MODEL` with a model available to your API project (default: `gpt-5.5`).
8. Deploy. Open the Render URL.

The included `render.yaml` can prefill most settings. Add the secret key in Render's Environment settings; do not commit it.

## Install on Android

1. Open the deployed HTTPS Render URL in Chrome.
2. Open Chrome menu (⋮).
3. Tap **Install app** or **Add to Home screen**.
4. Open SANCHITA AI from the home screen.
5. Allow microphone permission when prompted.

This is a PWA, not a Play Store APK. A native APK would require a separate Android wrapper/build process.

## Voice notes

- Voice input uses the browser Web Speech API. Support varies by browser and device; Chrome on Android is a good starting point.
- Speech recognition may require internet and microphone permission.
- Voice output uses the device's installed speech voices. Bengali voice availability depends on the Android text-to-speech engine.
- Choose বাংলা or English from the language selector.

## GitHub Pages note

GitHub Pages can host the static frontend, but it cannot run `server.js`. For AI replies, deploy this complete project to Render (recommended) so the frontend and private AI backend run under one HTTPS URL. Do not expose your API key in GitHub Pages JavaScript.

## Safety

This is a starter project, not a fully autonomous device-control agent. It cannot silently control phone settings, read private messages, make payments, or execute arbitrary commands. Review any code before deployment and monitor API usage and costs.
