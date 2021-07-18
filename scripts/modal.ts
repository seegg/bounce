const imageUploadModal = {
  modal: document.getElementById('modal'),
  overlay: document.getElementById('modal-overlay'),
  openButton: document.getElementById('image-upload-btn'),
}

const uploadForm = {
  form: document.getElementById('image-upload-form'),
  okButton: document.getElementById('form-ok-btn'),
  cancelButton: document.getElementById('form-cancel-btn')
}

/**
 * Toggle modal open and close.
 */
function toggleModal(e: PointerEvent | MouseEvent): void {
  e.preventDefault();
  imageUploadModal.modal?.classList.toggle('close');
  imageUploadModal.overlay?.classList.toggle('close');
}

function handleFormSubmit(evt: Event) {
  evt.preventDefault();
  const imgFileInputElement = <HTMLInputElement>document.getElementById('img-file');
  const imgURLInputElement = <HTMLInputElement>document.getElementById('img-URL');
  let imgSrc: string;
  if (imgFileInputElement.files?.item(0)) {
    console.log(imgFileInputElement.files);
    imgSrc = URL.createObjectURL(imgFileInputElement.files[0]);
  } else {
    imgSrc = imgURLInputElement.value;
  }
  return addImage(imgSrc, imageCache, appProps.radiusSizes.current);
}

imageUploadModal.overlay?.addEventListener('pointerdown', toggleModal);
imageUploadModal.openButton?.addEventListener('click', toggleModal);
uploadForm.form?.addEventListener('submit', handleFormSubmit);
