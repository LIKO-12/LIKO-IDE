import React, { useEffect, useMemo, useRef } from 'react';

import { ImageCanvas } from './image-canvas';
import { ColorSelector } from './color-selector';

import { ImageFrame } from '../lib/image-frame';
import { pico8Palette } from '../lib/palette';

import '../styles/layout.scss';



export function ImageEditor() {
    const frameSize = 8;
    const frame = useMemo(() => new ImageFrame(frameSize, frameSize), []);

    return <div className='image-editor'>
        <ImageCanvas frame={frame} width={frameSize} height={frameSize} palette={pico8Palette} />
        <div style={{ height: 20 }} />
        <ColorSelector palette={pico8Palette} />
    </div>;
}