# @yudiel/react-qr-scanner

[![npm version](https://img.shields.io/npm/v/@yudiel/react-qr-scanner.svg)](https://www.npmjs.com/package/@yudiel/react-qr-scanner)
[![npm downloads](https://img.shields.io/npm/dm/@yudiel/react-qr-scanner.svg)](https://www.npmjs.com/package/@yudiel/react-qr-scanner)
[![license](https://img.shields.io/npm/l/@yudiel/react-qr-scanner.svg)](https://github.com/yudielcurbelo/react-qr-scanner/blob/main/LICENSE)

A modern React library for scanning QR codes and barcodes using your device camera or webcam. Built on top of the
Barcode Detection API with React hooks and components.

## Features

- **Multiple Barcode Formats**: Supports QR codes, EAN, UPC, Code 128, and many more 1D/2D formats
- **Camera Controls**: Built-in torch (flashlight), zoom, and camera switching capabilities
- **Flexible Scanning**: Continuous scanning, single scan mode, or pause/resume functionality
- **Custom Tracking**: Draw custom overlays and tracking visualizations on detected barcodes
- **Device Selection**: Choose specific cameras with the `useDevices` hook
- **Customizable UI**: Custom styles, class names, and component overrides
- **Audio Feedback**: Optional beep sound on successful scans (with custom sound support)
- **TypeScript Support**: Fully typed for excellent developer experience
- **Lightweight**: Minimal dependencies with optimized bundle size
- **Cross-browser Compatible**: Works across modern browsers with `webrtc-adapter`

## Table of Contents

- [Demo](#demo)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
  - [Basic Scanner](#basic-scanner)
  - [Device Selection](#device-selection)
  - [Camera Constraints](#camera-constraints)
  - [Custom Tracking Overlay](#custom-tracking-overlay)
  - [Pausing and Resuming](#pausing-and-resuming)
  - [UI Components](#ui-components)
- [API Reference](#api-reference)
  - [Scanner Props](#scanner-props)
  - [Scanner Ref](#scanner-ref)
  - [useDevices Hook](#usedevices-hook)
  - [Utilities](#utilities)
- [Supported Formats](#supported-formats)
- [Type Definitions](#type-definitions)
- [Browser Support](#browser-support)
- [Troubleshooting](#troubleshooting)
- [Limitations](#limitations)
- [Contributing](#contributing)
- [License](#license)

## Demo

Check out the [live demo](https://yudielcurbelo.github.io/react-qr-scanner/) to see the scanner in action.

## Installation

```bash
npm install @yudiel/react-qr-scanner
```

```bash
yarn add @yudiel/react-qr-scanner
```

```bash
pnpm add @yudiel/react-qr-scanner
```

## Quick Start

```jsx
import { Scanner } from '@yudiel/react-qr-scanner';

function App() {
  return (
    <Scanner
      onScan={(result) => console.log(result)}
      onError={(error) => console.log(error?.message)}
    />
  );
}
```

## Usage Examples

### Basic Scanner

```jsx
import { Scanner } from '@yudiel/react-qr-scanner';

function BasicExample() {
  const handleScan = (detectedCodes) => {
    console.log('Detected codes:', detectedCodes);
    // detectedCodes is an array of IDetectedBarcode objects
    detectedCodes.forEach(code => {
      console.log(`Format: ${code.format}, Value: ${code.rawValue}`);
    });
  };

  return (
    <Scanner
      onScan={handleScan}
      onError={(error) => console.error(error)}
    />
  );
}
```

### Device Selection

Use the `useDevices` hook to list available cameras and select a specific device:

```jsx
import { Scanner, useDevices } from '@yudiel/react-qr-scanner';
import { useState } from 'react';

function DeviceSelectionExample() {
  const devices = useDevices();
  const [selectedDevice, setSelectedDevice] = useState(null);

  return (
    <div>
      <select onChange={(e) => setSelectedDevice(e.target.value)}>
        <option value="">Select a camera</option>
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${device.deviceId}`}
          </option>
        ))}
      </select>

      <Scanner
        onScan={(result) => console.log(result)}
        constraints={{
          deviceId: selectedDevice,
        }}
      />
    </div>
  );
}
```

### Camera Constraints

Customize camera settings using MediaTrackConstraints:

```jsx
import { Scanner } from '@yudiel/react-qr-scanner';

function ConstraintsExample() {
  return (
    <Scanner
      onScan={(result) => console.log(result)}
      constraints={{
        facingMode: 'environment', // Use rear camera
        aspectRatio: 1, // Square aspect ratio
        // Advanced constraints
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      }}
    />
  );
}
```

### Custom Tracking Overlay

Draw custom visualizations on detected barcodes:

```jsx
import { Scanner } from '@yudiel/react-qr-scanner';

function TrackingExample() {
  const highlightCodeOnCanvas = (detectedCodes, ctx) => {
    detectedCodes.forEach((detectedCode) => {
      const { boundingBox, cornerPoints } = detectedCode;

      // Draw bounding box
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 4;
      ctx.strokeRect(
        boundingBox.x,
        boundingBox.y,
        boundingBox.width,
        boundingBox.height
      );

      // Draw corner points
      ctx.fillStyle = '#FF0000';
      cornerPoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  };

  return (
    <Scanner
      onScan={(result) => console.log(result)}
      components={{
        tracker: highlightCodeOnCanvas,
      }}
    />
  );
}
```

### Pausing and Resuming

Control when the scanner is active:

```jsx
import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';

function PauseExample() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div>
      <button onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? 'Resume' : 'Pause'} Scanning
      </button>

      <Scanner
        onScan={(result) => console.log(result)}
        paused={isPaused}
      />
    </div>
  );
}
```

### UI Components

Enable built-in UI controls for torch, zoom, and camera switching:

```jsx
import { Scanner } from '@yudiel/react-qr-scanner';

function UIComponentsExample() {
  return (
    <Scanner
      onScan={(result) => console.log(result)}
      components={{
        onOff: true, // Show camera on/off button
        torch: true, // Show torch/flashlight button (if supported)
        zoom: true, // Show zoom control (if supported)
        finder: true, // Show finder overlay
      }}
      // Beep on scan is controlled by the `sound` prop, not `components`.
      // Pass `false` to disable it, or a URL/data URI for a custom sound.
      sound="data:audio/mp3;base64,YOUR_BASE64_AUDIO_HERE"
    />
  );
}
```

## API Reference

### Scanner Props

| Prop             | Type                                          | Required | Default      | Description                                                                                                        |
|------------------|-----------------------------------------------|----------|--------------|--------------------------------------------------------------------------------------------------------------------|
| `onScan`         | `(detectedCodes: IDetectedBarcode[]) => void` | Yes      | -            | Called when one or more barcodes are detected.                                                                     |
| `onError`        | `(error: IScannerError) => void`              | No       | -            | Called with a typed error if the camera fails to start or detection fails. See [Type Definitions](#iscannererror). |
| `constraints`    | `MediaTrackConstraints`                       | No       | `{}`         | Media track constraints applied to the video stream (e.g., `facingMode`, `deviceId`).                              |
| `formats`        | `BarcodeFormat[]`                             | No       | All          | Barcode formats to detect. If omitted, all supported formats are detected.                                         |
| `paused`         | `boolean`                                     | No       | `false`      | If `true`, the scanner pauses and displays the last frame.                                                         |
| `children`       | `ReactNode`                                   | No       | -            | Custom children to render inside the scanner container.                                                            |
| `components`     | `IScannerComponents`                          | No       | `{}`         | Built-in UI components and optional tracker.                                                                       |
| `tracker`        | `TrackFunction`                               | No       | -            | Shortcut for `components.tracker`. Overrides it if both are set.                                                   |
| `styles`         | `IScannerStyles`                              | No       | `{}`         | Inline CSS for scanner elements.                                                                                   |
| `classNames`     | `IScannerClassNames`                          | No       | `{}`         | Class names for scanner elements.                                                                                  |
| `scanDelay`      | `number`                                      | No       | `0`          | Minimum delay (ms) between `onScan` calls when `allowMultiple` is `true`.                                          |
| `retryDelay`     | `number`                                      | No       | `500` / `33` | Minimum delay (ms) between detection attempts. Default is 500 with no tracker, 33 (≈30 fps) with a tracker.        |
| `allowMultiple`  | `boolean`                                     | No       | `false`      | If `true`, allows the same barcode to trigger `onScan` repeatedly.                                                 |
| `sound`          | `boolean \| string`                           | No       | `true`       | Plays a beep on successful scan. Pass a URL/data URI for a custom sound.                                           |
| `startTimeoutMs` | `number`                                      | No       | `3000`       | Maximum time (ms) to wait for `play()` before failing with a timeout error.                                        |
| `settleDelayMs`  | `number`                                      | No       | `500`        | Delay (ms) after `play()` before reading camera capabilities/settings. Set lower for faster devices.               |

### Scanner Ref

`Scanner` is a `forwardRef` component. Pass a ref to access the underlying
video element and the active `MediaStream`:

```tsx
import { Scanner, type IScannerHandle } from '@yudiel/react-qr-scanner';
import { useRef } from 'react';

function App() {
  const scannerRef = useRef<IScannerHandle>(null);

  function snapshot() {
    const video = scannerRef.current?.getVideoElement();
    if (!video) return;
    // ...take a still frame from the video element
  }

  return <Scanner ref={scannerRef} onScan={console.log} />;
}
```

The ref shape is:

```ts
interface IScannerHandle {
  getVideoElement: () => HTMLVideoElement | null;
  getStream: () => MediaStream | null;
}
```

### useDevices Hook

Returns an array of available video input devices (cameras).

```typescript
const devices = useDevices();
// Returns: MediaDeviceInfo[]
```

**Example:**

```jsx
import { useDevices } from '@yudiel/react-qr-scanner';

function CameraList() {
  const devices = useDevices();

  return (
    <ul>
      {devices.map((device) => (
        <li key={device.deviceId}>
          {device.label || `Camera ${device.deviceId}`}
        </li>
      ))}
    </ul>
  );
}
```

### Utilities

#### `isBarcodeDetectorSupported()`

Returns `true` if the browser ships a native `BarcodeDetector`. Useful for
gating UI on native vs. polyfill detection.

```ts
import { isBarcodeDetectorSupported } from '@yudiel/react-qr-scanner';

if (!isBarcodeDetectorSupported()) {
  console.info('Using the polyfill detector; performance will be lower.');
}
```

#### `createScannerError(cause)`

Maps a `DOMException`, `Error`, or string to an `IScannerError`. The `Scanner`
component calls this internally before invoking `onError`; export is provided
for callers building their own integrations on top of `useDevices` /
`useCamera`.

#### Advanced: customizing the detector engine

The library re-exports `prepareZXingModule` from `barcode-detector` as an escape
hatch for swapping out the ZXing engine the polyfill uses (e.g., to host the WASM
yourself, or to swap in a different build):

```ts
import { prepareZXingModule } from '@yudiel/react-qr-scanner';

// Override where the polyfill loads its WASM from
prepareZXingModule({
  overrides: {
    locateFile: (path) => `/static/${path}`,
  },
});

// Or pre-warm the engine before the first scan
await prepareZXingModule({ fireImmediately: true });
```

> A `setZXingModuleOverrides` re-export is also available but **deprecated** —
> `setZXingModuleOverrides(x)` is equivalent to `prepareZXingModule({ overrides: x })`.

See the [`barcode-detector` docs](https://github.com/Sec-ant/barcode-detector)
for the full API.

## Supported Formats

Formats are provided by the underlying [`barcode-detector`](https://github.com/Sec-ant/barcode-detector)
engine. The full set of values accepted by the `formats` prop:

**Linear (1D)**

```
codabar          code_39          code_39_standard   code_39_extended
code_32          pzn              code_93            code_128
databar          databar_omni     databar_stacked    databar_stacked_omni
databar_expanded databar_expanded_stacked            databar_limited
dx_film_edge     ean_8            ean_13             ean_upc
isbn             itf              itf_14             upc_a
upc_e            telepen          telepen_alpha      telepen_numeric
```

**Matrix (2D)**

```
aztec            aztec_code       aztec_rune         data_matrix
maxi_code        pdf417           compact_pdf417     micro_pdf417
qr_code          qr_code_model_1  qr_code_model_2    micro_qr_code
rm_qr_code
```

**Shorthand**

| Value              | Detects                    |
|--------------------|----------------------------|
| `linear_codes`     | all linear (1D) formats    |
| `matrix_codes`     | all matrix (2D) formats    |
| `gs1_codes`        | all GS1 formats            |
| `retail_codes`     | all retail formats         |
| `industrial_codes` | all industrial formats     |
| `other_barcode`    | barcodes not covered above |
| `any`              | all formats                |

> Omitting the `formats` prop is equivalent to passing `['any']` — every supported
> format is detected. `unknown` may appear on a detected result whose symbology
> could not be classified, but it is not meaningful as an input filter.

To detect specific formats only:

```jsx
<Scanner
  onScan={(result) => console.log(result)}
  formats={['qr_code', 'ean_13', 'code_128']}
/>
```

## Type Definitions

### `BarcodeFormat`

A union of every supported format string. It is re-exported from this package
(sourced from [`barcode-detector`](https://github.com/Sec-ant/barcode-detector)),
so you can type your `formats` array directly:

```typescript
import type { BarcodeFormat } from '@yudiel/react-qr-scanner';

const formats: BarcodeFormat[] = ['qr_code', 'ean_13', 'code_128'];
```

See the [Supported Formats](#supported-formats) section above for the complete list
of values. Because the type tracks the upstream engine, new symbologies become
available automatically as `barcode-detector` is updated.

### `IDetectedBarcode`

```typescript
interface IDetectedBarcode {
  boundingBox: IBoundingBox;
  cornerPoints: IPoint[];
  format: string;
  rawValue: string;
}
```

### `IBoundingBox`

```typescript
interface IBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

### `IPoint`

```typescript
interface IPoint {
  x: number;
  y: number;
}
```

### `IScannerComponents`

```typescript
interface IScannerComponents {
  tracker?: TrackFunction;
  onOff?: boolean;
  torch?: boolean;
  zoom?: boolean;
  finder?: boolean;
}
```

### `IScannerError`

```typescript
type ScannerErrorKind =
  | 'permission-denied'   // user denied camera permission
  | 'no-camera'           // no video input device found
  | 'in-use'              // device locked by another app/tab
  | 'overconstrained'     // requested constraints can't be satisfied
  | 'insecure-context'    // not HTTPS / localhost
  | 'unsupported'         // browser lacks getUserMedia / Stream API
  | 'aborted'             // request was aborted
  | 'security'            // SecurityError raised
  | 'type-error'          // bad input passed to getUserMedia
  | 'unknown';            // unmatched DOMException or non-Error cause

interface IScannerError {
  kind: ScannerErrorKind;
  message: string;
  cause: unknown;          // the original DOMException / Error
}
```

### `IScannerHandle`

```typescript
interface IScannerHandle {
  getVideoElement: () => HTMLVideoElement | null;
  getStream: () => MediaStream | null;
}
```

### `TrackFunction`

```typescript
type TrackFunction = (
  detectedCodes: IDetectedBarcode[],
  ctx: CanvasRenderingContext2D
) => void;
```

### `IScannerStyles`

```typescript
interface IScannerStyles {
  container?: CSSProperties;
  video?: CSSProperties;
  finderBorder?: number;
}
```

### `IScannerClassNames`

```typescript
interface IScannerClassNames {
  container?: string;
  video?: string;
}
```

## Browser Support

This library requires support for:

- **getUserMedia API**: Camera access
- **Barcode Detection API**: Barcode scanning (polyfilled
  via [barcode-detector](https://www.npmjs.com/package/barcode-detector))
- **Canvas API**: Drawing tracking overlays

**Supported Browsers:**

- Chrome/Edge 88+
- Firefox 90+ (with polyfill)
- Safari 14+ (with polyfill)
- Mobile browsers (iOS Safari 14.5+, Chrome Mobile)

The library uses `webrtc-adapter` for cross-browser compatibility.

## Troubleshooting

### `onError` fires with `kind: 'permission-denied'`

The user (or a previously remembered choice) denied camera access. Surface a
prompt asking them to re-grant permission in their browser. In Chrome:
site-info chip → Camera → Allow. In Safari: Settings → Websites → Camera.

### `kind: 'no-camera'`

`enumerateDevices()` returned no video inputs. Common causes:

- No camera connected (desktop without a webcam).
- A previously selected `deviceId` is no longer connected. Pass a different
  `deviceId`, or omit `constraints.deviceId` entirely to fall back to
  `facingMode`.

### `kind: 'in-use'`

Another app or browser tab has the camera locked. On Windows, the desktop
Camera app is a common culprit; on mobile, switching apps mid-scan can do this
too. The library can't recover from this; close the other consumer and
remount the `Scanner`.

### `kind: 'overconstrained'`

The combination of constraints you passed can't be satisfied by any connected
camera. Most often this is a `deviceId` + `facingMode` conflict (the library
already strips `facingMode` when a `deviceId` is present, but a user-passed
`width`/`height`/`aspectRatio` might still be impossible). Drop the failing
constraint and retry.

### `kind: 'insecure-context'`

Camera APIs require a secure origin. Serve over HTTPS, or develop on
`localhost` (Chrome / Firefox / Safari all consider `localhost` secure).

### Scanner runs but never detects anything

- Make sure there's enough light and the camera is in focus.
- Try removing the `formats` prop to detect all formats. The format you
  expected might not be in the list.
- If `isBarcodeDetectorSupported()` returns `false`, the polyfill WASM is
  doing the work. Check the Network tab for the WASM file (404 → host with
  `prepareZXingModule({ overrides: { locateFile } })`).

### iOS Safari plays no sound on the first scan

iOS requires a user gesture before audio can play. The very first scan after
page load may be silent; subsequent scans (after any user interaction) play
normally.

### Torch turns off when I zoom in

This is intentional. Mobile browsers can't mix ImageCapture (torch) and
non-ImageCapture (zoom) constraints simultaneously. The library disables the torch
before applying zoom and updates the React state to match. Re-toggle the torch 
after the zoom change settles.

### Next.js / SSR errors at build time

Import the scanner lazily so it never runs on the server:

```tsx
import dynamic from 'next/dynamic';

const Scanner = dynamic(
  () => import('@yudiel/react-qr-scanner').then((m) => m.Scanner),
  { ssr: false },
);
```

`useDevices()` is also browser-only. Only call it inside `'use client'`
components (App Router) or with `dynamic({ ssr: false })` wrappers.

## Limitations

- **HTTPS or localhost required**: Due to browser security restrictions, camera access only works on secure contexts
  (HTTPS or localhost).
- **iOS audio limitations**: Beep sound on iOS Safari requires user interaction before playing. The first scan after
  the page load may not play sound.
- **Server-Side Rendering (SSR)**: This library requires browser APIs and will not work during SSR. Ensure you only
  import and use it in client-side code:

  ```jsx
  // Next.js example
  import dynamic from 'next/dynamic';

  const Scanner = dynamic(
    () => import('@yudiel/react-qr-scanner').then((mod) => mod.Scanner),
    { ssr: false }
  );
  ```

- **Mobile browser constraints**: Some mobile browsers cannot use torch and zoom simultaneously. The library
  automatically disables the torch when the zoom is activated to prevent conflicts.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for local-dev setup, code style, PR
process, and the project layout. By participating you agree to abide by the
[Code of Conduct](./CODE_OF_CONDUCT.md). Report security issues via GitHub's
private vulnerability reporting flow.

## License

[MIT](https://github.com/yudielcurbelo/react-qr-scanner/blob/main/LICENSE)
© [Yudiel Curbelo](https://github.com/yudielcurbelo)
