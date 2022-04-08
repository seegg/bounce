import { init } from "./app";
import { setUpImages } from "./images";
import { modalInit } from "./modal";
import { insertBounceElements } from './add-controls';

insertBounceElements();
setUpImages();
modalInit();
init();
