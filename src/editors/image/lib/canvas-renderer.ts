import { ImageFrame } from './image-frame';
import { Palette } from './palette';

export class CanvasRenderer {
    private readonly context: CanvasRenderingContext2D;
    private readonly buffer = new ImageData(this.canvas.width, this.canvas.height);

    constructor(
        public readonly canvas: HTMLCanvasElement,
        public readonly palette: Readonly<Palette>,
    ) {
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Failed to create 2d context!');
        this.context = context;
    }

    public render(frame: ImageFrame, offsetX = 0, offsetY = 0) {
        offsetX = Math.floor(offsetX), offsetY = Math.floor(offsetY);

        const width = Math.min(frame.width, this.canvas.width);
        const height = Math.min(frame.height, this.canvas.height);

        const buffer = this.buffer;

        for (let y = 0; y <= buffer.height; y++) {
            for (let x = 0; x <= buffer.width; x++) {
                const frameIndex = (offsetY + y) * frame.width + (x + offsetX);
                const bufferIndex = y * buffer.width + x;

                const colorId = (x < width && y < height) ? frame.data[4 * frameIndex] : 0;
                const [r, g, b, a] = this.palette[colorId];

                buffer.data[4 * bufferIndex] = r;
                buffer.data[4 * bufferIndex + 1] = g;
                buffer.data[4 * bufferIndex + 2] = b;
                buffer.data[4 * bufferIndex + 3] = a;
            }
        }

        this.context.putImageData(this.buffer, 0, 0);
    }
}