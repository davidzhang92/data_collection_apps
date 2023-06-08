// fail/pass button function

document.addEventListener('DOMContentLoaded', function() {
  const deleteBtn = document.getElementById('select-button');
  if (deleteBtn.classList.contains('ph-btn-disabled')) {
    deleteBtn.removeAttribute('href');
    deleteBtn.setAttribute('disabled', true);
  }

var passButton = document.getElementById('pass-button');
var failButton = document.getElementById('fail-button');
var inputResult = document.getElementById('input-result');

passButton.addEventListener('click', function(e) {
  e.preventDefault();
  inputResult.textContent = 'PASS';
  inputResult.style.color = '#00ff2a';
});

failButton.addEventListener('click', function(e) {
  e.preventDefault();
  inputResult.textContent = 'FAIL';
  inputResult.style.color = '#ff0000';
});
});


const example = document.getElementById ('bluetooth-checkbox')
console.log (example);