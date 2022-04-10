import { init } from "./app";
import { setUpImages } from "./images";
import { modalInit } from "./modal";
import { insertBounceElements } from './add-controls';

function setUp() {

  if (document.querySelector('.intro')) {
    setTimeout(() => {
      insertBounceElements();
      setUpImages();
      modalInit();
      init();
    }, 1000);

  } else {
    insertBounceElements();
    setUpImages();
    modalInit();
    init();
  }
}

setUp();



