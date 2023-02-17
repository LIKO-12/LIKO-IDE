import React, { useEffect, useRef } from 'react';

import { CodeEditor } from '../editor';

function LeftPanel() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const editor = new CodeEditor(containerRef.current);
        return () => editor.dispose();
    }, [containerRef.current]);

    return <div className='left-panel' ref={containerRef}></div>;
}

function RightPanel() {
    return <div className='right-panel'>

    </div>;
}

function StatusBar() {
    return <div className='status-bar'>

    </div>;
}

export function CodeEditorApp() {
    return <>
        <div className='panels-container'>
            <LeftPanel />
            <RightPanel />
        </div>
        <StatusBar />
    </>;
}