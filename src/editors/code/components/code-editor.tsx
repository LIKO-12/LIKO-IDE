import React, { useEffect, useRef, useState } from 'react';

import '../styles/variables.scss';
import '../styles/layout.scss';
import '../styles/status-bar.scss';

import { StatusBar } from './status-bar';
import { CodeEditor } from '../lib/code-editor';
import { remoteAgent } from '../../../singleton';

export function CodeEditorApp() {
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const [codeEditor, setCodeEditor] = useState<CodeEditor>();

    useEffect(() => {
        if (!editorContainerRef.current) return;

        const editor = new CodeEditor(editorContainerRef.current, remoteAgent);
        setCodeEditor(editor);

        return () => {
            setCodeEditor(undefined);
            editor.dispose();
        };

    }, [editorContainerRef.current]);

    return <div className='code-editor'>
        <div className='panels-container'>
            <LeftPanel containerRef={editorContainerRef} />
            <RightPanel />
        </div>
        <StatusBar codeEditor={codeEditor} />
    </div>;
}

function LeftPanel({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
    return <div className='left-panel' ref={containerRef}></div>;
}

function RightPanel() {
    return <div className='right-panel'>

    </div>;
}
