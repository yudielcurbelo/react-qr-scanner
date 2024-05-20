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

### Limitations

- Due to browser implementations the camera can only be accessed over https or localhost.
- Beep sound in iOS will only work after user interaction.
- Server side rendering won't work so only require the component when rendering in a browser environment.
