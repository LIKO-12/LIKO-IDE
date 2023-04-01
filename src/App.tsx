import React from 'react';
import { createRoot } from 'react-dom/client';

import { CodeEditorApp } from './editors/code/components/code-editor';

function App() {
    return <CodeEditorApp />;
}

// Create root HTML element.
const rootNode = document.createElement('div');
rootNode.id = 'root';
document.body.append(rootNode);

// Create React root.
const root = createRoot(rootNode);
root.render(<App />);