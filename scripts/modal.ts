const imageUploadModal = {
  modal: document.getElementById('modal'),
  overlay: document.getElementById('modal-overlay'),
  openButton: document.getElementById('image-upload-btn'),
}

function toggleModal(e: PointerEvent | MouseEvent): void {
  e.preventDefault();
  imageUploadModal.modal?.classList.toggle('close');
  imageUploadModal.overlay?.classList.toggle('close');
}

imageUploadModal.overlay?.addEventListener('pointerdown', (event) => { toggleModal(event) });
imageUploadModal.openButton?.addEventListener('click', (event) => { toggleModal(event) });

