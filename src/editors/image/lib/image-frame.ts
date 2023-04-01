export class ImageFrame {
    /**
     * Each pixel is 4-bytes, but only the first byte represents the color value.
     * 
     * The other 3-bytes for each pixel are there to allow uploading the image to WebGL more straight forward.
     */
    public readonly data = new Uint8ClampedArray(4 * this.width * this.height);

    constructor(
        public readonly width: number,
        public readonly height: number,
    ) { }

    setPixel(x: number, y: number, color: number): void {
        this.data[4 * (y * this.width + x)] = color;
    }

    getPixel(x: number, y: number): number {
        return this.data[4 * (y * this.width * x)];
    }
}