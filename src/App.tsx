import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    return <p>It's been a long time ago!</p>;
}

const root = createRoot(document.body);
root.render(<App />);