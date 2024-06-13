### Features

- Scan codes using a smartphone camera or webcam.

### Demo

Checkout the [Demo](https://yudielcurbelo.github.io/react-qr-scanner/).

### Install

```
yarn add @yudiel/react-qr-scanner

npm install @yudiel/react-qr-scanner
```

### Usage

```jsx
import { Scanner } from '@yudiel/react-qr-scanner';

const App = () => {
    return <Scanner onScan={(result) => console.log(result)} />
}
```

- There is also a hook to get the available devices `useDevices`.

### Supported Formats

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

### Scanner Props

| Prop            | Type                                          | Required | Description                                                              |
|-----------------|-----------------------------------------------|----------|--------------------------------------------------------------------------|
| `onScan`        | `(detectedCodes: IDetectedBarcode[]) => void` | Yes      | Callback function that is called when one or more barcodes are detected. |
| `constraints`   | `MediaTrackConstraints`                       | No       | Optional media track constraints to apply to the video stream.           |
| `formats`       | `BarcodeFormat[]`                             | No       | List of barcode formats to detect.                                       |
| `paused`        | `boolean`                                     | No       | If `true`, scanning is paused.                                           |
| `children`      | `ReactNode`                                   | No       | Optional children to render inside the scanner component.                |
| `components`    | `IScannerComponents`                          | No       | Custom components to use within the scanner.                             |
| `styles`        | `IScannerStyles`                              | No       | Custom styles to apply to the scanner and its elements.                  |
| `classNames`    | `IScannerClassNames`                          | No       | Custom classNames to apply to the scanner and its elements.              |
| `allowMultiple` | `boolean`                                     | No       | If `true`, ignore same barcode being scanned.                            |
| `scanDelay`     | `number`                                      | No       | Delay in milliseconds between scans.                                     |

### Limitations

- Due to browser implementations, the camera can only be accessed over https or localhost.
- Beep sound in iOS will only work after user interaction.
- Server-side rendering won't work, so only require the component when rendering in a browser environment.

### Types

#### `BarcodeFormat`

```typescript
"aztec" | "code_128" | "code_39" | "code_93" | "codabar" | "databar" | "databar_expanded" | "data_matrix" | "dx_film_edge" | "ean_13" | "ean_8" | "itf" | "maxi_code" | "micro_qr_code" | "pdf417" | "qr_code" | "rm_qr_code" | "upc_a" | "upc_e" | "linear_codes" | "matrix_codes" | "unknown"
```

#### `IDetectedBarcode`

```typescript
export interface IDetectedBarcode {
    boundingBox: IBoundingBox;
    cornerPoints: IPoint[];
    format: string;
    rawValue: string;
}
```

#### `IScannerComponents`

```typescript
export interface IScannerComponents {
    tracker?: TrackFunction;
    audio?: boolean;
    onOff?: boolean;
    torch?: boolean;
    zoom?: boolean;
    finder?: boolean;
}
```

#### `IScannerStyles`

```typescript
export interface IScannerStyles {
    container?: CSSProperties;
    video?: CSSProperties;
    finderBorder?: number;
}
```
