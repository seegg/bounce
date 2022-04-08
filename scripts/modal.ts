import { appProps } from "./app";
import { addImage, imageCache } from "./images";



export const modalInit = () => {

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
  //close modal on esc
  document.addEventListener('keydown',
    function closeModal(evt: KeyboardEvent) {
      if (imageUploadModal.modal?.classList.contains('close')) return;
      if (evt.key === 'Escape') {
        imageUploadModal.toggle();
      }
    })
}

export const addModal = () => {
  const modalHtml =
    '<form id="image-upload-form" class="upload-form">' +
    '<h2 class="-bounce-title">Upload Image</h2>' +
    '<input class="bounce-input" hidden type="file" id="img-file" name="imgFile" accept="image/*">' +

    '<section class="img-upload">' +
    '<label for="fileName" class="font-bold">Image File:</label>' +
    '<section class="img-file-display">' +
    '<input class="bounce-input" readonly type="text" name="fileName" placeholder="No file selected"' +
    'id="file-name">' +
    '<button type="button" class="btn-file bounce-button" id="upload-button">Select Image</button>' +
    '</section>' +
    '</section>' +

    '<section class="img-upload">' +
    '<label for="imgUrl" class="font-bold">Image URL:</label>' +
    '<section>' +
    '<input class="bounce-input" type="text" name="imgURL" id="img-URL" placeholder="Image URL">' +
    '</section>' +
    '</section>' +

    '<section class="upload-controls">' +
    '<button type="submit" class="mx-1 bounce-button btn-ctrl" id="form-ok-btn"><span class="material-icons">' +
    'check</span></button>' +
    '<button type="button" class="mx-1 bounce-button btn-ctrl" id="form-cancel-btn"><span class="material-icons">' +
    'close</span></button>' +
    '</section>' +
    '</form>';

  const modalOverlay = document.createElement('div');
  modalOverlay.innerHTML = '<div class="modal-overlay close" id="modal-overlay"></div>';

  const modalElement = document.createElement('section');
  modalElement.id = 'modal';
  modalElement.classList.add('upload-modal', 'close');
  modalElement.innerHTML = modalHtml;

  const modalFragment = new DocumentFragment();
  modalFragment.append(modalElement, modalOverlay);
  return modalFragment;
}