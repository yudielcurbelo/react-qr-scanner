### Features

- Scan Qr Codes using a smartphone camera or webcam.

### Demo
Checkout the [Demo](https://yudielcurbelo.github.io/react-qr-scanner/).

### Install

    yarn add @yudiel/react-qr-scanner

    npm install @yudiel/react-qr-scanner

### Usage

```jsx
import {QrScanner} from '@yudiel/react-qr-scanner';

const App = () => {
  return (
      <QrScanner
          onDecode={(result) => console.log(result)}
          onError={(error) => console.log(error?.message)}
      />
  );
}
```

### Supported Formats

| 1D product  | 1D industrial | 2D           |
|-------------|---------------|--------------|
| UPC-A       | Code 39       | QR Code      |
| EAN-8       | Code 128      | Data Matrix  |
| EAN-13      | RSS-14        | Aztec        |
|             |               | PDF 417      |

### Limitations
- Due to browser implementations the camera can only be accessed over https or localhost.
- Server side rendering won't work so only require the component when rendering in a browser environment.

### API
| Properties     | Types                                                                                           | Default Value                   | Description                                                       |
|----------------|-------------------------------------------------------------------------------------------------|---------------------------------|-------------------------------------------------------------------|
| constraints    | [MediaTrackConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints) | `{ facingMode: 'environment' }` | Specify which camera should be used (if available).               |
| containerStyle | `object`                                                                                        | none                            | Style object for the container element.                           |
| videoStyle     | `object`                                                                                        | none                            | Style object for the video element.                               |
| scanDelay      | `number`                                                                                        | `500`                           | The scan period for the QR hook.                                  |
| videoId        | `string`                                                                                        | `videoId`                       | The Id for the video element.                                     |
| onResult       | `function`                                                                                      | none                            | Scan event handler for result object.                             |
| onDecode       | `function`                                                                                      | none                            | Scan event handler for decode value.                              |
| onError        | `function`                                                                                      | none                            | Scan event handler for error object.                              |
| ViewFinder     | `component`                                                                                     | none                            | ViewFinder component to rendering as overlay in the video element |
| hideCount      | `boolean`                                                                                       | `true`                          | Hide the scanned count as overlay in the video element            |
| stopDecoding   | `boolean`                                                                                       | `false`                         | Stop the decoding process                                         |
