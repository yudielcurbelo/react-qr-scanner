import { IllegalArgumentException, InvertedLuminanceSource, LuminanceSource } from '@zxing/library';

export class HTMLCanvasElementLuminanceSource extends LuminanceSource {
    private static DEGREE_TO_RADIANS = Math.PI / 180;

    private static makeBufferFromCanvasImageData(canvas: HTMLCanvasElement): Uint8ClampedArray {
        const canvasCtx = canvas.getContext('2d', { willReadFrequently: true });

        if (!canvasCtx) {
            throw new Error("Couldn't get canvas context.");
        }

        const imageData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);

        return HTMLCanvasElementLuminanceSource.toGrayscaleBuffer(imageData.data, canvas.width, canvas.height);
    }

    private static toGrayscaleBuffer(imageBuffer: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray {
        const grayscaleBuffer = new Uint8ClampedArray(width * height);

        for (let i = 0, j = 0, length = imageBuffer.length; i < length; i += 4, j++) {
            let gray;
            const alpha = imageBuffer[i + 3];

            if (alpha === 0) {
                gray = 0xff;
            } else {
                const pixelR = imageBuffer[i];
                const pixelG = imageBuffer[i + 1];
                const pixelB = imageBuffer[i + 2];

                gray = (306 * pixelR + 601 * pixelG + 117 * pixelB + 0x200) >> 10;
            }

            grayscaleBuffer[j] = gray;
        }

        return grayscaleBuffer;
    }

    private buffer: Uint8ClampedArray;

    private tempCanvasElement?: HTMLCanvasElement = undefined;

    public constructor(private canvas: HTMLCanvasElement) {
        super(canvas.width, canvas.height);
        this.buffer = HTMLCanvasElementLuminanceSource.makeBufferFromCanvasImageData(canvas);
    }

    public getRow(y: number, row: Uint8ClampedArray): Uint8ClampedArray {
        if (y < 0 || y >= this.getHeight()) {
            throw new IllegalArgumentException('Requested row is outside the image: ' + y);
        }

        const width: number = this.getWidth();
        const start = y * width;

        if (row === null) {
            row = this.buffer.slice(start, start + width);
        } else {
            if (row.length < width) {
                row = new Uint8ClampedArray(width);
            }

            row.set(this.buffer.slice(start, start + width));
        }

        return row;
    }

    public getMatrix(): Uint8ClampedArray {
        return this.buffer;
    }

    public isCropSupported(): boolean {
        return true;
    }

    public crop(left: number, top: number, width: number, height: number): LuminanceSource {
        super.crop(left, top, width, height);

        return this;
    }

    public isRotateSupported(): boolean {
        return true;
    }

    public rotateCounterClockwise(): LuminanceSource {
        this.rotate(-90);

        return this;
    }

    public rotateCounterClockwise45(): LuminanceSource {
        this.rotate(-45);

        return this;
    }

    public invert(): LuminanceSource {
        return new InvertedLuminanceSource(this);
    }

    private getTempCanvasElement() {
        if (null === this.tempCanvasElement) {
            const tempCanvasElement = this.canvas.ownerDocument.createElement('canvas');
            tempCanvasElement.width = this.canvas.width;
            tempCanvasElement.height = this.canvas.height;
            this.tempCanvasElement = tempCanvasElement;
        }

        return this.tempCanvasElement;
    }

    private rotate(angle: number) {
        const tempCanvasElement = this.getTempCanvasElement();

        if (!tempCanvasElement) {
            throw new Error('Could not create a Canvas element.');
        }

        const angleRadians = angle * HTMLCanvasElementLuminanceSource.DEGREE_TO_RADIANS;

        const width = this.canvas.width;
        const height = this.canvas.height;
        const newWidth = Math.ceil(Math.abs(Math.cos(angleRadians)) * width + Math.abs(Math.sin(angleRadians)) * height);
        const newHeight = Math.ceil(Math.abs(Math.sin(angleRadians)) * width + Math.abs(Math.cos(angleRadians)) * height);
        tempCanvasElement.width = newWidth;
        tempCanvasElement.height = newHeight;

        const tempContext = tempCanvasElement.getContext('2d', { willReadFrequently: true });

        if (!tempContext) {
            throw new Error('Could not create a Canvas Context element.');
        }

        tempContext.translate(newWidth / 2, newHeight / 2);
        tempContext.rotate(angleRadians);
        tempContext.drawImage(this.canvas, width / -2, height / -2);

        this.buffer = HTMLCanvasElementLuminanceSource.makeBufferFromCanvasImageData(tempCanvasElement);

        return this;
    }
}
