const imageUploadModal = {
  modal: document.getElementById('modal'),
  overlay: document.getElementById('modal-overlay'),
  openButton: document.getElementById('image-upload-btn'),
}

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
  handleFileInputChange: () => {
    imageForm.imgFileDisplay.value = imageForm.imgFileInput.files?.item(0)?.name || 'No Image Selected';
  }
}


/**
 * open/close
 */
function toggleModal(e: PointerEvent | MouseEvent): void {
  e.preventDefault();
  imageUploadModal.modal?.classList.toggle('close');
  imageUploadModal.overlay?.classList.toggle('close');
}

function handleFormSubmit(evt: Event) {
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
  return addImage(imgSrc, imageCache, appProps.radiusSizes.current);
}

imageUploadModal.overlay?.addEventListener('pointerdown', toggleModal);
imageUploadModal.openButton?.addEventListener('click', toggleModal);
imageForm.form?.addEventListener('submit', handleFormSubmit);
imageForm.imgFileDisplayButton.addEventListener('click', imageForm.handleFileDisplayClick);
imageForm.imgFileInput.addEventListener('change', imageForm.handleFileInputChange);

