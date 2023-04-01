
import * as monaco from 'monaco-editor';
import { RemoteAgent } from '../../../lib/remote-agent';

const exampleProgram = `
print("Hello from game.lua");

clear();

local rectX, rectY = 5, 5;
local rectColor = 0;

local movementSpeed = 64;

function _draw()
    rectangle(rectX, rectY, 10, 10, true, rectColor)
    rectangle(rectX, rectY, 10, 10, false, rectColor + 8)
end

function _update(dt)
    updateControls(dt)
end

function updateControls(dt)
    local distance = dt * movementSpeed
    if liko.keyboard.isDown('up') then rectY = rectY - distance end
    if liko.keyboard.isDown('down') then rectY = rectY + distance end
    if liko.keyboard.isDown('left') then rectX = rectX - distance end
    if liko.keyboard.isDown('right') then rectX = rectX + distance end
end

function _keypressed(key)
    if key == 'z' then rectColor = (rectColor + 1) % 8 end
    if key == 'x' then clear() end
end
`;

export class CodeEditor {
    private readonly editor: monaco.editor.IStandaloneCodeEditor;
    private readonly model: monaco.editor.ITextModel;

    private readonly onResizeListener = () => this.editor.layout();
    private disposed = false;

    constructor(
        container: HTMLElement,
        private remoteAgent: RemoteAgent,
    ) {
        this.editor = monaco.editor.create(container, {
            value: localStorage.getItem('code') ?? exampleProgram,
            language: 'lua',
            theme: 'vs-dark',
            cursorBlinking: 'smooth',

            fontFamily: 'JetBrains Mono',
            fontLigatures: true,
        });

        this.model = this.editor.getModel()!;

        this.model.onDidChangeContent(() => {
            localStorage.setItem('code', this.model.getValue());
            // TODO: sync indicator.
            // TODO: use a persistent storage method.
        });

        this.editor.addAction({
            id: 'liko-run',
            label: 'Run in LIKO-12',
            keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR,
            ],
            run: this.runGameOnAgent.bind(this),
        });

        addEventListener('resize', this.onResizeListener);
    }

    async runGameOnAgent() {
        const scriptContent = this.model.getValue();
        return this.remoteAgent.run(scriptContent);
    }

    dispose() {
        if (this.disposed) throw Error('Already disposed');
        this.disposed = true;

        removeEventListener('resize', this.onResizeListener);
        this.editor.dispose();
    }
}

