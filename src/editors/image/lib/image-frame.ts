type ChangeListener = (frame: ImageFrame) => void;

export class ImageFrame {
    /**
     * Follows the same convention of `data` but allows read-write.
     */
    private readonly rwData = new Uint8ClampedArray(4 * this.width * this.height);

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
        return this.rwData;
    }

    setPixel(x: number, y: number, color: number): void {
        this.rwData[4 * (y * this.width + x)] = color;
        this.notify();
    }

    getPixel(x: number, y: number): number {
        return this.rwData[4 * (y * this.width * x)];
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