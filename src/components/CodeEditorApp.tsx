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

function StatusItem({ content }: { content: string }) {
    return <div className='item'>
        {content}
    </div>
}

function StatusBar() {
    return <footer className='status-bar'>
        <div className='left-items'>
            <StatusItem content='EXPERIMENTAL YYYY-MM-DD hh:mm' />
        </div>
        <div className='right-items'>
            <StatusItem content='Connected to LIKO-12' />
        </div>
    </footer>;
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