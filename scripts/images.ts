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
  callback: MouseClickCallback | null = null,
  radius: number
) {
  const classList = ['img-thumb', 'rounded-full', 'filter', 'object-contain', 'h-12', 'w-12', 'filter', 'grayscale'];
  const imgContainer = document.getElementById('img-container');
  const loadingPlaceholder = document.createElement('img');
  loadingPlaceholder.classList.add('h-12', 'w-12');
  loadingPlaceholder.src = 'images/spinner.gif';
  imgContainer?.appendChild(loadingPlaceholder);
  return createAndCacheBitmap(imgSrc, imgArr, radius)
    .then(([img, imgIdx]) => {
      return createImgEleWithIndex(imgSrc, imgIdx, classList, callback)
    })
    .then(imgEle => {
      if (imgContainer === null) throw new Error('image container is null');
      appendImgElemToContainer(imgEle, imgContainer, loadingPlaceholder);
    })
    .catch(err => {
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
 *create a new img element with a given src and a list of classes.
 *assign an index number from the bitmap image array associated with 
 *the src.
 */
function createImgEleWithIndex(
  src: string,
  imgIndex: number,
  classList: string[],
  callback?: MouseClickCallback | null
): HTMLImageElement {
  const imgEle = document.createElement('img');
  imgEle.classList.add(...classList);
  imgEle.onclick = callback ? callback : null;
  imgEle.setAttribute('data-index', imgIndex + '');
  imgEle.onload = () => {
    URL.revokeObjectURL(src);
  }
  imgEle.src = src;
  return imgEle;
}