# @yudiel/react-qr-scanner

[![npm version](https://img.shields.io/npm/v/@yudiel/react-qr-scanner.svg)](https://www.npmjs.com/package/@yudiel/react-qr-scanner)
[![npm downloads](https://img.shields.io/npm/dm/@yudiel/react-qr-scanner.svg)](https://www.npmjs.com/package/@yudiel/react-qr-scanner)
[![license](https://img.shields.io/npm/l/@yudiel/react-qr-scanner.svg)](https://github.com/yudielcurbelo/react-qr-scanner/blob/main/LICENSE)

A modern React library for scanning QR codes and barcodes using your device camera or webcam. Built on top of the Barcode Detection API with React hooks and components.

## Features

- **Multiple Barcode Formats** - Supports QR codes, EAN, UPC, Code 128, and many more 1D/2D formats
- **Camera Controls** - Built-in torch (flashlight), zoom, and camera switching capabilities
- **Flexible Scanning** - Continuous scanning, single scan mode, or pause/resume functionality
- **Custom Tracking** - Draw custom overlays and tracking visualizations on detected barcodes
- **Device Selection** - Choose specific cameras with the `useDevices` hook
- **Customizable UI** - Custom styles, class names, and component overrides
- **Audio Feedback** - Optional beep sound on successful scans (with custom sound support)
- **TypeScript Support** - Fully typed for excellent developer experience
- **Lightweight** - Minimal dependencies with optimized bundle size
- **Cross-browser Compatible** - Works across modern browsers with `webrtc-adapter`

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
  - [useDevices Hook](#usedevices-hook)
- [Supported Formats](#supported-formats)
- [Type Definitions](#type-definitions)
- [Browser Support](#browser-support)
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
        audio: true, // Play beep sound on scan
        onOff: true, // Show camera on/off button
        torch: true, // Show torch/flashlight button (if supported)
        zoom: true, // Show zoom control (if supported)
        finder: true, // Show finder overlay
      }}
      // Custom sound (base64 encoded audio)
      sound="data:audio/mp3;base64,YOUR_BASE64_AUDIO_HERE"
    />
  );
}
```

## API Reference

### Scanner Props

| Prop            | Type                                          | Required | Default | Description                                                                                      |
|-----------------|-----------------------------------------------|----------|---------|--------------------------------------------------------------------------------------------------|
| `onScan`        | `(detectedCodes: IDetectedBarcode[]) => void` | Yes      | -       | Callback function called when one or more barcodes are detected.                                 |
| `onError`       | `(error: unknown) => void`                    | No       | -       | Callback function called when an error occurs while accessing the camera.                        |
| `constraints`   | `MediaTrackConstraints`                       | No       | `{}`    | Media track constraints to apply to the video stream (e.g., `facingMode`, `deviceId`).          |
| `formats`       | `BarcodeFormat[]`                             | No       | All     | Array of barcode formats to detect. If not specified, all supported formats are detected.        |
| `paused`        | `boolean`                                     | No       | `false` | If `true`, the scanner pauses and displays the last frame.                                       |
| `children`      | `ReactNode`                                   | No       | -       | Custom children to render inside the scanner container.                                          |
| `components`    | `IScannerComponents`                          | No       | `{}`    | Configuration for built-in UI components and custom tracker function.                            |
| `styles`        | `IScannerStyles`                              | No       | `{}`    | Custom CSS styles for scanner elements.                                                          |
| `classNames`    | `IScannerClassNames`                          | No       | `{}`    | Custom CSS class names for scanner elements.                                                     |
| `scanDelay`     | `number`                                      | No       | `500`   | Delay in milliseconds between successful scans. Prevents duplicate detections.                   |
| `allowMultiple` | `boolean`                                     | No       | `false` | If `true`, allows the same barcode to trigger `onScan` multiple times.                           |
| `sound`         | `boolean \| string`                           | No       | `false` | If `true`, plays default beep sound. Provide a base64 audio string for custom sound.            |

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

## Supported Formats

The library supports detection of the following barcode formats:

| 1D Barcodes      | 2D Barcodes   |
|------------------|---------------|
| Codabar          | Aztec         |
| Code 39          | Data Matrix   |
| Code 93          | Matrix Codes  |
| Code 128         | Maxi Code     |
| Databar          | Micro QR Code |
| Databar Expanded | PDF 417       |
| Dx Film Edge     | QR Code       |
| EAN 8            | rMQR Code     |
| EAN 13           |               |
| ITF              |               |
| Linear Codes     |               |
| UPC A            |               |
| UPC E            |               |

To detect specific formats only:

```jsx
<Scanner
  onScan={(result) => console.log(result)}
  formats={['qr_code', 'ean_13', 'code_128']}
/>
```

## Type Definitions

### `BarcodeFormat`

```typescript
type BarcodeFormat =
  | 'aztec'
  | 'code_128'
  | 'code_39'
  | 'code_93'
  | 'codabar'
  | 'databar'
  | 'databar_expanded'
  | 'data_matrix'
  | 'dx_film_edge'
  | 'ean_13'
  | 'ean_8'
  | 'itf'
  | 'maxi_code'
  | 'micro_qr_code'
  | 'pdf417'
  | 'qr_code'
  | 'rm_qr_code'
  | 'upc_a'
  | 'upc_e'
  | 'linear_codes'
  | 'matrix_codes'
  | 'unknown';
```

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
- **getUserMedia API** - Camera access
- **Barcode Detection API** - Barcode scanning (polyfilled via [barcode-detector](https://www.npmjs.com/package/barcode-detector))
- **Canvas API** - Drawing tracking overlays

**Supported Browsers:**
- Chrome/Edge 88+
- Firefox 90+ (with polyfill)
- Safari 14+ (with polyfill)
- Mobile browsers (iOS Safari 14.5+, Chrome Mobile)

The library uses `webrtc-adapter` for cross-browser compatibility.

## Limitations

- **HTTPS or localhost required** - Due to browser security restrictions, camera access only works on secure contexts (HTTPS or localhost).
- **iOS audio limitations** - Beep sound on iOS Safari requires user interaction before playing. The first scan after page load may not play sound.
- **Server-Side Rendering (SSR)** - This library requires browser APIs and will not work during SSR. Ensure you only import and use it in client-side code:

  ```jsx
  // Next.js example
  import dynamic from 'next/dynamic';

  const Scanner = dynamic(
    () => import('@yudiel/react-qr-scanner').then((mod) => mod.Scanner),
    { ssr: false }
  );
  ```

- **Mobile browser constraints** - Some mobile browsers cannot use torch and zoom simultaneously. The library automatically disables torch when zoom is activated to prevent conflicts.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](https://github.com/yudielcurbelo/react-qr-scanner/blob/main/LICENSE) © [Yudiel Curbelo](https://github.com/yudielcurbelo)