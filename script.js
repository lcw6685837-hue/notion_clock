const FLIP_MS = 600;

function pad(n, len) { return String(n).padStart(len, '0'); }

const GROUPS = [
  { id: 'year', getValue: now => String(now.getFullYear()) },
  { id: 'month', getValue: now => pad(now.getMonth() + 1, 2) },
  { id: 'day', getValue: now => pad(now.getDate(), 2) },
  { id: 'hours', getValue: now => pad(now.getHours(), 2) },
  { id: 'minutes', getValue: now => pad(now.getMinutes(), 2) },
  { id: 'seconds', getValue: now => pad(now.getSeconds(), 2) },
].map(group => ({
  ...group,
  container: document.getElementById(group.id),
  boxes: [],
  prevValue: '',
}));

function buildBoxes(group, value) {
  group.container.innerHTML = '';
  group.boxes = [];
  for (const ch of value) {
    const box = document.createElement('div');
    box.className = 'digit-box';

    const valueEl = document.createElement('span');
    valueEl.className = 'digit-value';
    valueEl.textContent = ch;

    box.appendChild(valueEl);
    group.container.appendChild(box);
    group.boxes.push(box);
  }
  group.prevValue = value;
}

function flipDigit(box, newChar) {
  const valueEl = box.querySelector('.digit-value');
  box.classList.add('flip');

  setTimeout(() => { valueEl.textContent = newChar; }, FLIP_MS / 2);

  box.addEventListener('animationend', function handler() {
    box.classList.remove('flip');
    box.removeEventListener('animationend', handler);
  });
}

function updateGroup(group, value) {
  if (value.length !== group.prevValue.length) {
    buildBoxes(group, value);
    return;
  }
  for (let i = 0; i < value.length; i++) {
    if (value[i] !== group.prevValue[i]) {
      flipDigit(group.boxes[i], value[i]);
    }
  }
  group.prevValue = value;
}

function tick() {
  const now = new Date();
  for (const group of GROUPS) {
    updateGroup(group, group.getValue(now));
  }
}

tick();
setInterval(tick, 1000);
