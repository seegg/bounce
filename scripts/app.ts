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
 * 
 * @param imgSrc URL for the image
 * @param imgArr Array to store the bmp created base on the image url.
 * @param radius The radius of the bitmap 
 * @param callback 
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

function createImgEleWithIndex(src: string, imgIndex: number, classList: string[], callback?: mouseClickCallback) {
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

function createAndCacheBitmap(imgSrc: string, imgArr: ImageBitmap[], radius: number): Promise<[ImageBitmap, number]> {
  return util.createCircleImg(imgSrc, radius)
    .then(image => {
      console.log(image);
      imgArr.push(image);
      return [image, imgArr.length - 1];
    })
}
