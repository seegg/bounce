const appProps = {
  count: 0,
  radiusSizes: { s: 20, m: 35, l: 50, current: 50 },
  screenBreakPoints: { l: 1280, m: 768 },
  gravity: { value: 0.01, isOn: true, btn: document.getElementById('gravity-btn') },
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
  velocityThreshould: 0.05,
  overlapThreshold: 0.05,
  wallModifiers: { left: 1.1, right: 1.1, top: 1, bottom: 1.8 },
  currentTime: 0,
  selectedTime: 0,
  deceleration: 0.995,
  canvas: <HTMLCanvasElement>document.getElementById('canvas'),
  canvasHorizontalGap: 5 * 2,
  canvasTopOffset: 70,
  party: {
    isActive: false, start: 0, duration: 10000, maxVelocity: 2, wallModRef: { left: 1, right: 1, top: 1, bottom: 1 },
    gravityRef: true, colourRef: <[number, number][]>[]
  },
  rainBow: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee'] //rainbow colours
};

(function init(): void {
  addEventListeners();
  //set initial canvas dimensions
  appProps.canvas.width = window.innerWidth - appProps.canvasHorizontalGap;
  appProps.canvas.height = window.innerHeight - appProps.canvasTopOffset;
  // setSizes();
  // Load all the images in the image list
  Promise.all(
    imageList.map(img => addImage(
      img, imageCache, 50)
    )
  ).then(_ => {
    appProps.currentTime = new Date().getTime();
    // party();
    // window.requestAnimationFrame(draw);
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

  const gravityBtn = document.getElementById('gravity-btn');
  //toggle the colour of the text on the gravity button.
  gravityBtn?.addEventListener('click',
    function toggleGravity() {
      if (appProps.party.isActive) return;
      appProps.gravity.isOn = !appProps.gravity.isOn;
      toggleGravityBtn(appProps.gravity.isOn);
    }
  );
  //start the party.
  document.getElementById('party-btn')?.addEventListener('click', () => {

    party();
  })
}

function toggleGravityBtn(isOn: boolean) {
  if (isOn) {
    appProps.gravity.btn?.classList.add('selected');
  } else {
    appProps.gravity.btn?.classList.remove('selected');
  }
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

function createAndStoreBall(
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
    appProps.count++;
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

  //Check and update the party conditions.
  if (appProps.party.isActive) {
    ctx.fillStyle = 'rgba(220, 219, 6, 0.1)';
    ctx.fillRect(0, 0, appProps.canvas.width, appProps.canvas.height);
    const ellapsedPartyTime = new Date().getTime() - appProps.party.start;
    if (ellapsedPartyTime > appProps.party.duration) {
      appProps.party.isActive = false;
      appProps.wallModifiers = { ...appProps.party.wallModRef };
      appProps.gravity.isOn = appProps.party.gravityRef;
      toggleGravityBtn(appProps.gravity.isOn);
      appProps.party.colourRef = [];
    } else {
      //update the ball border colours after each second.
      appProps.party.colourRef.forEach((val, idx) => {
        appProps.party.colourRef[idx] = [val[0], ellapsedPartyTime];
      })
      console.log(ellapsedPartyTime);
    }

  } else {
    ctx.clearRect(0, 0, appProps.canvas.width, appProps.canvas.height);
  }

  //draw each of the balls and then update its position.
  appProps.balls.forEach(ball => {
    if (!ball.selected) {
      drawBall(ctx, ball);
    }
    updateBall(ball, ellapsedTime);

  })

  fixBallOverlaps(appProps.balls);
  appProps.balls.forEach(ball => {
    if (!ball.selected) {
      ball.rotation += calcBallRotation(ball);
    }
  })
  //draw selected ball last so it shows up on top.
  drawBall(ctx, appProps.selectedBall);

  window.requestAnimationFrame(() => { draw() });
}

/**
 * update the ball's state after each frame.
 */
function updateBall(ball: Ball, ellapsedTime: number) {
  let { position, selected, velocity } = ball;
  if (!selected) {
    ball.prevPosition = { ...position };
    const halfGravity = appProps.gravity.value / 3;
    if (Math.abs(ball.velocity.vX) < halfGravity) ball.velocity.vX = 0;
    if (Math.abs(ball.velocity.vY) < halfGravity) ball.velocity.vY = 0;
    appProps.gravity.isOn && (velocity.vY += appProps.gravity.value);
    const distX = velocity.vX * ellapsedTime;
    position.x += distX;
    position.y += velocity.vY * ellapsedTime;
    velocity.vX *= appProps.deceleration;
    handleBallCollissions(ball);
    handleWallCollissions(ball);
  }
}
/**
 * Adjust the position of the ball based on the nearest ball collission
 */
function handleBallCollissions(ball: Ball): void {
  let collisions = <Ball[]>[];
  appProps.balls.forEach(ball2 => {
    if (ball.id !== ball2.id && !ball2.selected) {
      if (ball.getOverlap(ball2) > appProps.overlapThreshold) collisions.push(ball2);
    }
  })
  //sort collision by distance between balls and then handle them sequentially.
  if (collisions.length > 0) {
    collisions.sort((a, b) => {
      const distA = util.distanceBetween2Points(ball.position, a.position);
      const distB = util.distanceBetween2Points(ball.position, b.position);
      return distA - distB;
    })

    // let collidingBalls = [ball, collisions[0]];

    ball.reversePosition(ball.getOverlap(collisions[0]));
    ball.ballBounce(collisions[0]);
  }
  collisions = [];
}

/**
 * Check to see if a ball collides with a side wall.
 */
function handleWallCollissions(ball: Ball): void {
  const { position, radius, velocity } = ball;
  const { canvas, wallModifiers } = appProps;
  //right
  if (position.x + radius > canvas.width) {
    position.x = canvas.width - radius;
    velocity.vX < 0 || (ball.velocity.vX *= -1 / wallModifiers['right']);
    if (Math.abs(velocity.vX) < 0.05) velocity.vX = 0;
  }

  //left
  if (position.x - radius < 0) {
    position.x = radius;
    velocity.vX > 0 || (ball.velocity.vX *= -1 / wallModifiers['left']);
    if (Math.abs(velocity.vX) < 0.05) velocity.vX = 0;
  }

  //bottom
  if (position.y + radius > canvas.height) {
    position.y = canvas.height - radius;
    velocity.vY < 0 || (ball.velocity.vY *= -1 / wallModifiers['bottom']);
    if (Math.abs(velocity.vY) < 0.05) velocity.vY = 0;
  }

  //top
  if (position.y - radius < 0) {
    position.y = radius;
    velocity.vY > 0 || (ball.velocity.vY *= -1 / wallModifiers['top']);
  }
}

/**
 * Sort the list of balls base on position on the canvas.
 * Bottom to top, left to right.
 */
function sortBalls(balls: Ball[]): Ball[] {
  let sortedBallList = <Ball[]>[];

  balls.forEach(ball => {
    let listPosition = sortedBallList.findIndex(ball2 => {
      if (ball.position.y > ball2.position.y) return true;
      if (ball.position.y === ball2.position.y && ball.position.x < ball2.position.x) return true;
      return false;
    })
    listPosition === -1 ? sortedBallList.push(ball) : sortedBallList.splice(listPosition, 0, ball);
  })

  return sortedBallList;
}


/**
 * check and fix any overlaps between balls after 
 * handling wall and ball collisions
 */
function fixBallOverlaps(balls: Ball[]) {
  let sortedBallList = sortBalls(balls);
  sortedBallList.forEach(ball => {
    !ball.selected && sortedBallList.forEach(ball2 => {
      if (ball2.selected) return;
      const overlap = ball.getOverlap(ball2);
      if (overlap < appProps.overlapThreshold) return;
      const distanceOnYAxis = ball.position.y - ball2.position.y;
      if (ball.id !== ball2.id && overlap > 0.03) {
        const [x, y] = util.xyDiffBetweenPoints(ball.position, ball2.position);
        const total = Math.abs(x) + Math.abs(y);
        const xRatio = (x / total) * overlap;
        const yRatio = (y / total) * overlap;
        if (distanceOnYAxis === 0) {
          ball.position.x -= 0.5 * overlap;
          ball2.position.x += 0.5 * overlap;
        } else {
          distanceOnYAxis > 0 ?
            (ball2.position.x += xRatio,
              ball2.position.y += yRatio) :
            (ball.position.x += xRatio,
              ball.position.y += yRatio);
        }
      }
    })
  })
}

/**
 * Draw an individual ball.
 */
function drawBall(ctx: CanvasRenderingContext2D, ball: Ball | null) {
  if (ball === null) return;
  const { id, position, radius, selected, rotation, img } = ball;
  ctx.save();
  ctx.translate(position.x, position.y);
  ctx.rotate(Math.PI / 180 * rotation);
  ctx.drawImage(img, -radius, -radius, radius * 2, radius * 2);

  if (appProps.party.isActive) {
    ctx.lineWidth = 6;
    ctx.strokeStyle = appProps.rainBow[(appProps.party.colourRef[id][0]
      + Math.floor(appProps.party.colourRef[id][1] / 1000)) % appProps.rainBow.length];
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
    console.log(appProps.party.colourRef[id]);
  }

  if (selected) {
    ctx.lineWidth = 4
    ctx.strokeStyle = 'cyan'
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore();
}

function calcBallRotation(ball: Ball): number {
  const parameter = 2 * Math.PI * ball.radius;
  const dist = ball.position.x - ball.prevPosition.x;
  const rotation = dist / parameter;
  return rotation * 360;
}

function party() {
  appProps.party.start = new Date().getTime();

  if (appProps.party.isActive) return;

  appProps.party.gravityRef = appProps.gravity.isOn;
  appProps.gravity.isOn = false;
  toggleGravityBtn(appProps.gravity.isOn);
  appProps.party.wallModRef = { ...appProps.wallModifiers };
  appProps.wallModifiers = { left: 1, right: 1, top: 1, bottom: 1 };
  appProps.party.isActive = true;
  appProps.balls.forEach(ball => {
    //randomly assign one of the rainbow colours to a ball at the start.
    appProps.party.colourRef[ball.id] = [Math.floor(Math.random() * appProps.rainBow.length), 0];
    let sign = -1;
    if (Math.random() > 0.5) {
      sign *= 1;
    }
    //randomise the velocity of each ball with a mininum value of 2.
    ball.velocity.vX = Math.max(Math.random() * appProps.party.maxVelocity, 0.5) * sign;
    sign = -1;
    if (Math.random() > 0.5) {
      sign = 1;
    }
    ball.velocity.vY = Math.max(Math.random() * appProps.party.maxVelocity, 0.5) * sign;
  })
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
    appProps.selectedBall = createAndStoreBall(appProps.selectedImgEle, x, y) || null;
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
    } catch (err) {
      appProps.selectedBall.position = { x: 50, y: 50 };
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