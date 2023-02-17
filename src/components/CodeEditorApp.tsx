import Tippy, { useSingleton } from '@tippyjs/react';
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
    alt?: string;
    content?: string;

    /**
     * Tippy singleton.
     */
    singleton?: any;
}

function StatusItem({ icon, alt, content, singleton }: StatusItemProps) {
    return <Tippy content={alt} disabled={!alt} singleton={singleton}>
        <div className='item'>
            {icon ? <span className='material-icons-outlined'>{icon}</span> : null}
            {content ?? null}
        </div>
    </Tippy>
}

function StatusBar() {
    const [source, target] = useSingleton();

    return <footer className='status-bar'>
        <Tippy singleton={source} duration={100} />

        <div className='left-items'>
            <StatusItem icon='update' alt='IDE Release' content='EXPERIMENTAL 2023-02-17 18:40' singleton={target} />
        </div>
        <div className='right-items'>
            <StatusItem icon='power' alt='LIKO-12: experimental-20230217-1843' content='Connected' singleton={target} />
            <StatusItem icon='play_arrow' alt='Execute the code in LIKO-12' content='Run Game' singleton={target} />
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