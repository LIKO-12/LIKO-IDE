import React, { useEffect, useMemo, useRef } from 'react';
import { CanvasRenderer } from '../lib/canvas-renderer';
import { ImageFrame } from '../lib/image-frame';

import '../styles/layout.scss';

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


// Don't use `bitmaprenderer`, it doesn't support nearest neighbor filtering.


export function ImageEditor() {
    const frameSize = 16;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const frame = useMemo(() => new ImageFrame(frameSize, frameSize), []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new CanvasRenderer(canvas, [
            [0x00, 0x00, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0xFF],
            [0xFF, 0xFF, 0xFF, 0xFF],
        ]);
        renderer.render(frame);

        const onPointerEvent = (ev: PointerEvent) => {
            const scaleX = canvas.clientWidth / canvas.width;
            const scaleY = canvas.clientHeight / canvas.height;

            const x = floor(clamp(ev.offsetX / scaleX, 0, canvas.width - 1));
            const y = floor(clamp(ev.offsetY / scaleY, 0, canvas.height - 1));

            const { buttons } = ev;

            if (isButtonDown(buttons, 'middle')) frame.data.fill(0);
            else if (isButtonDown(buttons, 'left')) frame.setPixel(x, y, 2);
            else if (isButtonDown(buttons, 'right')) frame.setPixel(x, y, 1);
            else return;

            renderer.render(frame);
        };

        const onContextMenu = (ev: Event) => {
            ev.preventDefault();
        };

        canvas.addEventListener('pointerdown', onPointerEvent);
        canvas.addEventListener('pointermove', onPointerEvent);
        canvas.addEventListener('pointerup', onPointerEvent);
        canvas.addEventListener('contextmenu', onContextMenu);

        return () => {
            canvas.removeEventListener('pointerdown', onPointerEvent);
            canvas.removeEventListener('pointermove', onPointerEvent);
            canvas.removeEventListener('pointerup', onPointerEvent);
            canvas.removeEventListener('contextmenu', onContextMenu);
        };

    }, [canvasRef.current]);

    return <div className='image-editor'>
        <h1>↓ Show us your drawing skills ↓</h1>

        <canvas className='image-canvas' ref={canvasRef} width={frameSize} height={frameSize}>
            PLEASE CONTACT THE DEVELOPER IF THIS MESSAGE SHOWS FOR YOU!
        </canvas>

        <h1>↑ You got nothing to lose ↑</h1>
    </div>;
}