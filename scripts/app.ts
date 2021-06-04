const appProps = {
  radiusSizes: { s: 20, m: 35, l: 50 },
  imageCache: <ImageBitmap[]>[],
}

init();

type mouseClickCallback = (e: MouseEvent) => any;

function init(): void {
  const imageLink = 'images/me.jpeg';
  addImage(imageLink, appProps.imageCache, appProps.radiusSizes.l, () => { console.log('hello world') });
}

function loadInitialImages(imgSrcs: string[]): void {

}

function addImage(imgSrc: string, imgArr: ImageBitmap[], radius: number, callback?: mouseClickCallback) {
  const classList = ['img-thumb', 'h-12', 'w-12', 'rounded-full', 'filter', 'grayscale'];
  const imgContainer = document.getElementById('img-container');
  const loadingPlaceholder = document.createElement('img');
  loadingPlaceholder.src = 'images/spinner.gif';
  imgContainer?.appendChild(loadingPlaceholder);
  return createAndCacheBitmap(imgSrc, imgArr, radius)
    .then(([img, imgIdx]) => {
      return createImageEleFromBmp(img, imgIdx, classList, callback)
    })
    .then(imgEle => {
      if (imgContainer === null) throw new Error('image container is null');
      appendImageElemToContainer(imgEle, imgContainer, loadingPlaceholder);
    })
}

/**
 * append a HTMLImageElement to the image container.
 * @param src image src
 */
function appendImageElemToContainer(imgEle: HTMLImageElement, imgContainer: HTMLElement, loadingImg?: HTMLImageElement): void {
  if (loadingImg) {
    imgContainer.replaceChild(imgEle, loadingImg);
  } else {
    imgContainer.append(imgEle);
  }
}


/**
 * Convert bitmap into blob as image/png mime type and 
 * use that as the src for the img element
 * @param bmpImg bitmap
 * @param imgArrIndex the index of the image in the image array
 * @param classList the classes for the element as an array of strings
 * @param callback event handler for onclick
 */
async function createImageEleFromBmp(bmpImg: ImageBitmap, imgArrIndex: number, classList: string[], callback?: mouseClickCallback) {
  return util.convertBmpToBlob(bmpImg)
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const imgEle = document.createElement('img');
      imgEle.classList.add(...classList);
      imgEle.onclick = callback ? callback : null;
      imgEle.setAttribute('data-index', imgArrIndex + '');
      imgEle.onload = () => {
        URL.revokeObjectURL(url);
      }
      imgEle.src = url;
      return imgEle;
    })
}

function createAndCacheBitmap(imgSrc: string, imgArr: ImageBitmap[], radius: number): Promise<[ImageBitmap, number]> {
  return util.createCircleImg(imgSrc, radius)
    .then(image => {
      console.log(image);
      imgArr.push(image);
      return [image, imgArr.length - 1];
    });
}
