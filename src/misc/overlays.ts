import { IDetectedBarcode } from '../types';

export function outline(detectedCodes: IDetectedBarcode[], ctx: CanvasRenderingContext2D) {
    for (const detectedCode of detectedCodes) {
        const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;

        ctx.strokeStyle = 'red';

        ctx.beginPath();
        ctx.moveTo(firstPoint.x, firstPoint.y);
        for (const { x, y } of otherPoints) {
            ctx.lineTo(x, y);
        }
        ctx.lineTo(firstPoint.x, firstPoint.y);
        ctx.closePath();
        ctx.stroke();
    }
}

export function boundingBox(detectedCodes: IDetectedBarcode[], ctx: CanvasRenderingContext2D) {
    for (const detectedCode of detectedCodes) {
        const {
            boundingBox: { x, y, width, height }
        } = detectedCode;

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#007bff';
        ctx.strokeRect(x, y, width, height);
    }
}

export function centerText(detectedCodes: IDetectedBarcode[], ctx: CanvasRenderingContext2D) {
    for (const detectedCode of detectedCodes) {
        const { boundingBox, rawValue } = detectedCode;

        const centerX = boundingBox.x + boundingBox.width / 2;
        const centerY = boundingBox.y + boundingBox.height / 2;

        const fontSize = Math.max(12, (50 * boundingBox.width) / ctx.canvas.width);
        const lineHeight = fontSize * 1.2;

        ctx.font = `${fontSize}px sans-serif`;
        ctx.textAlign = 'center';

        const characters = 30;
        const lines = [];

        for (let i = 0; i < rawValue.length; i += characters) {
            lines.push(rawValue.substring(i, i + characters));
        }

        lines.forEach((line, index) => {
            const y = centerY + index * lineHeight - ((lines.length - 1) * lineHeight) / 2;

            ctx.lineWidth = 6;
            ctx.strokeStyle = 'white';
            ctx.strokeText(line, centerX, y);
            ctx.fillText(line, centerX, y);

            ctx.lineWidth = 1;
            ctx.fillStyle = 'red';
            ctx.strokeText(line, centerX, y);
            ctx.fillText(line, centerX, y);
        });
    }
}
