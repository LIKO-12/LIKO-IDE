
export type RGBA = [r: number, g: number, b: number, a: number];
export type Palette = RGBA[];

export const pico8Palette: Palette = [
    [0, 0, 0, 255], // Black 0
    [28, 43, 83, 255], // Dark Blue 1
    [127, 36, 84, 255], // Dark Red 2
    [0, 135, 81, 255], // Dark Green 3
    [171, 82, 54, 255], // Brown 4
    [96, 88, 79, 255], // Dark Gray 5
    [195, 195, 198, 255], // Gray 6
    [255, 241, 233, 255], // White 7
    [237, 27, 81, 255], // Red 8
    [250, 162, 27, 255], // Orange 9
    [247, 236, 47, 255], // Yellow 10
    [93, 187, 77, 255], // Green 11
    [81, 166, 220, 255], // Blue 12
    [131, 118, 156, 255], // Purple 13
    [241, 118, 166, 255], // Pink 14
    [252, 204, 171, 255], // Human Skin 15
];