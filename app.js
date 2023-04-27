import obj from './object.js';

document.body.innerHTML = `
<h1>RSS Виртуальная клавиатура</h1>
<div class="container">
  <textarea class="textarea" rows="12"></textarea>
  <div class="keyboard"></div>
</div>`;
const keyboard = document.querySelector('.keyboard');
function createBtn(num) {
  const newBtn = document.createElement('div');
  newBtn.className = obj[num].className;
  newBtn.textContent = obj[num].en;
  keyboard.append(newBtn);
}
for (let i = 0; i < obj.length; i += 1) {
  createBtn(i);
}
const textarea = document.querySelector('.textarea');
const btn = document.querySelectorAll('.btn');
btn.forEach((x) => {
  x.addEventListener('click', () => {
    if (x.textContent.length === 1) {
      textarea.value += x.innerText;
    }
    if (x.innerText === 'Backspace') {
      const arr = textarea.value.split('');
      arr.splice(arr.length - 1, 1);
      textarea.value = arr.join('');
    }
    if (x.classList.contains('Space')) {
      textarea.value += ' ';
    }
    if (x.classList.contains('Tab')) {
      textarea.value += '\t';
    }
    if (x.classList.contains('Enter')) {
      textarea.value += '\n';
    }
  });
});
let caps = false;
const isLetter = (el) => {
  const arr = el.className.split(' ');
  const key = arr[arr.length - 1].slice(0, -1);
  return key === 'Key';
};
document.addEventListener('keydown', (event) => {
  textarea.focus();
  btn.forEach((el) => {
    if (el.classList.contains(event.code)) {
      if (isLetter(el)) {
        event.preventDefault();
        textarea.value += el.innerText;
      }
      el.classList.add('active');
    }
  });
  if (event.code === 'CapsLock') {
    const capsBtn = document.querySelector('.CapsLock');

    // capsBtn.classList.toggle('active');

    btn.forEach((el) => {
      if (isLetter(el)) {
        if (caps === false) {
          el.innerText = el.textContent.toUpperCase();
        } else {
          el.innerText = el.textContent.toLowerCase();
        }
      }
    });
    caps = !caps;
    if (caps) {
      capsBtn.classList.add('active');
    } else {
      capsBtn.classList.remove('active');
    }
  }
});
document.addEventListener('keyup', () => {
  btn.forEach((el) => {
    if (!el.classList.contains('CapsLock')) {
      el.classList.remove('active');
    }
  });
});
