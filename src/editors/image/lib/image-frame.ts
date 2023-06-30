type ChangeListener = (frame: ImageFrame) => void;

export class ImageFrame {
    /**
     * Follows the same convention of `data` but allows read-write.
     */
    private readonly rw8 = new Uint8ClampedArray(4 * this.width * this.height);
    private readonly rw32 = new Uint32Array(this.rw8.buffer);

    private listeners: ChangeListener[] = [];

    constructor(
        public readonly width: number,
        public readonly height: number,
    ) { }

    /**
     * Each pixel is 4-bytes, but only the first byte represents the color value.
     * 
     * The other 3-bytes for each pixel are there to allow uploading the image to WebGL more straight forward.
     */
    get data(): Readonly<Uint8ClampedArray> {
        return this.rw8;
    }

    setPixel(x: number, y: number, color: number): void {
        this.rw8[4 * (y * this.width + x)] = color;
        this.notify();
    }

    getPixel(x: number, y: number): number {
        return this.rw8[4 * (y * this.width * x)];
    }

    fill(color: number, x = 0, y = 0, width = this.width, height = this.height): void {
        const fromX = Math.max(x, 0), fromY = Math.max(y, 0);
        const toX = Math.min(fromX + width, this.width), toY = Math.min(fromY + height, this.height);

        for (let line = fromY; line < toY; line++) {
            const offset = this.width * line;
            this.rw32.fill(color, offset + fromX, offset + toX);
        }
        8
        this.notify();
    }

    clear(): void {
        this.rw8.fill(0);
        this.notify();
    }

    addListener(listener: ChangeListener): void {
        if (this.listeners.includes(listener)) return;
        this.listeners.push(listener);
    }

    /**
     * Unregister an observer.
     */
    removeListener(listener: ChangeListener): void {
        this.listeners = this.listeners.filter(value => value !== listener);
    }

    /**
     * Notifies the observers of changes.
     */
    private notify(): void {
        for (const listener of this.listeners)
            listener(this);
    }
}