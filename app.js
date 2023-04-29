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
const getLocalStorage = () => {
  if (localStorage.getItem('lang')) {
    lang = localStorage.getItem('lang');
  }
};
getLocalStorage();
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
const textarea = document.querySelector('.textarea');
const btn = document.querySelectorAll('.btn');
const capsBtn = document.querySelector('.CapsLock');
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
          if (lang === 'ru' && el.innerText === '.') {
            el.innerHTML = ',';
          } else {
            el.innerHTML = item.alter;
          }
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
      if (lang === 'ru' && el.innerText === ',') {
        el.innerHTML = '.';
      }
      if (el.innerText === item.alter) {
        el.innerHTML = item[lang];
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
    if (x.textContent.length === 1 && x.textContent.charCodeAt(0) < 9650) {
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
  btn.forEach((el) => {
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
// сохранение в local storage
const setLocalStorage = () => {
  localStorage.setItem('lang', lang);
};
window.addEventListener('beforeunload', setLocalStorage);
