import obj from './object.js';

document.body.innerHTML = `
<h1>RSS Виртуальная клавиатура</h1>
<div class="container">
  <textarea class="textarea" rows="12" cols="60"></textarea>
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
