import React from 'react';

import { Palette, RGBA } from '../lib/palette';

import '../styles/color-selector.scss';

//#region Sub-components

interface ColorsGrid {
    palette: Palette;
    setColorId?: (id: number) => void;
}

function ColorsGrid({ palette, setColorId }: ColorsGrid) {

    return <>
        {palette.map(([r, g, b, _a], colorId) => {
            return <span
                key={colorId}
                className='color-element'
                style={{ backgroundColor: `rgb(${r},${g},${b})` }}
                onClick={setColorId && (() => setColorId(colorId))}
            />;
        })}
    </>;
}

//#endregion

interface ColorSelectorProps {
    palette: Palette;
    setColorId?: (id: number) => void;
}

export function ColorSelector({ palette, setColorId }: ColorSelectorProps) {
    return <div className='color-selector'>
        <ColorsGrid palette={palette} setColorId={setColorId} />
    </div>;
}

