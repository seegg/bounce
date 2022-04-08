import { appProps } from "./app";
import { util } from "./utility";
export const imageList = (function () {

  const imageFiles = <string[]>["me.jpeg", "grumpy.webp", "smileface.webp", "spongebob.webp", "pepper.png"];
  const imageUrls = <string[]>[];
  const path = "https://raw.githubusercontent.com/seegg/bounce/main/images/";

  return imageFiles.map(img => path + img).concat(imageUrls);

})();

//image thumbnail container
const container = <HTMLElement>document.getElementById('img-container');

//set up image scroll controls
document.getElementById('ball-scroll-controls')?.addEventListener('pointerdown', imgContainerScrollUpDown);

//Keeps track of the bitmaps created from imageList and input image url and image files.
export let imageCache = <ImageBitmap[]>[];

/**
 * Add an image base on a input url. create a bitmap and HTMLImageElement base on this image.
 * store the bitmap to an array and append the img element to the img container.
 * @param imgSrc URL for the image
 * @param imgArr Array to store the bmp created base on the image url
 * @param radius The radius of the bitmap 
 * @param imgContainer The HTMLElement containing the image selection.
 * @param callback event handler for click event on the img element
 */
export function addImage(
  imgSrc: string,
  imgArr: ImageBitmap[],
  radius: number,
  imgContainer: HTMLElement = container
) {
  // const classList = ['img-thumb', 'rounded-full', 'filter', 'object-contain', 'h-12', 'w-12', 'filter', 'grayscale'];
  const classList = ['img-thumb', 'grayscale'];
  // const imgContainer = document.getElementById('img-container');
  const loadingPlaceholder = document.createElement('img');
  loadingPlaceholder.classList.add('img-thumb');
  loadingPlaceholder.src = 'images/spinner.gif';
  imgContainer?.appendChild(loadingPlaceholder);
  return util.createCircleImg(imgSrc, radius)
    .then(bitmapImg => {
      const index = imgArr.push(bitmapImg) - 1;
      return createImgEleWithIndex(imgSrc, index, classList)
    })
    .then(imgEle => {
      if (imgContainer === null) throw new Error('image container is null');
      appendImgElemToContainer(imgEle, imgContainer, loadingPlaceholder);
    })
    .catch(err => {
      imgContainer?.removeChild(loadingPlaceholder);
      console.error(err);
    })
}

/**
 * Append a HTMLImageELement to a parent container
 * optional loading placeholder.
 */
export function appendImgElemToContainer(imgEle: HTMLImageElement, imgContainer: HTMLElement, loadingImg?: HTMLImageElement): void {
  if (loadingImg) {
    imgContainer.replaceChild(imgEle, loadingImg);
  } else {
    imgContainer.append(imgEle);
  }
}

/**
 *create a new HTMLImageElement with a src and a list of classes.
 *assign an index number from the bitmap image array associated with 
 *the src.
 */
export function createImgEleWithIndex(
  src: string,
  imgIndex: number,
  classList: string[]
): HTMLImageElement {
  const imgEle = document.createElement('img');
  imgEle.classList.add(...classList);
  imgEle.onclick = ({ target }) => { toggleSelectedImgElement(<HTMLImageElement>target) };
  imgEle.setAttribute('data-index', imgIndex + '');
  imgEle.onload = () => {
    URL.revokeObjectURL(src);
  }
  imgEle.src = src;
  return imgEle;
}

/**
 * Toggle/Select the img elements 
 * in the img container
 */
export function toggleSelectedImgElement(imgEle: HTMLImageElement) {
  const grayscale = 'grayscale';
  appProps.selectedImgEle?.classList.toggle(grayscale);
  if (imgEle === appProps.selectedImgEle) {
    appProps.selectedImgEle = null;
  } else {
    imgEle.classList.toggle(grayscale);
    appProps.selectedImgEle = imgEle;
  }
  scrollToImgElement(imgEle);
}

export function scrollToImgElement(imgEle: HTMLImageElement) {
  const container = document.getElementById('img-container')!;
  const scrollDistance = imgEle.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
  container.scroll(0, scrollDistance);
}

export function imgContainerScrollUpDown(evt: Event, imgContainer: HTMLElement = container, imgThumbnailSize: number = 48) {
  evt.preventDefault();

  /**
   * Get the mod of the scroll position against the thumbnail size.
   * On scroll up, set the scroll position to the current position minus the thumbnail size
   * and minus any remainders from the mod operation.
   * On scroll down, add thumbnail size to the current position and then
   * minus the remainder from the new position.
   * The remainder helps to line up image thumbnails in the image container.
   */
  const remainder = imgContainer.scrollTop % imgThumbnailSize;
  switch ((<HTMLElement>evt.target).id) {
    case 'img-up':
      imgContainer.scroll(0, remainder === 0 ? imgContainer.scrollTop - imgThumbnailSize : imgContainer.scrollTop - remainder)
      break;
    case 'img-down':
      imgContainer.scroll(0, imgContainer.scrollTop + imgThumbnailSize - remainder)
      break;
  }
}
