const appProps = {
  radiusSizes: { s: 20, m: 35, l: 50 },
  imageCache: <ImageBitmap[]>[],
}

start();

type mouseClickCallback = (e: MouseEvent) => any;

function start(): void {
  Promise.all(getImageList().map(img => addImage(img, appProps.imageCache, appProps.radiusSizes.l, () => { console.log('hello world!') })));
}

/**
 * Add an image base on a input url. create a bitmap and HTMLImageElement base on this image.
 * store the bitmap to an array and append the img element to the img container.
 * @param imgSrc URL for the image
 * @param imgArr Array to store the bmp created base on the image url
 * @param radius The radius of the bitmap 
 * @param callback event handler for click event on the img element
 */
function addImage(imgSrc: string, imgArr: ImageBitmap[], radius: number, callback?: mouseClickCallback) {
  const classList = ['img-thumb', 'rounded-full', 'filter', 'object-contain', 'h-12', 'w-12'];
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
      appendImageElemToContainer(imgEle, imgContainer, loadingPlaceholder);
      console.log(imgArr);
    })
    .catch(err => {
      console.log(err);
    })
}

//append an img element to the img container.
function appendImageElemToContainer(imgEle: HTMLImageElement, imgContainer: HTMLElement, loadingImg?: HTMLImageElement): void {
  if (loadingImg) {
    imgContainer.replaceChild(imgEle, loadingImg);
  } else {
    imgContainer.append(imgEle);
  }
}

//create a new img element with a given src and a list of classes.
//assign an index number from the bitmap image array associated with 
//the src.
function createImgEleWithIndex(src: string, imgIndex: number, classList: string[], callback?: mouseClickCallback): HTMLImageElement {
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

//create an bitmap image, add it to the image array
function createAndCacheBitmap(imgSrc: string, imgArr: ImageBitmap[], radius: number): Promise<[ImageBitmap, number]> {
  return util.createCircleImg(imgSrc, radius)
    .then(image => {
      console.log(image);
      imgArr.push(image);
      return [image, imgArr.length - 1];
    })
}
