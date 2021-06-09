const appProps = {
  radiusSizes: { s: 20, m: 35, l: 50, current: 50 },
  screenBreakPoints: { l: 1280, m: 768 },
  imageCache: <ImageBitmap[]>[],
  balls: <Ball[]>[],
  selectedImgEle: <HTMLImageElement | null>null,
  selectedBalls: <Ball[]>[],
  previousTime: 0,
  deceleration: 1.05,
  canvas: <HTMLCanvasElement>document.getElementById('canvas'),
  canvasHorizontalGap: 5 * 2,
  canvasTopOffset: 70,
  currentPos: { x: 0, y: 0 },
  party: { active: false, start: 0, duration: 10, colour: '' },
  rainBow: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
}

start();

type mouseClickCallback = (e: MouseEvent) => any;

function start(): void {
  addEventListeners();
  //set initial canvas dimensions
  appProps.canvas.width = window.innerWidth - appProps.canvasHorizontalGap;
  appProps.canvas.height = window.innerHeight - appProps.canvasTopOffset;
  //Load all the images in the image list
  Promise.all(getImageList().map(img => addImage(img, appProps.imageCache, (evt) => { toggleImgElement(evt.target as HTMLImageElement) }, 50)))
    .then(_ => {
      draw(appProps.canvas.getContext('2d')!);
    });
}

/**
 * Add an image base on a input url. create a bitmap and HTMLImageElement base on this image.
 * store the bitmap to an array and append the img element to the img container.
 * @param imgSrc URL for the image
 * @param imgArr Array to store the bmp created base on the image url
 * @param radius The radius of the bitmap 
 * @param callback event handler for click event on the img element
 */
function addImage(imgSrc: string, imgArr: ImageBitmap[], callback: mouseClickCallback | null = null, radius: number = appProps.radiusSizes.current) {
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
function createImgEleWithIndex(src: string, imgIndex: number, classList: string[], callback?: mouseClickCallback | null): HTMLImageElement {
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

/** 
 * Create a bitmap image from a URL and add it to the bitmap array.
 */
function createAndCacheBitmap(imgSrc: string, imgArr: ImageBitmap[], radius: number): Promise<[ImageBitmap, number]> {
  return util.createCircleImg(imgSrc, radius)
    .then(image => {
      imgArr.push(image);
      return [image, imgArr.length - 1];
    })
}

function addEventListeners(): void {
  window.onresize = () => {
    handleWindowResize();
  };
  appProps.canvas.addEventListener('pointerdown', onMouseDown)
}

/**
 * Change the canvas dimensions and the ball radius sizes
 * everytime the browser is resized.
 */
function handleWindowResize(): void {
  try {
    if (appProps.canvas === null) throw new Error('canvas is null');
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width < appProps.screenBreakPoints.m) {
      appProps.radiusSizes.current = appProps.radiusSizes.s;
    } else if (width < appProps.screenBreakPoints.l) {
      appProps.radiusSizes.current = appProps.radiusSizes.m;
    } else {
      appProps.radiusSizes.current = appProps.radiusSizes.l;
    }

    appProps.canvas.width = width - appProps.canvasHorizontalGap;
    appProps.canvas.height = height - appProps.canvasTopOffset;

    appProps.balls.forEach(ball => ball.radius = appProps.radiusSizes.current);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Remove the selected ball from the ball array
 */
function removeBall(ballToDelete: Ball) {
  try {
    const index = appProps.balls.findIndex(ball => ball.id === ballToDelete.id);
    if (index === -1) {
      throw new Error(`ball of id:${ballToDelete.id} could not be found.`);
    } else {
      appProps.balls.splice(index, 1);
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * Draw each frame
 */
function draw(ctx: CanvasRenderingContext2D) {
  // ctx.drawImage(appProps.balls[0].img, appProps.balls[0].position.x, appProps.balls[0].position.y, 100, 100);
  appProps.balls.forEach(ball => {
    drawBall(ctx, ball);
  })
  window.requestAnimationFrame(() => { draw(ctx) });
}

/**
 * Draw an individual ball.
 */
function drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
  const { position, radius, selected, rotation, img } = ball;
  ctx.save();
  ctx.translate(position.x, position.y);
  ctx.rotate(Math.PI / 180 * rotation);
  ctx.drawImage(img, -radius, -radius, radius * 2, radius * 2);

  // ctx.translate(-position.x, -position.y);
  ctx.restore();
}

/**
 * Get the position of the mouse click 
 * relative to the event target 
 */
function getRelativeMousePos(evt: MouseEvent): [number, number] {
  const boundingRect = (<HTMLElement>evt.target).getBoundingClientRect();
  return [evt.clientX - boundingRect.x, evt.clientY - boundingRect.y];
}

/**
 * Toggle/Select the img elements 
 * in the img container
 */
function toggleImgElement(imgEle: HTMLImageElement) {
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

/**
 * Scroll to the selected img element in the container.
 */
function scrollToImgElement(imgEle: HTMLImageElement) {
  const container = document.getElementById('img-container')!;
  const scrollDistance = imgEle.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
  container.scroll(0, scrollDistance);
}

//
// Mouse Controls for canvas
//

function onMouseDown(evt: MouseEvent) {
  if (evt.button !== 0) return; //right click
  const [x, y] = getRelativeMousePos(evt);
  if (appProps.selectedImgEle) {
    try {
      const imgIndex = Number(appProps.selectedImgEle.dataset['index']);
      const ball = new Ball(appProps.imageCache[imgIndex], x, y, appProps.radiusSizes.current, false);
      appProps.balls.push(ball);
    } catch (err) {
      console.log(err);
    }
  } else {

  }
}

function onMouseUp(evt: MouseEvent) {
}

function onMouseMove(evt: MouseEvent) {
}

function onMouseLeave(evt: MouseEvent) {
}