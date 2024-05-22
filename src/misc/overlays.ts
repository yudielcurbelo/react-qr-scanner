import { IDetectedBarcode } from '../types';

export function outline(detectedCodes: IDetectedBarcode[], ctx: CanvasRenderingContext2D) {
    for (const detectedCode of detectedCodes) {
        const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'yellow';

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
        const lineHeight = fontSize;

        ctx.font = `${fontSize}px sans-serif`;
        ctx.textAlign = 'center';

        const characters = 20;
        const lines = [];

        for (let i = 0; i < rawValue.length; i += characters) {
            lines.push(rawValue.substring(i, i + characters));
        }

        const textWidth = ctx.measureText(rawValue.substring(0, characters)).width;
        const textHeight = lines.length * lineHeight;

        const padding = 10;
        const rectX = centerX - textWidth / 2 - padding;
        const rectY = centerY - textHeight / 2 - padding;
        const rectWidth = textWidth + padding * 2;
        const rectHeight = textHeight + padding;
        const radius = 10;

        ctx.beginPath();
        ctx.moveTo(rectX + radius, rectY);
        ctx.lineTo(rectX + rectWidth - radius, rectY);
        ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + radius);
        ctx.lineTo(rectX + rectWidth, rectY + rectHeight - radius);
        ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - radius, rectY + rectHeight);
        ctx.lineTo(rectX + radius, rectY + rectHeight);
        ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - radius);
        ctx.lineTo(rectX, rectY + radius);
        ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY);
        ctx.closePath();
        ctx.fillStyle = 'yellow';
        ctx.fill();

        lines.forEach((line, index) => {
            const y = centerY + index * lineHeight - ((lines.length - 1) * lineHeight) / 2;

            ctx.lineWidth = 1;
            ctx.fillStyle = 'black';
            ctx.fillText(line, centerX, y);
        });
    }
}
