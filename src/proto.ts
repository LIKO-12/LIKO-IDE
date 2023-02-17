
const c = document.createElement('div');
c.className = 'panels-container';
document.body.append(c);

const e1 = document.createElement('div');
e1.className = 'left-panel';
c.append(e1);

const e2 = document.createElement('div');
e2.className = 'right-panel';
c.append(e2);

const sb = document.createElement('div');
sb.className = 'status-bar';
document.body.append(sb);