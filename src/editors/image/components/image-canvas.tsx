import React, { useRef, useEffect, useMemo } from 'react';

import { CanvasRenderer } from '../lib/canvas-renderer';
import { ImageFrame } from '../lib/image-frame';
import { Palette } from '../lib/palette';

import '../styles/image-canvas.scss';

//#region Utilities

const { floor, min, max } = Math;

function clamp(value: number, minValue: number, maxValue: number): number {
    return min(max(value, minValue), maxValue);
}

const buttonsBits = {
    left: 0b001,
    right: 0b010,
    middle: 0b100,
}

function isButtonDown(buttons: number, button: keyof typeof buttonsBits) {
    return (buttons & buttonsBits[button]) !== 0;
}

//#endregion

interface ImageCanvasProps {
    frame: ImageFrame;

    offsetX?: number;
    offsetY?: number;

    width: number;
    height: number;

    palette: Palette;
    brushColor: number;
}

/**
 * Contains the state values that can change without requiring a rerender of the component.
 */
class ImageCanvasPassiveState {
    brushColor = 7;
}

/**
 * A component for editing the pixels of an image
 */
export function ImageCanvas({ frame, offsetX, offsetY, width, height, palette, brushColor }: ImageCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const passive = useMemo(() => new ImageCanvasPassiveState(), []);

    passive.brushColor = brushColor;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new CanvasRenderer(canvas, palette);
        const onImageChanges = () => renderer.render(frame, offsetX, offsetY);

        const onPointer = (ev: PointerEvent) => {
            const scaleX = canvas.clientWidth / canvas.width;
            const scaleY = canvas.clientHeight / canvas.height;

            const x = floor(clamp(ev.offsetX / scaleX, 0, canvas.width - 1));
            const y = floor(clamp(ev.offsetY / scaleY, 0, canvas.height - 1));

            const { buttons } = ev;

            if (isButtonDown(buttons, 'middle')) frame.clear();
            else if (isButtonDown(buttons, 'left')) frame.setPixel(x, y, passive.brushColor);
            else if (isButtonDown(buttons, 'right')) frame.setPixel(x, y, 0);
            else return;

            ev.preventDefault();
        };

        const onContextMenu = (ev: Event) => {
            ev.preventDefault();
        };

        canvas.addEventListener('pointerdown', onPointer);
        canvas.addEventListener('pointermove', onPointer);
        canvas.addEventListener('pointerup', onPointer);
        canvas.addEventListener('contextmenu', onContextMenu);
        frame.addListener(onImageChanges);

        onImageChanges();

        return () => {
            canvas.removeEventListener('pointerdown', onPointer);
            canvas.removeEventListener('pointermove', onPointer);
            canvas.removeEventListener('pointerup', onPointer);
            canvas.removeEventListener('contextmenu', onContextMenu);
            frame.removeListener(onImageChanges);
        };

    }, [canvasRef.current, frame, palette]);

    return <canvas className='image-canvas' ref={canvasRef} width={width} height={height}>
        PLEASE CONTACT THE DEVELOPER IF THIS MESSAGE SHOWS FOR YOU!
    </canvas>;
}