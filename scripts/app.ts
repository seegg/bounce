const appProps = {
  radiusSizes: { s: 20, m: 35, l: 50, current: 50 },
  screenBreakPoints: { l: 1280, m: 768 },
  gravity: 0.01,
  balls: <Ball[]>[],
  selectedImgEle: <HTMLImageElement | null>null,
  selectedBall: <Ball | null>null,
  selectedPositions: {
    prev: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
    reference: { x: 0, y: 0 }
  },
  selectedAngleThreshold: 10,
  mouseMoveDistThreshold: 10,
  wallModifiers: { left: 1.1, right: 1.1, top: 1, bottom: 1.8 },
  currentTime: 0,
  selectedTime: 0,
  deceleration: 0.995,
  canvas: <HTMLCanvasElement>document.getElementById('canvas'),
  canvasHorizontalGap: 5 * 2,
  canvasTopOffset: 70,
  party: { active: false, start: 0, duration: 10, colour: '' },
  rainBow: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee'] //rainbow colours
};

(function init(): void {
  addEventListeners();
  //set initial canvas dimensions
  appProps.canvas.width = window.innerWidth - appProps.canvasHorizontalGap;
  appProps.canvas.height = window.innerHeight - appProps.canvasTopOffset;
  setSizes();

  appProps.canvas.width = 300;
  //Load all the images in the image list
  Promise.all(
    imageList.map(img => addImage(
      img, imageCache, 50)
    )
  ).then(_ => {
    appProps.currentTime = new Date().getTime();
    draw();
  });
})();

/**
 * Add event handlers for the canvas.
 */
function addEventListeners(): void {
  window.onresize = () => {
    setSizes();
  };
  appProps.canvas.addEventListener('pointerdown', onMouseDown);
  appProps.canvas.addEventListener('pointermove', onMouseMove);
  appProps.canvas.addEventListener('pointerup', onMouseUp);
  appProps.canvas.addEventListener('pointerleave', onMouseLeave);
}

/**
 * Change the canvas dimensions and the ball radius sizes
 * everytime the browser is resized.
 */
