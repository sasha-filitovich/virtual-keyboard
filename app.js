import obj from './object.js';

document.body.innerHTML = `
<h1>RSS Виртуальная клавиатура</h1>
<div class="container">
  <textarea class="textarea" rows="12"></textarea>
  <div class="keyboard"></div>
</div>`;
const keyboard = document.querySelector('.keyboard');
// формирование кнопок в html
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
const capsBtn = document.querySelector('.CapsLock');
let lang = 'en';
let caps = false;
let ctrl = false;
let alt = false;
// функция проверки буква ли это
const isLetter = (el) => {
  const arr = el.className.split(' ');
  const key = arr[arr.length - 1].slice(0, -1);
  return key === 'Key';
};
// функция проверки специальных символов
const isSpecial = (el) => {
  const arr = ['[', ']', ';', "'", ',', '.', '/', 'х', 'ъ', 'ж', 'э', 'б', 'ю', 'ё', '`'];
  return arr.some((item) => el.innerText === item || el.innerText === item.toUpperCase());
};
// функция смены размера буквы
const changeValueBtn = (el) => {
  if (caps === false) {
    el.innerText = el.textContent.toUpperCase();
  } else {
    el.innerText = el.textContent.toLowerCase();
  }
};
// функция нажатия на Caps
const pressCaps = () => {
  btn.forEach((el) => {
    if (isLetter(el) || isSpecial(el)) {
      changeValueBtn(el);
    }
  });
  caps = !caps;
  if (caps) {
    capsBtn.classList.add('active');
  } else {
    capsBtn.classList.remove('active');
  }
};
// функция нажатия на Shift
const pressShift = () => {
  btn.forEach((el) => {
    if (isLetter(el) || isSpecial(el)) {
      changeValueBtn(el);
    }
  });
  obj.forEach((item) => {
    if (item.alter !== undefined) {
      btn.forEach((el) => {
        if (el.innerText === item.en) {
          el.innerHTML = item.alter;
        }
      });
    }
  });
  caps = !caps;
};
// функция отжатия Shift
const upShift = () => {
  btn.forEach((el) => {
    if (isLetter(el) || isSpecial(el)) {
      changeValueBtn(el);
    }
  });
  obj.forEach((item) => {
    btn.forEach((el) => {
      if (el.innerText === item.alter) {
        el.innerHTML = item.en;
      }
    });
  });
  caps = !caps;
};
// функция смены языка
const changeLang = () => {
  lang = lang === 'en' ? 'ru' : 'en';
  for (let i = 0; i < btn.length; i += 1) {
    btn[i].textContent = obj[i][lang];
    if (caps === true && (isLetter(btn[i]) || isSpecial(btn[i]))) {
      btn[i].innerText = btn[i].textContent.toUpperCase();
    }
  }
};
// mousedown на кнопки клавиатуры на экране
btn.forEach((x) => {
  x.addEventListener('mousedown', () => {
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
    if (x.classList.contains('CapsLock')) {
      pressCaps();
    }
    if (x.classList.contains('ShiftLeft') || x.classList.contains('ShiftRight')) {
      pressShift();
    }
    if (x.classList.contains('ControlLeft')) {
      changeLang();
    }
  });
  // отжатие кнопки shift на экране
  x.addEventListener('mouseup', () => {
    if (x.classList.contains('ShiftLeft') || x.classList.contains('ShiftRight')) {
      upShift();
    }
  });
});
// нажатие на клавиши на физической клавиатуре
document.addEventListener('keydown', (event) => {
  textarea.focus();
  btn.forEach((el) => {
    if (el.classList.contains(event.code)) {
      if (isLetter(el) || isSpecial(el)) {
        event.preventDefault();
        textarea.value += el.innerText;
      }
      el.classList.add('active');
    }
  });
  if (event.code === 'CapsLock') {
    pressCaps();
  }
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    if (event.repeat) {
      return;
    }
    pressShift();
  }
  if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
    ctrl = !ctrl;
    if (ctrl && alt) {
      changeLang();
    }
  }
  if (event.code === 'AltLeft' || event.code === 'AltRight') {
    alt = !alt;
    if (ctrl && alt) {
      changeLang();
    }
  }
});
// отжатие клавиш на физической клавиатуре
document.addEventListener('keyup', (event) => {
  btn.forEach((el) => {
    if (!el.classList.contains('CapsLock')) {
      el.classList.remove('active');
    }
  });
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    upShift();
  }
  if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
    ctrl = !ctrl;
  }
  if (event.code === 'AltLeft' || event.code === 'AltRight') {
    alt = !alt;
  }
});
