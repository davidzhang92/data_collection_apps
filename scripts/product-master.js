document.addEventListener('DOMContentLoaded', function() {
    const deleteBtn = document.getElementById('delete-selected-row');
    if (deleteBtn.classList.contains('ph-btn-disabled')) {
      deleteBtn.removeAttribute('href');
      deleteBtn.setAttribute('disabled', true);
    }
  });
  