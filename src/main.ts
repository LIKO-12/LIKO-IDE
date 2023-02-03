import './styles.css';
import * as monaco from 'monaco-editor';

console.log('Hello from TypeScript!');

const editorContainer = document.createElement('div');
editorContainer.style.height = '100%';
document.body.append(editorContainer);

const exampleProgram = `
print("Hello from game.lua");

liko.graphics.clear();

local rectX, rectY = 5, 5;
local rectColor = 0;

local movementSpeed = 64;

function _draw()
    liko.graphics.rectangle(rectX, rectY, 10, 10, true, rectColor)
    liko.graphics.rectangle(rectX, rectY, 10, 10, false, rectColor + 8)
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
    if key == 'x' then liko.graphics.clear() end
end
`;

monaco.editor.create(editorContainer, {
    value: exampleProgram,
    language: 'lua',
    theme: 'vs-dark',
});


