document.addEventListener('DOMContentLoaded', function() {
  const deleteBtn = document.getElementById('delete-selected-row');
  const isDisabled = deleteBtn.getAttribute('disabled') === 'true';

  if (isDisabled) {
    deleteBtn.removeAttribute('href');
    deleteBtn.setAttribute('disabled', true);
    deleteBtn.classList.add('ph-btn-disabled');
  }

  // Add an event listener to the button to toggle the `ph-btn-disabled` class
  deleteBtn.addEventListener('click', function() {
    if (this.getAttribute('disabled') === 'true') {
      this.classList.add('ph-btn-disabled');
    } else {
      this.classList.remove('ph-btn-disabled');
    }
  });
});
