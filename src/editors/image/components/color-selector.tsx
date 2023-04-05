import React, { useCallback } from 'react';

import { Palette, RGBA } from '../lib/palette';

import '../styles/color-selector.scss';

//#region Sub-components

interface ColorsGrid {
    palette: Palette;
    onSelect?: (id: number) => void;
}

function ColorsGrid({ palette, onSelect }: ColorsGrid) {
    return <>
        {palette.map(([r, g, b, _a], colorId) => {
            return <span
                key={colorId}
                className='color-element'
                style={{ backgroundColor: `rgb(${r},${g},${b})` }}
                onClick={onSelect && (() => onSelect(colorId))}
            />;
        })}
    </>;
}

//#endregion

interface ColorSelectorProps {
    palette: Palette;
    /**
     * Triggered when a color is selected from the palette.
     */
    onSelect?: (id: number) => void;
}

export function ColorSelector({ palette, onSelect }: ColorSelectorProps) {
    return <div className='color-selector'>
        <ColorsGrid palette={palette} onSelect={onSelect} />
    </div>;
}

