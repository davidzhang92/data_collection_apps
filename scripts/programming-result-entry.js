document.addEventListener('DOMContentLoaded', function() {
    const deleteBtn = document.getElementById('select-button');
    if (deleteBtn.classList.contains('ph-btn-disabled')) {
      deleteBtn.removeAttribute('href');
      deleteBtn.setAttribute('disabled', true);
    }
  });
  