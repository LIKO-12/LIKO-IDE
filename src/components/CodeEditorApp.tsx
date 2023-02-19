import Tippy, { useSingleton } from '@tippyjs/react';
import React, { useEffect, useRef, useState } from 'react';

import { CodeEditor } from '../lib/code-editor';
import { ConnectionManager, ConnectionStatus } from '../lib/connection-manager';
import { connectionManager, remoteAgent } from '../singleton';

function LeftPanel() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const editor = new CodeEditor(containerRef.current, remoteAgent);
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

const statusLabels: Record<ConnectionStatus, string> = {
    [ConnectionStatus.NotConnected]: 'Not Connected',
    [ConnectionStatus.Connecting]: 'Connecting',
    [ConnectionStatus.Identifying]: 'Identifying',
    [ConnectionStatus.Connected]: 'Connected',
    [ConnectionStatus.Disconnected]: 'Disconnected',
};

const statusIcons: Record<ConnectionStatus, string> = {
    [ConnectionStatus.NotConnected]: 'power_off',
    [ConnectionStatus.Connecting]: 'pending',
    [ConnectionStatus.Identifying]: 'pending',
    [ConnectionStatus.Connected]: 'power',
    [ConnectionStatus.Disconnected]: 'power_off',
};


function ConnectionStatusItem({ singleton }: { singleton: any }) {
    const [status, setStatus] = useState(connectionManager.status);

    // TODO: Change color based on status.
    // TODO: Trigger reconnect/disconnect on user interaction.
    // TODO: Provide actual alt text.

    useEffect(() => {
        const listener = (manager: ConnectionManager) => {
            setStatus(manager.status);
        };

        connectionManager.addEventListener('status_update', listener);
        return () => connectionManager.removeEventListener('status_update', listener);
    }, []);

    return <StatusItem
        icon={statusIcons[status]}
        alt='LIKO-12: experimental-20230217-1843'
        content={statusLabels[status]}
        singleton={singleton}
    />;
}

function StatusBar() {
    const [source, target] = useSingleton();

    // TODO: Provide the singleton in a context.

    return <footer className='status-bar'>
        <Tippy singleton={source} duration={100} />

        <div className='left-items'>
            <StatusItem icon='update' alt='IDE Release' content='EXPERIMENTAL 2023-02-17 18:40' singleton={target} />
        </div>
        <div className='right-items'>
            <ConnectionStatusItem singleton={target} />
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