function setSizes(): void {
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
    const ball = new Ball(imageCache[imgIndex], x, y, radius, selected);
    appProps.balls.push(ball);
    return ball;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Draw each frame
 */
function draw() {
  const ctx = appProps.canvas.getContext('2d')!;
  const ellapsedTime = new Date().getTime() - appProps.currentTime;
  appProps.currentTime = new Date().getTime();
  ctx.clearRect(0, 0, appProps.canvas.width, appProps.canvas.height);

  //draw each of the balls and then update its position.
  appProps.balls.forEach(ball => {
    if (!ball.selected) {
      drawBall(ctx, ball);
    }
    updateBall(ball, ellapsedTime);

  })
  //draw selected ball last so it shows up on top.
  drawBall(ctx, appProps.selectedBall);

  window.requestAnimationFrame(() => { draw() });
}

/**
 * update the ball's state after each frame.
 */
function updateBall(ball: Ball, ellapsedTime: number) {
  const { position, selected, velocity } = ball
  if (!selected) {
    const halfGravity = appProps.gravity / 2;
    if (Math.abs(ball.velocity.vX) <= halfGravity) ball.velocity.vX = 0;
    if (Math.abs(ball.velocity.vY) <= halfGravity) ball.velocity.vY = 0;
    const distX = velocity.vX * ellapsedTime;
    ball.rotation += calcBallRotation(ball, distX);
    position.x += distX;
    position.y += velocity.vY * ellapsedTime;
    velocity.vX *= appProps.deceleration;
    velocity.vY += appProps.gravity;

    handleBallCollission(ball);
    handleWallCollission(ball);

  }
}
/**
 * Adjust the position of the ball based on the nearest ball collission
 */
function handleBallCollission(ball: Ball): void {
  let collissions = <Ball[]>[];
  appProps.balls.forEach(ball2 => {
    if (ball.id !== ball2.id && !ball2.selected) {
      const overlap = ball.getOverlap(ball2);
      if (overlap > 0) collissions.push(ball2);
    }
  })
  //if there's a collision find the nearest collided ball and adjust current ball's position.
  if (collissions.length > 0) {
    let nearestCollidedBall = collissions[0];
    for (let i = 1; i < collissions.length; i++) {
      const dist = util.distanceBetween2Points(ball.position, nearestCollidedBall.position);
      if (dist > util.distanceBetween2Points(ball.position, collissions[i].position)) {
        nearestCollidedBall = collissions[i];
      }
    }
    ball.reversePosition(ball.getOverlap(nearestCollidedBall));
    ball.ballBounce(nearestCollidedBall);
  }
  collissions = [];
}

/**
 * Check to see if a ball collides with a side wall.
 */
function handleWallCollission(ball: Ball): void {
  const { position, radius, velocity } = ball;
  const { canvas, wallModifiers } = appProps;
  //right
  if (position.x + radius > canvas.width) {
    position.x = canvas.width - radius;
    velocity.vX < 0 || (ball.velocity.vX *= -1 / wallModifiers['right']);
  }

  //left
  if (position.x - radius < 0) {
    position.x = radius;
    velocity.vX > 0 || (ball.velocity.vX *= -1 / wallModifiers['left']);
  }

  //bottom
  if (position.y + radius > canvas.height) {
    position.y = canvas.height - radius;
    if (velocity.vY < 0.05) velocity.vY = 0;
    velocity.vY < 0 || (ball.velocity.vY *= -1 / wallModifiers['bottom']);
  }

  //top
  if (position.y - radius < 0) {
    position.y = radius;
    velocity.vY > 0 || (ball.velocity.vY *= -1 / wallModifiers['top']);
  }
}


/**
 * Draw an individual ball.
 */
function drawBall(ctx: CanvasRenderingContext2D, ball: Ball | null) {
  if (ball === null) return;
  const { position, radius, selected, rotation, img } = ball;
  ctx.save();
  ctx.translate(position.x, position.y);
  ctx.rotate(Math.PI / 180 * rotation);
  ctx.drawImage(img, -radius, -radius, radius * 2, radius * 2);

  if (selected) {
    ctx.lineWidth = 4
    ctx.strokeStyle = 'cyan'
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore();
}

function calcBallRotation(ball: Ball, distance: number): number {
  const parameter = 2 * Math.PI * ball.radius;
  const rotation = distance / parameter;
  return rotation * 360;
}

/**
 * Get the position of the mouse click 
 * relative to the canvas
 */
function getRelativeMousePos(evt: MouseEvent): [number, number] {
  const boundingRect = (<HTMLElement>evt.target).getBoundingClientRect();
  return [evt.clientX - boundingRect.x, evt.clientY - boundingRect.y];
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
    //set the initial values for properties use to calcuate the 
    //velocity of the selected ball at release.
    appProps.selectedTime = new Date().getTime();
    appProps.selectedBall.selected = true;
    appProps.selectedBall.velocity = { vX: 0, vY: 0 };
    appProps.selectedPositions.current = { x, y };
    appProps.selectedPositions.prev = { x, y };
    appProps.selectedPositions.reference = { x, y };
  }
}

function onMouseMove(evt: MouseEvent) {
  if (appProps.selectedBall) {
    const [x, y] = getRelativeMousePos(evt);
    const [moveX, moveY] = util.xyDiffBetweenPoints(appProps.selectedPositions.current, { x, y });
    appProps.selectedBall.move(moveX, moveY);
    appProps.selectedPositions.current = { x, y };

    const distance = util.distanceBetween2Points({ x, y }, appProps.selectedPositions.prev);

    //if the angle between the 3 points is greater than a certain amount
    //assign the current position as the new reference point for velocity.
    if (distance > appProps.mouseMoveDistThreshold) {
      const { reference, prev, current } = appProps.selectedPositions;
      const angle = util.angleBetween3Points(reference, prev, current) || 0;
      if (angle > appProps.selectedAngleThreshold) {
        appProps.selectedPositions.reference = { x, y };
        appProps.selectedTime = new Date().getTime();
      }
      appProps.selectedPositions.prev = { x, y };
    }
  }
}

/**
 * Calculate ellapsed time and final mouse position and use it to 
 * adjust the velocity for the selected ball
 */
function onMouseUp(evt: MouseEvent) {
  if (appProps.selectedBall) {
    try {
      const [x, y] = getRelativeMousePos(evt);
      const [distX, distY] = util.xyDiffBetweenPoints(appProps.selectedPositions.reference, { x, y });

      const ellapsedTime = new Date().getTime() - appProps.selectedTime;

      appProps.selectedBall.velocity.vX = distX / ellapsedTime;
      appProps.selectedBall.velocity.vY = distY / ellapsedTime;
      if (!Number(appProps.selectedBall.velocity.vX) || !Number(appProps.selectedBall.velocity.vY))
        throw new Error('Velocity must be a number');
    } catch (err) {
      console.error(err);
    }
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