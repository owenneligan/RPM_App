# M4A to MP3 Converter

A fast, private, browser-based audio converter that transforms M4A files into MP3s. No uploads, no sign-ups — everything runs locally in your browser.

## What it does

- Drag and drop one or more `.m4a` files
- Convert them to high-quality `.mp3` files
- Download the results or save directly to a folder (Chrome/Edge)
- All processing happens locally using FFmpeg compiled to WebAssembly

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| **UI Framework** | React 18 + TypeScript | Type-safe, component-based, fast rendering |
| **Build Tool** | Vite | Instant HMR, fast builds, ESM-native |
| **Styling** | Tailwind CSS | Utility-first, consistent design system |
| **State** | Zustand | Minimal boilerplate, great performance |
| **Animation** | Framer Motion | Smooth, declarative transitions |
| **Icons** | Lucide React | Clean, consistent icon set |
| **Audio Engine** | FFmpeg.wasm | Full FFmpeg compiled to WebAssembly — runs entirely in-browser |

### Why a web app instead of Electron/Tauri?

- **Zero install**: Open the URL and start converting
- **Privacy-first**: Files never leave your machine — FFmpeg.wasm processes everything in the browser
- **Cross-platform**: Works on any modern browser (Chrome, Edge, Firefox, Safari)
- **Lightweight**: No 100MB+ Electron bundle, no native dependencies
- **Easy to deploy**: Static files on any CDN or hosting service

The File System Access API (Chrome/Edge) enables saving directly to a folder on disk, giving near-native file handling when available. In other browsers, files are downloaded normally.

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Build for production

```bash
npm run build
```

Output goes to `dist/`. Deploy as static files to any web server or CDN.

```bash
# Preview the production build locally
npm run preview
```

## Dependencies

- **Node.js** 18+ and npm
- A modern browser with WebAssembly support (all major browsers since 2017)
- For the "Save to folder" feature: Chrome 86+ or Edge 86+ (File System Access API)

FFmpeg.wasm is loaded from a CDN at runtime — no local FFmpeg installation needed.

## Architecture

```
src/
├── App.tsx                    # Main app shell, global drop handling, FFmpeg init
├── main.tsx                   # React entry point
├── index.css                  # Tailwind base + custom scrollbar styles
├── vite-env.d.ts              # TypeScript declarations for File System Access API
├── components/
│   ├── Header.tsx             # App title and tagline
│   ├── DropZone.tsx           # Drag-and-drop + file picker
│   ├── FileQueue.tsx          # File list container
│   ├── FileItem.tsx           # Individual file row with status
│   ├── ProgressBar.tsx        # Animated progress bar
│   ├── ConvertButton.tsx      # Primary action + batch progress
│   ├── AdvancedSettings.tsx   # Bitrate, output folder, overwrite toggle
│   └── CompletionSummary.tsx  # Done state with download actions
├── store/
│   └── conversionStore.ts     # Zustand store — all app state + conversion logic
├── lib/
│   ├── ffmpeg.ts              # FFmpeg.wasm wrapper — init, convert, save, download
│   └── utils.ts               # cn(), formatFileSize()
└── types/
    └── index.ts               # TypeScript interfaces
```

## Audio quality

Default encoding: **192 kbps MP3** via libmp3lame — a strong balance of quality and file size. Advanced settings offer 128/192/256/320 kbps options behind a collapsible panel.

Metadata (title, artist, album art) is preserved when present in the source file.

## Features

- Drag and drop or click to add files
- Drop files anywhere on the window
- Per-file and overall batch progress
- Status badges: waiting, converting, done, failed
- Remove individual files or clear the queue
- Retry failed conversions individually
- Download individual files or all at once
- Choose output folder (Chrome/Edge) or use browser downloads
- Duplicate filename handling (auto-rename)
- Overwrite toggle for output folder mode
- Bitrate selector (128–320 kbps)
- Rejects non-M4A files with a friendly message
- Keyboard accessible
- Privacy-first — no data leaves your browser
