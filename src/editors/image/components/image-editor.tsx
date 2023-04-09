import React, { useMemo, useState } from 'react';

import { ImageCanvas } from './image-canvas';
import { ColorSelector } from './color-selector';

import { ImageFrame } from '../lib/image-frame';
import { pico8Palette } from '../lib/palette';

import '../styles/layout.scss';



export function ImageEditor() {
    const frame = useMemo(() => new ImageFrame(192, 128), []);

    const canvasSize = 8;
    const offsetX = 0, offsetY = 0;

    const palette = pico8Palette;
    const [brushColor, setBrushColor] = useState(7);

    return <div className='image-editor'>
        <ImageCanvas width={canvasSize} height={canvasSize} {...{ frame, offsetX, offsetY, palette, brushColor }} />
        <div style={{ height: 20 }} />
        <ColorSelector palette={palette} selected={brushColor} onSelect={setBrushColor} />
    </div>;
}