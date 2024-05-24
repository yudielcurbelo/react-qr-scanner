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
        ctx.strokeStyle = 'yellow';
        ctx.strokeRect(x, y, width, height);
    }
}

export function centerText(detectedCodes: IDetectedBarcode[], ctx: CanvasRenderingContext2D) {
    detectedCodes.forEach((detectedCode) => {
        const { boundingBox, rawValue } = detectedCode;
        const centerX = boundingBox.x + boundingBox.width / 2;
        const centerY = boundingBox.y + boundingBox.height / 2;
        const fontSize = Math.max(12, (50 * boundingBox.width) / ctx.canvas.width);
        const lineHeight = fontSize;

        ctx.font = `${fontSize}px sans-serif`;
        ctx.textAlign = 'left';

        let formattedText;
        try {
            formattedText = JSON.stringify(JSON.parse(rawValue), null, 2);
        } catch {
            formattedText = rawValue;
        }

        const lines = formattedText.split('\n');
        const textWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));
        const textHeight = lines.length * lineHeight;
        const padding = 10;
        const rectX = centerX - textWidth / 2 - padding;
        const rectY = centerY - textHeight / 2 - padding;
        const rectWidth = textWidth + padding * 2;
        const rectHeight = textHeight + padding;
        const radius = 8;

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
        ctx.fillStyle = 'rgba(255, 255, 0, 0.9)';
        ctx.fill();

        lines.forEach((line, index) => {
            const y = centerY + index * lineHeight - ((lines.length - 1) * lineHeight) / 2;
            let currentX = centerX - textWidth / 2;
            let lastIndex = 0;

            const propertyMatches = [...line.matchAll(/"([^"]+)":/g)];
            const valueMatches = [...line.matchAll(/:\s*("[^"]*"|\d+|true|false|null)/g)];

            propertyMatches.forEach((match, matchIndex) => {
                const property = match[0].replace(':', '');
                const beforeProperty = line.substring(lastIndex, match.index);

                ctx.fillStyle = 'black';
                ctx.fillText(beforeProperty, currentX, y);
                currentX += ctx.measureText(beforeProperty).width;

                ctx.fillStyle = 'blue';
                ctx.fillText(property, currentX, y);
                currentX += ctx.measureText(property).width;

                lastIndex = match.index + property.length;

                ctx.fillStyle = 'black';
                ctx.fillText(': ', currentX, y);
                currentX += ctx.measureText(': ').width;

                if (matchIndex < valueMatches.length) {
                    const valueMatch = valueMatches[matchIndex];
                    const beforeValue = line.substring(lastIndex, valueMatch.index);

                    ctx.fillStyle = 'black';
                    ctx.fillText(beforeValue, currentX, y);
                    currentX += ctx.measureText(beforeValue).width;

                    const value = valueMatch[0].match(/:\s*(.*)/)?.[1] ?? '';
                    ctx.fillStyle = 'green';
                    ctx.fillText(value, currentX, y);
                    currentX += ctx.measureText(value).width;

                    lastIndex = valueMatch.index + valueMatch[0].length;
                }
            });

            ctx.fillStyle = 'black';
            const remainingLine = line.substring(lastIndex);
            ctx.fillText(remainingLine, currentX, y);
        });
    });
}
