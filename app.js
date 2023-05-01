import obj from './object.js';

document.body.innerHTML = `
<h1>RSS Виртуальная клавиатура</h1>
<div class="container">
  <textarea class="textarea" rows="12"></textarea>
  <div class="keyboard"></div>
</div>`;
const keyboard = document.querySelector('.keyboard');
let lang = 'en';
// получение языка из local storage
if (localStorage.getItem('lang')) {
  lang = localStorage.getItem('lang');
}
// формирование кнопок в html
function createBtn(num) {
  const newBtn = document.createElement('div');
  newBtn.className = obj[num].className;
  newBtn.textContent = obj[num][lang];
  keyboard.append(newBtn);
}
for (let i = 0; i < obj.length; i += 1) {
  createBtn(i);
}
//
const description = document.createElement('p');
description.textContent = 'Клавиатура создана в операционной системе Windows';
document.body.append(description);
const language = document.createElement('p');
language.textContent = 'Для переключения языка на физической клавиатуре комбинация: ctrl + alt';
document.body.append(language);
const language2 = document.createElement('p');
language2.textContent = 'Для переключения языка на виртуальной клавиатуре: левый ctrl';
document.body.append(language2);
const textarea = document.querySelector('.textarea');
const buttons = document.querySelectorAll('.btn');
const capsBtn = document.querySelector('.CapsLock');
let caps = false;
let ctrl = false;
let alt = false;
// функция проверки буква ли это
const isLetter = (el) => {
  const classes = el.className.split(' ');
  const key = classes[classes.length - 1].slice(0, -1);
  return key === 'Key';
};
// функция проверки специальных символов
const isSpecial = (el) => {
  const specials = ['[', ']', ';', "'", ',', '.', '/', 'х', 'ъ', 'ж', 'э', 'б', 'ю', 'ё', '`'];
  return specials.some((item) => el.innerText === item || el.innerText === item.toUpperCase());
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
  buttons.forEach((el) => {
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
  buttons.forEach((el, index) => {
    if (isLetter(el) || isSpecial(el)) {
      changeValueBtn(el);
    }
    if (obj[index].alter !== undefined && el.innerText === obj[index].en) {
      el.innerText = obj[index].alter;
    }
    if (lang === 'ru' && el.innerText === '.') {
      el.innerText = ',';
    }
  });
  caps = !caps;
};
// функция отжатия Shift
const upShift = () => {
  buttons.forEach((el, index) => {
    if (isLetter(el) || isSpecial(el)) {
      changeValueBtn(el);
    }
    if (el.innerText === obj[index].alter) {
      el.innerText = obj[index][lang];
    }
    if (lang === 'ru' && el.innerText === ',') {
      el.innerText = '.';
    }
  });
  caps = !caps;
};
// функция смены языка
const changeLang = () => {
  lang = lang === 'en' ? 'ru' : 'en';
  for (let i = 0; i < buttons.length; i += 1) {
    buttons[i].textContent = obj[i][lang];
    if (caps === true && (isLetter(buttons[i]) || isSpecial(buttons[i]))) {
      buttons[i].innerText = buttons[i].textContent.toUpperCase();
    }
  }
};
// mousedown на кнопки клавиатуры на экране
buttons.forEach((x) => {
  x.addEventListener('mousedown', () => {
    const caret = textarea.selectionStart;
    const beforeCaret = textarea.value.substring(0, caret);
    const afterCaret = textarea.value.substring(textarea.selectionEnd);
    setTimeout(() => {
      textarea.focus();
    }, 0);
    // функция установки курсора
    const caretRight = () => {
      textarea.selectionStart = caret + 1;
      textarea.selectionEnd = caret + 1;
    };
    // функция установки курсора
    const setCaret = () => {
      textarea.selectionStart = caret;
      textarea.selectionEnd = caret;
    };
    if (x.textContent.length === 1 && x.textContent.charCodeAt(0) < 9654) {
      textarea.value = beforeCaret + x.innerText + afterCaret;
      caretRight();
    }
    if (x.innerText === 'Backspace') {
      if (caret !== textarea.selectionEnd) {
        textarea.value = beforeCaret + afterCaret;
        setCaret();
      } else {
        textarea.value = beforeCaret.slice(0, -1) + afterCaret;
        textarea.selectionStart = caret - 1;
        textarea.selectionEnd = caret - 1;
      }
    }
    if (x.innerText === 'Del') {
      if (caret !== textarea.selectionEnd) {
        textarea.value = beforeCaret + afterCaret;
        setCaret();
      } else {
        textarea.value = beforeCaret + afterCaret.slice(1);
        setCaret();
      }
    }
    if (x.classList.contains('Space')) {
      textarea.value = `${beforeCaret} ${afterCaret}`;
      caretRight();
    }
    if (x.classList.contains('Tab')) {
      textarea.value = `${beforeCaret}\t${afterCaret}`;
      caretRight();
    }
    if (x.classList.contains('Enter')) {
      textarea.value = `${beforeCaret}\n${afterCaret}`;
      caretRight();
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
    if (x.classList.contains('ArrowRight')) {
      caretRight();
    }
    if (x.classList.contains('ArrowLeft')) {
      textarea.selectionStart = caret - 1;
      textarea.selectionEnd = caret - 1;
    }
    if (x.classList.contains('ArrowDown')) {
      textarea.value = beforeCaret + x.innerText + afterCaret;
      caretRight();
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
  const caret = textarea.selectionStart;
  const afterCaret = textarea.value.substring(textarea.selectionEnd);
  buttons.forEach((el) => {
    if (el.classList.contains(event.code)) {
      if (isLetter(el) || isSpecial(el)) {
        event.preventDefault();
        textarea.value = textarea.value.substring(0, caret) + el.innerText + afterCaret;
        textarea.selectionStart = caret + 1;
        textarea.selectionEnd = caret + 1;
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
  if (event.code === 'MetaLeft') {
    event.preventDefault();
  }
});
// отжатие клавиш на физической клавиатуре
document.addEventListener('keyup', (event) => {
  buttons.forEach((el) => {
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
// сохранение в local storage
const setLocalStorage = () => {
  localStorage.setItem('lang', lang);
};
window.addEventListener('beforeunload', setLocalStorage);
