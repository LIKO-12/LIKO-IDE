import React, { useMemo, useState } from 'react';

import { ImageCanvas } from './image-canvas';
import { ColorSelector } from './color-selector';

import { ImageFrame } from '../lib/image-frame';
import { pico8Palette } from '../lib/palette';

import '../styles/layout.scss';



export function ImageEditor() {
    const frameSize = 8;
    const frame = useMemo(() => new ImageFrame(frameSize, frameSize), []);

    const palette = pico8Palette;
    const [brushColor, setBrushColor] = useState(7);

    return <div className='image-editor'>
        <ImageCanvas frame={frame} width={frameSize} height={frameSize} palette={palette} brushColor={brushColor} />
        <div style={{ height: 20 }} />
        <ColorSelector palette={palette} onSelect={setBrushColor} />
    </div>;
}