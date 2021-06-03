init();

const appProps = {
  radiusSizes: { s: 20, m: 35, l: 50 },
  imageCache: <ImageBitmap[]>[],
}

function init(): void {

}

function loadInitialImages(imgSrcs: string[]): void {

}

/**
 * append a HTMLImageElement to the image container.
 * @param src image src
 */
function appendImageElemToContainer(src: string): Promise<HTMLImageElement> {
  return new Promise((reject, resolve) => {

  })
}

function createImageEleFromBmp(img: ImageBitmap, classList: string[], callback: (e: MouseEvent) => any) {

}

function createAndCacheBitmap(imgSrc: string, radius: number) {
  return util.createCircleImg(imgSrc, radius)
    .then(image => {
      appProps.imageCache.push(image);
      return appProps.imageCache.length - 1;
    });
}
