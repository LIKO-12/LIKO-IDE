import React from 'react';
import { createRoot } from 'react-dom/client';

// import { CodeEditorApp } from './editors/code/components/code-editor';
import { ImageEditor } from './editors/image/components/image-editor';

function App() {
    return <ImageEditor />;
}

// Create root HTML element.
const rootNode = document.createElement('div');
rootNode.id = 'root';
document.body.append(rootNode);

// Create React root.
const root = createRoot(rootNode);
root.render(<App />);