import React, { useCallback } from 'react';

import { Palette, RGBA } from '../lib/palette';

import '../styles/color-selector.scss';

interface ColorSelectorProps {
    palette: Palette;
    /**
     * The currently selected color.
     */
    selected: number;
    /**
     * Triggered when a color is selected from the palette.
     */
    onSelect?: (id: number) => void;
}

export function ColorSelector({ palette, selected, onSelect }: ColorSelectorProps) {
    return <div className='color-selector'>
        {palette.map(([r, g, b, _a], colorId) => {
            return <span
                key={colorId}
                className='color-element'
                style={{ backgroundColor: `rgb(${r},${g},${b})` }}
                onClick={onSelect && (() => onSelect(colorId))}
            >
            </span>;
        })}
        <div className='selection-indicator' style={{
            ['--color-x']: selected % 8,
            ['--color-y']: Math.floor(selected / 8),
        } as React.CSSProperties}/>
    </div>;
}

