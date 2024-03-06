### Features

- Scan codes using a smartphone camera or webcam.

### Demo

Checkout the [Demo](https://yudielcurbelo.github.io/react-qr-scanner/).

### Install

    yarn add @yudiel/react-qr-scanner

    npm install @yudiel/react-qr-scanner

### Usage

```jsx
import { Scanner } from '@yudiel/react-qr-scanner';

const App = () => {
    return (
        <Scanner
            onResult={(text, result) => console.log(text, result)}
            onError={(error) => console.log(error?.message)}
        />
    );
}
```

- You can also import `useContinuousScanner` hook and implement your own UI.
- There is also a hook to get the available devices `useDeviceList`.

### Supported Formats

- This library uses the [zxing-js](https://github.com/zxing-js/library) to decode the scanned codes.

| 1D product | 1D industrial | 2D          |
|------------|---------------|-------------|
| UPC-A      | Code 39       | QR Code     |
| UPC-E      | Code 93       | Data Matrix |
| EAN-8      | Code 128      | Aztec       |
| EAN-13     | Codabar       | PDF 417     |
|            | ITF           |             |
|            | RSS-14        |             |
|            | RSS-Expanded  |             |

### Limitations

- Due to browser implementations the camera can only be accessed over https or localhost.
- Beep sound in iOS will only work after user interaction.
- Server side rendering won't work so only require the component when rendering in a browser environment.

### API

| Property   | Type                                     | Description                                                        | Required |
|------------|------------------------------------------|--------------------------------------------------------------------|----------|
| onResult   | `(text: string, result: Result) => void` | Callback function that is called with the scanned text and result. | Yes      |
| onError    | `(error: Error) => void`                 | Optional callback function that is called when an error occurs.    | No       |
| enabled    | `boolean`                                | Optional flag to enable or disable the scanner.                    | No       |
| styles     | `IScannerStyles`                         | Optional styles to apply to the scanner and its components.        | No       |
| options    | `IScannerOptions`                        | Optional configuration options for the browser scanner.            | No       |
| components | `IScannerComponents`                     | Optional components to include or exclude in the scanner.          | No       |

### IUseContinuousScannerReturn Interface
| Property           | Type                                           | Description                                                              |
|--------------------|------------------------------------------------|--------------------------------------------------------------------------|
| `ref`              | `RefObject<HTMLVideoElement>`                  | A reference to the video element used for scanning.                      |
| `startScanning`    | `() => void`                                   | A function to initiate the scanning process.                             |
| `stopScanning`     | `() => void`                                   | A function to stop the scanning process.                                 |
| `loading`          | `boolean`                                      | Indicates whether the scanner is in the process of initializing.         |
| `scanning`         | `boolean`                                      | Indicates whether the scanner is currently active and scanning.          |
| `switchTorch`      | `(value: boolean) => void` \| `undefined`      | An optional function to toggle the device's torch (flashlight) feature.  |
| `getSettings`      | `() => MediaTrackSettings \| undefined`        | An optional function to get the current settings of the media track.     |

### Error Interface

| Property | Type     | Description                        |
|----------|----------|------------------------------------|
| name     | `string` | The name of the error.             |
| message  | `string` | The error message.                 |
| stack    | `string` | Optional stack trace of the error. |

### IScannerStyles Interface

| Property     | Type            | Description                                | Required |
|--------------|-----------------|--------------------------------------------|----------|
| container    | `CSSProperties` | Optional styles for the scanner container. | No       |
| video        | `CSSProperties` | Optional styles for the video element.     | No       |
| finderBorder | number          | Optional border size for the finder.       | No       |

### IScannerOptions Interface

| Property                 | Type                                                                                                       | Description                                    | Required | Default     |
|--------------------------|------------------------------------------------------------------------------------------------------------|------------------------------------------------|----------|-------------|
| deviceId                 | `string`                                                                                                   | Optional ID of the device to use for scanning. | No       | `undefined` |
| hints                    | `Map<`[DecodeHintType](https://zxing.github.io/zxing/apidocs/com/google/zxing/DecodeHintType.html)`, any>` | Optional hints to fine-tune scanning.          | No       | `undefined` |
| constraints              | [DecodeHintType](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints)                   | Optional constraints for the media track.      | No       | `{...}`     |
| delayBetweenScanSuccess  | `number`                                                                                                   | Optional delay between successful scans.       | No       | `500`       |
| delayBetweenScanAttempts | `number`                                                                                                   | Optional delay between scan attempts.          | No       | `500`       |
| tryPlayVideoTimeout      | `number`                                                                                                   | Optional timeout for trying to play the video. | No       | `500`       |

### IScannerComponents Interface

| Property | Type      | Description                                | Required | Default |
|----------|-----------|--------------------------------------------|----------|---------|
| audio    | `boolean` | Optional inclusion of an audio component.  | No       | `true`  |
| torch    | `boolean` | Optional inclusion of a torch component.   | No       | `true`  |
| count    | `boolean` | Optional inclusion of a count component.   | No       | `false` |
| onOff    | `boolean` | Optional inclusion of an on/off component. | No       | `false` |
| tracker  | `boolean` | Optional inclusion of a tracker component. | No       | `false` |
