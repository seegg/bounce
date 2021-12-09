const imageUploadModal = {
  modal: document.getElementById('modal'),
  overlay: document.getElementById('modal-overlay'),
  openButton: document.getElementById('image-upload-btn'),
  /** 
   * open/close modal
   */
  toggle: () => {
    imageUploadModal.modal?.classList.toggle('close');
    imageUploadModal.overlay?.classList.toggle('close');
  }
}

/**
 * image upload form for the modal
 */
const imageForm = {
  form: document.getElementById('image-upload-form'),
  okButton: document.getElementById('form-ok-btn'),
  imgFileInput: <HTMLInputElement>document.getElementById('img-file'),
  imgURLInput: <HTMLInputElement>document.getElementById('img-URL'),
  imgFileDisplay: <HTMLInputElement>document.getElementById('file-name'),
  imgFileDisplayButton: <HTMLButtonElement>document.getElementById('upload-button'),
  cancelButton: document.getElementById('form-cancel-btn'),
  handleFileDisplayClick: (evt: Event) => {
    evt.preventDefault();
    imageForm.imgFileInput.click();
  },
  handleFileChange: () => {
    imageForm.imgFileDisplay.value = imageForm.imgFileInput.files?.item(0)?.name || 'No Image Selected';
  },
  handleSubmit: (evt: Event) => {
    evt.preventDefault();
    let imgSrc = ''
    if (imageForm.imgFileInput.files?.item(0)) {
      try {
        imgSrc = URL.createObjectURL(imageForm.imgFileInput.files[0]);
      } catch (e) {
        console.error(e);
      }
    } else {
      imgSrc = imageForm.imgURLInput.value;
    }

    addImage(imgSrc, imageCache, appProps.radiusSizes.current)
      .then(_ => {
        console.log('whatever');
        imageUploadModal.toggle();
      })
      .catch(err => {
        console.log('something');
      })
  },
  handleCancel: (evt: Event) => {
    imageForm.imgURLInput.value = '';
    imageForm.imgFileInput.value = '';
    imageForm.imgFileDisplay.value = '';
    imageUploadModal.toggle();
  }
}

imageUploadModal.overlay?.addEventListener('click', imageUploadModal.toggle);
imageUploadModal.openButton?.addEventListener('click', imageUploadModal.toggle);
imageForm.form?.addEventListener('submit', imageForm.handleSubmit);
imageForm.imgFileDisplayButton.addEventListener('click', imageForm.handleFileDisplayClick);
imageForm.imgFileInput.addEventListener('change', imageForm.handleFileChange);
imageForm.cancelButton?.addEventListener('click', imageForm.handleCancel);
document.addEventListener('keydown',
  function closeModal(evt: KeyboardEvent) {
    if (imageUploadModal.modal?.classList.contains('close')) return;
    if (evt.key === 'Escape') {
      imageUploadModal.toggle();
    }
  })
