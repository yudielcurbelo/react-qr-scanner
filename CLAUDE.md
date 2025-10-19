# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@yudiel/react-qr-scanner` is a React library for scanning QR codes and barcodes using the device camera. It wraps the Barcode Detection API and provides React components and hooks for barcode scanning functionality.

## Build Commands

```bash
# Build the library (creates both CJS and ESM bundles)
npm run build

# Build ESM only
npm run build:esm

# Build CJS only
npm run build:cjs

# Run Storybook for development
npm run storybook

# Build Storybook for deployment
npm run build-storybook

# Lint and format with Biome
npm run biome:lint
npm run biome:check
```

## Architecture

### Core Hook Pattern

The library uses a layered hook architecture:

1. **`useCamera`** (src/hooks/useCamera.ts) - Low-level camera management
   - Handles MediaStream lifecycle via task queue pattern to prevent race conditions
   - Manages camera capabilities (torch, zoom) and settings
   - Uses `webrtc-adapter` for cross-browser compatibility
   - Provides `startCamera`, `stopCamera`, and `updateConstraints` methods

2. **`useScanner`** (src/hooks/useScanner.ts) - Barcode detection loop
   - Uses `requestAnimationFrame` to continuously detect barcodes from video feed
   - Manages scan timing with `retryDelay` (frame processing) and `scanDelay` (duplicate detection)
   - Tracks state between frames to detect new barcodes vs duplicates
   - Handles optional sound playback on successful detection

3. **`useDevices`** (src/hooks/useDevices.ts) - Device enumeration
   - Public hook exported for users to list available video input devices
   - Filters `navigator.mediaDevices.enumerateDevices()` for video inputs only

### Component Structure

**`Scanner`** (src/components/Scanner.tsx) is the main component that:
- Orchestrates `useCamera` and `useScanner` hooks
- Manages three canvas layers:
  - `videoRef`: The actual video element displaying camera feed
  - `pauseFrameRef`: Canvas showing frozen frame when scanner is paused
  - `trackingLayerRef`: Overlay canvas for drawing tracking visualization
- Implements coordinate transformation (`onFound` function) to map barcode coordinates from video resolution space to display space
- Provides optional UI components via `components` prop:
  - `Finder`: Visual finder overlay
  - `OnOff`: Camera on/off toggle
  - `Torch`: Flashlight control (if device supports)
  - `Zoom`: Zoom control (if device supports)

### Key Implementation Details

**Constraint Management** (Scanner.tsx:226-234):
- Deep equality check prevents unnecessary camera restarts when constraints haven't actually changed
- When `deviceId` is specified, `facingMode` is automatically removed to avoid conflicts
- Cached constraints are stored separately from props to control when camera restarts

**Coordinate Scaling** (Scanner.tsx:86-131):
- Video display size often differs from actual video resolution
- Uses `object-fit: cover` style, so larger dimension ratio is used for scaling
- Transforms both `boundingBox` and `cornerPoints` for accurate overlay rendering
- Tracking function receives adjusted coordinates matching display space

**Torch/Zoom Constraint Conflict** (useCamera.ts:183-189):
- Mobile browsers often can't use torch and zoom simultaneously
- Before applying zoom constraints, explicitly disable torch if it was previously enabled
- This is a workaround for browser limitation: "Mixing ImageCapture and non-ImageCapture constraints is not currently supported"

### Build System

**Rollup Configuration** (rollup.config.mjs):
- Dual output: CommonJS (`.cjs.js`) and ESM (`.esm.mjs`)
- TypeScript plugin generates `.d.ts` files
- Externals: `react`, `react-dom`, `barcode-detector`, `webrtc-adapter` (peer/runtime deps)
- Terser minification applied
- Stories folder excluded from build

**TypeScript Configuration**:
- Target: ES2020, Module: ESNext
- Strict mode enabled with additional checks (`noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`)
- Outputs ESM declarations to `dist/esm`
- Excludes `stories` and `node_modules`

### Code Style

**Biome** is used for linting and formatting:
- Tab indentation, single quotes
- Covers `src/**` and `stories/**` only
- Auto-organize imports enabled
- Some rules disabled: `noBannedTypes`, `noArrayIndexKey`, `useKeyWithClickEvents`

### Testing/Development

**Storybook** provides interactive component development:
- Stories in `stories/` directory
- Uses React + Webpack 5 + SWC compiler
- Accessible at `http://localhost:6006` during development

## Important Patterns

### deepEqual Utility

The custom `deepEqual` function (src/utilities/deepEqual.ts) is used to compare constraint objects:
- Handles primitives, dates, objects, and arrays recursively
- Specifically ignores `ref` key during comparison (line 25)
- Critical for preventing unnecessary camera restarts

### Task Queue Pattern

`useCamera` uses a promise-based task queue to serialize camera operations:
- `taskQueue.current` holds the latest pending task
- New tasks chain onto previous via `.then()`
- Prevents race conditions when rapidly starting/stopping camera
- Each task returns typed result (`IStartTaskResult` or `IStopTaskResult`)

### Performance Considerations

- Default `retryDelay` is 500ms when no tracker, 10ms with tracker (Scanner.tsx:205)
- This prevents excessive CPU usage from barcode detection
- Animation frame loop only processes when video `readyState > 1` (video has data)
- `allowMultiple` prop controls whether same barcode triggers multiple `onScan` calls

## Security Context

The library requires secure context (HTTPS or localhost) for camera access (useCamera.ts:25-28). This is a browser security requirement, not a library limitation.