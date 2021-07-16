const imageUploadModal = document.getElementById('modal');
const modalOverlay = document.getElementById('modal-overlay');

function toggleModal(e: Event): void {
  imageUploadModal?.classList.toggle('close');
  modalOverlay?.classList.toggle('close');
}

modalOverlay?.addEventListener('pointerdown', (event) => { toggleModal(event) });
