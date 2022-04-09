import { addModal } from "./modal";
const controlHtml =
  '<section id="app-controls" class="controls">' +
  '<!-- Thumbnail container -->' +
  '<section id="ball-select" class="balls-container">' +
  '<section id="ball-scroll-controls" class="btn-scroll-container">' +
  '<button id="img-up" class="btn-scroll bounce-button">&#9650;</button>' +
  '<button id="img-down" class="btn-scroll bounce-button">&#9660;</button>' +
  '</section>' +
  '<section id="bounce-img-container" class="bounce-img-container"></section>' +
  '</section>' +
  '<!-- Button controls -->' +
  '<section id="button-controls" class="btn-container">' +
  '<button id="image-upload-btn" class="btn-ctrl bounce-button">' +
  '<span class="material-icons">add_photo_alternate</span></button>' +
  '<button id="party-btn" class="btn-ctrl bounce-button">' +
  '<span class="material-icons">celebration</span></button>' +
  '<button id="gravity-btn" class="btn-ctrl btn-gravity bounce-button">G</button>' +
  '</section>' +
  '</section>';

const canvasHtml =
  '<canvas id="canvas" class="bounce-canvas">' +
  "Your browser doesn't support canvas." +
  '</canvas>';

export const insertBounceElements = () => {
  const container = document.querySelector('.bounce-app') || document.querySelector('.intro');
  const controlElement = document.createElement('section');
  controlElement.id = 'bounce';
  controlElement.classList.add('bounce-container');
  controlElement.innerHTML = controlHtml;

  const canvasELement = document.createElement('section');
  canvasELement.classList.add('canvas-container');
  canvasELement.innerHTML = canvasHtml;

  const modal = addModal();
  controlElement.append(canvasELement, modal);

  container?.append(controlElement);
}