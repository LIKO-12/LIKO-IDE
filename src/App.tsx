import React from 'react';
import { createRoot } from 'react-dom/client';

import { CodeEditorApp } from './components/CodeEditorApp';

function App() {
    return <CodeEditorApp />;
}

const rootNode = document.createElement('div');
rootNode.id = 'root';
document.body.append(rootNode);

const root = createRoot(rootNode);
root.render(<App />);