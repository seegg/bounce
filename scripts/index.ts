import { init } from "./app";
import { setUpImages } from "./images";
import { modalInit } from "./modal";
import { insertBounceElements } from './add-controls';
setTimeout(() => {
  insertBounceElements();
  setUpImages();
  modalInit();
  init();
}, 1000);


