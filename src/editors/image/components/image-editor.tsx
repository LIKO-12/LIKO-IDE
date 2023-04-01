import React, { useEffect, useRef } from 'react';

import '../styles/layout.scss';

const floor = Math.floor;

const buttonsBits = {
    left: 0b001,
    right: 0b010,
    middle: 0b100,
}

function isButtonDown(buttons: number, button: keyof typeof buttonsBits) {
    return (buttons & buttonsBits[button]) !== 0;
}

export function ImageEditor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const scaleX = canvas.clientWidth / canvas.width;
        const scaleY = canvas.clientHeight / canvas.height;

        const context = canvas.getContext('2d');
        if (!context) return;

        const onPointerEvent = (ev: PointerEvent) => {
            const x = floor(ev.offsetX / scaleX), y = floor(ev.offsetY / scaleY);
            const { buttons } = ev;

            if (isButtonDown(buttons, 'middle')) {
                context.clearRect(0, 0, canvas.width, canvas.height);

            } else if (isButtonDown(buttons, 'left')) {
                context.fillRect(x, y, 1, 1);

            } else if (isButtonDown(buttons, 'right')) {
                context.clearRect(x, y, 1, 1);

            }
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

        <canvas className='image-canvas' ref={canvasRef} width='16' height='16'>
            PLEASE CONTACT THE DEVELOPER IF THIS MESSAGES SHOWS FOR YOU!
        </canvas>

        <h1>↑ You got nothing to lose ↑</h1>
    </div>;
}