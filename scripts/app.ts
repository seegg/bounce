const appProps = {
  radiusSizes: { s: 20, m: 35, l: 50, current: 50 },
  screenBreakPoints: { l: 1280, m: 768 },
  imageCache: <ImageBitmap[]>[],
  balls: <Ball[]>[],
  selectedImgEle: <HTMLImageElement | null>null,
  selectedBall: <Ball | null>null,
  selectedPositions: { prev: { x: 0, y: 0 }, current: { x: 0, y: 0 } },
  mouseMoveDistThreshold: 5,
  currentTime: 0,
  selectedTime: 0,
  deceleration: 1.05,
  canvas: <HTMLCanvasElement>document.getElementById('canvas'),
  canvasHorizontalGap: 5 * 2,
  canvasTopOffset: 70,
  party: { active: false, start: 0, duration: 10, colour: '' },
  rainBow: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
}

type mouseClickCallback = (e: MouseEvent) => any;

(function start(): void {
  addEventListeners();
  //set initial canvas dimensions
  appProps.canvas.width = window.innerWidth - appProps.canvasHorizontalGap;
  appProps.canvas.height = window.innerHeight - appProps.canvasTopOffset;
  //Load all the images in the image list
  Promise.all(getImageList().map(img => addImage(img, appProps.imageCache, (evt) => { toggleSelectedImgElement(evt.target as HTMLImageElement) }, 50)))
    .then(_ => {
      draw(appProps.canvas.getContext('2d')!);
    });
})();

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
  callback: mouseClickCallback | null = null,
  radius: number = appProps.radiusSizes.current
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
  callback?: mouseClickCallback | null
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
  appProps.canvas.addEventListener('pointerdown', onMouseDown);
  appProps.canvas.addEventListener('pointermove', onMouseMove);
  appProps.canvas.addEventListener('pointerup', onMouseUp);
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

function createAndCacheBall(
  imgEle: HTMLImageElement,
  x: number,
  y: number,
  radius = appProps.radiusSizes.current,
  selected = false
): Ball | undefined {
  try {
    const imgIndex = Number(imgEle.dataset['index']);
    const ball = new Ball(appProps.imageCache[imgIndex], x, y, radius, selected);
    appProps.balls.push(ball);
    return ball;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Draw each frame
 */
function draw(ctx: CanvasRenderingContext2D) {

  ctx.clearRect(0, 0, appProps.canvas.width, appProps.canvas.height);
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

  if (ball.selected) {
    ctx.lineWidth = 4
    ctx.strokeStyle = 'cyan'
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.stroke()
  }
  // ctx.translate(-position.x, -position.y);
  ctx.restore();
}

/**
 * Get the position of the mouse click 
 * relative to the canvas
 */
function getRelativeMousePos(evt: MouseEvent): [number, number] {
  const boundingRect = (<HTMLElement>evt.target).getBoundingClientRect();
  return [evt.clientX - boundingRect.x, evt.clientY - boundingRect.y];
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

/**
 * Calculate the updated velocity for the selected ball in
 * mousemove events.
 * @param current X or Y component of velocity for a ball
 * @param distance distance moved
 */
function calVelocityComponent(current: number, distance: number): [number, boolean] {
  let reset = false;
  let velocity = distance;
  if (Math.abs(distance) <= appProps.mouseMoveDistThreshold) return [velocity, reset];
  if (Math.sign(current) === Math.sign(distance)) {
    velocity -= current;
  } else if (current !== 0) {
    reset = true;
  }
  return [velocity, reset];
}

function calUpdateVelocity(
  ball: Ball,
  distanceX: number,
  distanceY: number
): [number, number, boolean] {
  const [vX, resetX] = calVelocityComponent(ball.velocity.vX, distanceX);
  const [vY, resetY] = calVelocityComponent(ball.velocity.vY, distanceY);
  const reset = resetX || resetY;
  return [vX, vY, reset];
}

//
// Mouse Controls for canvas
//

function onMouseDown(evt: MouseEvent) {
  if (evt.button !== 0) return; //not primary click
  const [x, y] = getRelativeMousePos(evt);
  if (appProps.selectedImgEle) {
    appProps.selectedBall = createAndCacheBall(appProps.selectedImgEle, x, y) || null;
  } else {
    appProps.selectedBall = appProps.balls.find(ball => ball.containsPoint(x, y)) || null;
  }

  if (appProps.selectedBall) {
    //set the properties use to calcuate the velocity of the selected ball.
    appProps.selectedTime = new Date().getTime();
    appProps.selectedBall.selected = true;
    appProps.selectedPositions.current = { x, y };
    appProps.selectedPositions.prev = { x, y };
  }
}

function onMouseMove(evt: MouseEvent) {
  if (appProps.selectedBall) {
    const [x, y] = getRelativeMousePos(evt);
    const [moveX, moveY] = util.xyDiffBetweenPoints({ x, y }, appProps.selectedPositions.current);
    appProps.selectedBall.move(moveX, moveY);

    const [distX, distY] = util.xyDiffBetweenPoints({ x, y }, appProps.selectedPositions.prev);
    console.log('dist', distX, distY);
    const [vX, vY, resetSelectTime] = calUpdateVelocity(appProps.selectedBall, distX, distY);
    if (resetSelectTime) appProps.selectedTime = new Date().getTime();
    if (vX !== appProps.selectedBall.velocity.vX || vY !== appProps.selectedBall.velocity.vY) {
      appProps.selectedBall.velocity = { vX, vY };
      appProps.selectedPositions.prev = { x, y };
    }

    appProps.selectedPositions.current = { x, y };
  }
}

function onMouseUp(evt: MouseEvent) {
  if (appProps.selectedBall) {
    console.log(
      'v', appProps.selectedBall.velocity,
      't', new Date().getTime() - appProps.selectedTime
    );
    appProps.selectedBall.selected = false;
    appProps.selectedBall = null;
  }
}

function onMouseLeave(evt: MouseEvent) {
  if (appProps.selectedBall) {
    appProps.selectedBall.selected = false;
    appProps.selectedBall.velocity = { vX: 0, vY: 0 };
    appProps.selectedBall = null;
  }
}