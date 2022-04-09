import { init } from "./app";
import { setUpImages } from "./images";
import { modalInit } from "./modal";
import { insertBounceElements } from './add-controls';

function setUp() {
  insertBounceElements();
  setUpImages();
  modalInit();
  init();
}

// setTimeout(() => {
//   setUp();
// }, 1000);

setUp();



