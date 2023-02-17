
import * as monaco from 'monaco-editor';
import { Remote } from './remote';

const remote = new Remote();

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
    private readonly onResizeListener = () => this.editor.layout();
    private disposed = false;

    constructor(
        container: HTMLElement,
    ) {
        this.editor = monaco.editor.create(container, {
            value: localStorage.getItem('code') ?? exampleProgram,
            language: 'lua',
            theme: 'vs-dark',
            cursorBlinking: 'smooth',

            fontFamily: 'JetBrains Mono',
            fontLigatures: true,
        });

        const model = this.editor.getModel()!;

        model.onDidChangeContent(() => {
            localStorage.setItem('code', model.getValue());
            // TODO: sync indicator.
            // TODO: use a persistent storage method.
        });

        this.editor.addAction({
            id: 'liko-run',
            label: 'Run in LIKO-12',
            keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR,
            ],
            contextMenuGroupId: 'navigation',
            run: async () => {
                await remote.run(model.getValue());
                console.log('Sent script successfully!');
            },
        });

        addEventListener('resize', this.onResizeListener);
    }

    dispose() {
        if (this.disposed) throw Error('Already disposed');
        this.disposed = true;

        removeEventListener('resize', this.onResizeListener);
        this.editor.dispose();
    }
}

