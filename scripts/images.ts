const imageList = (function () {

  const imageFiles = <string[]>["me.jpeg", "grumpy.webp", "smileface.webp", "spongebob.webp", "pepper.png"];
  const imageUrls = <string[]>[];
  const path = "images/";

  return imageFiles.map(img => path + img).concat(imageUrls);

})();

//Keeps track of the bitmaps created from imageList and input image url and image files.
let imageCache = <ImageBitmap[]>[];

/**
 * Add an image base on a input url. create a bitmap and HTMLImageElement base on this image.
 * store the bitmap to an array and append the img element to the img container.
 * @param imgSrc URL for the image
 * @param imgArr Array to store the bmp created base on the image url
 * @param radius The radius of the bitmap 
 * @param callback event handler for click event on the img element
 */
function addImage(
  imgSrc: string,
  imgArr: ImageBitmap[],
  radius: number
) {
  // const classList = ['img-thumb', 'rounded-full', 'filter', 'object-contain', 'h-12', 'w-12', 'filter', 'grayscale'];
  const classList = ['img-thumb', 'grayscale'];
  const imgContainer = document.getElementById('img-container');
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
function appendImgElemToContainer(imgEle: HTMLImageElement, imgContainer: HTMLElement, loadingImg?: HTMLImageElement): void {
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
function createImgEleWithIndex(
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
function toggleSelectedImgElement(imgEle: HTMLImageElement) {
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

function scrollToImgElement(imgEle: HTMLImageElement) {
  const container = document.getElementById('img-container')!;
  const scrollDistance = imgEle.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
  container.scroll(0, scrollDistance);
}
