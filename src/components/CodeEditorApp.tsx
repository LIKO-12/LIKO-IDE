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

interface StatusItemProps {
    /**
     * https://fonts.google.com/icons?icon.style=Outlined
     */
    icon?: string;
    content?: string;
}

function StatusItem({ icon, content }: StatusItemProps) {
    return <div className='item'>
        {icon ? <span className='material-icons-outlined'>{icon}</span> : null}
        {content ?? null}
    </div>
}

function StatusBar() {
    return <footer className='status-bar'>
        <div className='left-items'>
            <StatusItem icon='update' content='EXPERIMENTAL YYYY-MM-DD hh:mm' />
        </div>
        <div className='right-items'>
            <StatusItem icon='power' content='Connected to LIKO-12' />
            <StatusItem icon='play_arrow' content='Run Game' />
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