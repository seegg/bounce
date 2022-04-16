import { Ball } from "./ball";
import { imageList, addImage, imageCache } from "./images";
import { Velocity } from "./types";
import { util } from "./utility";

export const appProps = {
  count: 0,
  isRunning: true,
  isRunningW: true,
  isSucking: false,
  isBlowing: false,
  suckingArr: <{ pos: { x: number, y: number }, curr: number, isBlow: boolean }[]>[],
  currentSuckingDistance: 50,
  maxSuckingDistance: 500,
  suckingPosition: { x: 0, y: 0 },
  suckingPower: 0.2,
  lesserSuckingPower: 0.1,
  radiusSizes: { s: 40, m: 40, l: 50, current: 50 },
  screenBreakPoints: { l: 1280, m: 768 },
  gravity: { value: 0.01, isOn: false, btn: document.getElementById('gravity-btn') },
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
  wallModifiers: { left: 1, right: 1, top: 1, bottom: 1 },
  currentTime: 0,
  selectedTime: 0,
  deceleration: 0.995,
  canvas: <HTMLCanvasElement>document.getElementById('canvas'),
  canvasHorizontalGap: 5 * 2,
  canvasTopOffset: 70,
  party: {
    isActive: false, start: 0, duration: 10000, maxVelocity: 2, minVelocity: 0.5,
    wallModRef: { left: 1.1, right: 1.1, top: 1, bottom: 1.8 },
    gravityRef: false, colourRef: <[number, number][]>[],
    partyBtn: document.getElementById('party-btn')
  },
  rainBow: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee'], //rainbow colours
  latestFrame: 0,
};

export function init(): void {
  appProps.canvas = <HTMLCanvasElement>document.getElementById('canvas');
  appProps.gravity.btn = document.getElementById('gravity-btn');
  appProps.party.partyBtn = document.getElementById('party-btn');
  addEventListeners();
  //set initial canvas dimensions
  setSizes();
  // Load all the images in the image list
  if (localStorage.getItem('ballImgSrcs')) {
    imageList.push(...localStorage.getItem('ballImgSrcs')!.split(','));
  }
  Promise.all(
    imageList.map(img => addImage(
      img, imageCache, 50)
    )
  ).then(_ => {
    createBalls(3, 6);
    appProps.currentTime = new Date().getTime();
    draw();
  });
};

const createBalls = (min: number, max: number) => {
  const number = Math.ceil(Math.random() * (max - min)) + min;
  for (let i = 0; i < number; i++) {
    const ball = new Ball(imageCache[Math.floor(Math.random() * imageCache.length)],
      Math.random() * appProps.canvas.width, Math.random() * appProps.canvas.height, appProps.radiusSizes.current
    )
    ball.velocity.vX = Math.random() * 0.5;
    ball.velocity.vY = Math.random() * 0.5;
    appProps.balls.push(ball);
  }
}

/**
 * Add event handlers for the canvas.
 */
function addEventListeners(): void {
  window.onresize = () => {
    setSizes();
    if (window.innerWidth < 570 && document.querySelector('.intro')) {
      if (appProps.isRunningW) toggleStartW();
    } else {
      if (!appProps.isRunningW) toggleStartW();
    }
  };
  appProps.canvas.addEventListener('pointerdown', onMouseDown);
  appProps.canvas.addEventListener('pointermove', onMouseMove);
  appProps.canvas.addEventListener('pointerup', onMouseUp);
  appProps.canvas.addEventListener('pointerleave', onMouseLeave);
  appProps.canvas.addEventListener('contextmenu', (evt) => { evt.preventDefault(); handleContextMenu(evt) });
  appProps.canvas.addEventListener('touchstart', (evt) => { evt.preventDefault(); });

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

  const container = document.querySelector('.bounce-container')?.parentElement;

  const options = {
    rootMargin: '0px',
    threshold: 0.5
  }

  new IntersectionObserver((entries) => {
    const { isIntersecting } = entries[0];
    if (isIntersecting) {
      container?.children[0].classList.remove('bounce-hide');
      if (!appProps.isRunning) toggleStart();
    } else {
      container?.children[0].classList.add('bounce-hide');
      if (appProps.isRunning) toggleStart();
    }
  }, options).observe(container!);

};

function toggleGravityBtn(isOn: boolean) {
  if (isOn) {
    appProps.gravity.btn?.classList.add('bounce-selected');
  } else {
    appProps.gravity.btn?.classList.remove('bounce-selected');
  }
  if (appProps.gravity.isOn) {
    const temp = appProps.party.wallModRef;
    appProps.party.wallModRef = { ...appProps.wallModifiers };
    appProps.wallModifiers = { ...temp };
  } else {
    const temp = appProps.wallModifiers;
    appProps.wallModifiers = { ...appProps.party.wallModRef };
    appProps.party.wallModRef = { ...temp };
  }
}

/**
 * Change the canvas dimensions and the ball radius sizes
 * everytime the browser is resized.
 */
function setSizes(): void {
  try {
    if (appProps.canvas === null) throw new Error('canvas is null');
    const width = window.innerWidth - 10;
    const height = window.innerHeight - 20;

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

function toggleStart() {
  appProps.isRunning = !appProps.isRunning;
  if (appProps.isRunning && appProps.isRunningW) {
    appProps.currentTime = new Date().getTime();
    draw();
  }
}

function toggleStartW() {
  appProps.isRunningW = !appProps.isRunningW;
  if (appProps.isRunning && appProps.isRunningW) {
    appProps.currentTime = new Date().getTime();
    draw();
  }
}


/**
 * Remove the selected ball from the ball array
 */
function deleteBall(index: number) {
  try {
    appProps.balls.splice(index, 1);
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
    //Update colour reference if created during party mode.
    if (appProps.party) {
      appProps.party.colourRef[ball.id] = [Math.floor(Math.random() * appProps.rainBow.length), 0];
    }
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
    ctx.fillStyle = 'rgba(1, 1, 1, 0.1)';
    ctx.fillRect(0, 0, appProps.canvas.width, appProps.canvas.height);
    const ellapsedPartyTime = new Date().getTime() - appProps.party.start;
    //party btn backgroup position as percentage value
    let partyBtnBGPos = ellapsedPartyTime / appProps.party.duration * 100;
    if (ellapsedPartyTime > appProps.party.duration) {
      partyBtnBGPos = 0; () => { draw }
      appProps.party.isActive = false;
      // appProps.wallModifiers = { ...appProps.party.wallModRef };
      if (appProps.gravity.isOn != appProps.party.gravityRef) {
        toggleGravityBtn(appProps.party.gravityRef);
      }
      appProps.gravity.isOn = appProps.party.gravityRef;
      appProps.party.colourRef = [];
    } else {
      //update the ball border colours after each second.
      appProps.party.colourRef.forEach((val, idx) => {
        appProps.party.colourRef[idx] = [val[0], ellapsedPartyTime];
      })
    }
    setEleBackGroundPosition(appProps.party.partyBtn!, partyBtnBGPos);
  } else {
    ctx.clearRect(0, 0, appProps.canvas.width, appProps.canvas.height);
  }

  appProps.suckingArr.forEach(suck => {
    drawVibratingCircle(ctx, suck.pos.x, suck.pos.y, suck.curr - appProps.radiusSizes.current, suck.isBlow, appProps.party.isActive);
  })

  if (appProps.isSucking) {
    // // ctx.strokeStyle = 'blanchedalmond';
    if (appProps.currentSuckingDistance < appProps.maxSuckingDistance) {
      appProps.currentSuckingDistance = Math.min(appProps.maxSuckingDistance, appProps.currentSuckingDistance + 5);

    }
    drawVibratingCircle(ctx, appProps.suckingPosition.x, appProps.suckingPosition.y, appProps.currentSuckingDistance - appProps.radiusSizes.current, appProps.isBlowing, appProps.party.isActive);
  }

  updateAllSuck();


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
  if (appProps.isRunning && appProps.isRunningW) {
    appProps.latestFrame = window.requestAnimationFrame(() => { draw() });
  } else {
    window.cancelAnimationFrame(appProps.latestFrame);
  }
};

const drawVibratingCircle =
  (ctx: CanvasRenderingContext2D,
    x: number, y: number, r: number,
    isBlow: boolean, isParty: boolean,
    vibratingRatio = 0.05) => {
    const outerEdge = r * vibratingRatio;
    drawCircle(ctx, x, y, r - outerEdge + (Math.random() * outerEdge), isBlow, isParty);
    drawCircle(ctx, x, y, r - outerEdge + (Math.random() * outerEdge), isBlow, isParty);
  }

const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, isBlow: boolean, isParty: boolean, width = 2, style = 'rgba(255, 235, 205, 0.3)') => {
  if (r <= 0) return;
  if (isBlow) style = 'rgba(238, 35, 35, 0.3)';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  if (isParty) {
    ctx.lineWidth = width;
    ctx.strokeStyle = style;
    ctx.stroke();
  } else {
    ctx.fillStyle = style;
    ctx.fill();
  }
};

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
    if (appProps.gravity.isOn) velocity.vX *= appProps.deceleration;
    handleBallCollissions(ball);
    handleWallCollissions(ball);

    if (appProps.isSucking) {
      suction(ball, appProps.suckingPosition.x, appProps.suckingPosition.y, appProps.currentSuckingDistance, appProps.suckingPower, appProps.isBlowing)
    }
    applyAllSuck(ball);
  }
}

/**
 * attract balls to the specified position based on power.
 */
function suction(ball: Ball, x: number, y: number, suckingDistance: number, suckingPower: number, isBlow: boolean) {
  const distance = util.distanceBetween2Points({ x, y }, ball.position);
  if (distance <= suckingDistance) {
    //the stronger the suck the closer it's to the center.
    let adjustedPower = ((suckingDistance - distance) / suckingDistance) * suckingPower;
    if (distance < ball.radius / 2) {
      ball.velocity.vX *= 0.95;
      ball.velocity.vY *= 0.95;
    }
    if (isBlow) adjustedPower *= -1;
    if (ball.position.x > x) {
      ball.velocity.vX -= adjustedPower;
    } else if (ball.position.x < x) {
      ball.velocity.vX += adjustedPower;
    }

    if (ball.position.y > y) {
      ball.velocity.vY -= adjustedPower;
    } else if ((ball.position.y < y)) {
      ball.velocity.vY += adjustedPower;
    }
  }
}

function applyAllSuck(ball: Ball) {
  appProps.suckingArr.forEach((suck) => {
    suction(ball, suck.pos.x, suck.pos.y, suck.curr, appProps.lesserSuckingPower, suck.isBlow);
  })
}

function updateAllSuck() {
  appProps.suckingArr.forEach(suck => {
    suck.curr -= 0.1;
  });

  appProps.suckingArr = appProps.suckingArr.filter(suck => suck.curr >= appProps.radiusSizes.current);
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
    const [v1, v2] = ballsBounce(ball, collisions[0]);
    ball.velocity = v1;
    collisions[0].velocity = v2;
    // ball.ballBounce(collisions[0]);
  }
  collisions = [];
}

/**
 * calculate the velocity after two balls collide.
 */
function ballsBounce(ball1: Ball, ball2: Ball): [Velocity, Velocity] {
  let ball1V = { ...ball1.velocity };
  let ball2V = { ...ball2.velocity };
  if (ball1.checkBallCollision(ball2)) {
    ball1V = util.getBallCollisionVelocity(ball1, ball2);
    ball2V = util.getBallCollisionVelocity(ball2, ball1);
  }
  return [ball1V, ball2V];
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
  if (balls.length < 2) return;
  let sortedBallList = sortBalls(balls);
  sortedBallList.forEach(ball => {
    !ball.selected && sortedBallList.forEach(ball2 => {
      if (ball2.selected || ball2.id === ball.id) return;
      const overlap = ball.getOverlap(ball2);
      if (overlap < appProps.overlapThreshold) return;
      const distanceOnYAxis = ball.position.y - ball2.position.y;
      if (overlap > 0.03) {
        const [x, y] = util.xyDiffBetweenPoints(ball.position, ball2.position);
        const total = (Math.abs(x) + Math.abs(y));
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
    ctx.lineWidth = Math.round(radius / 10) + 1;
    ctx.strokeStyle = appProps.rainBow[(appProps.party.colourRef[id][0]
      + Math.floor(appProps.party.colourRef[id][1] / 1000)) % appProps.rainBow.length];
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
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
  document.getElementById('party-btn')?.classList.add('btn-progress-bar')
  if (appProps.party.isActive) {
    appProps.balls.forEach(ball => {
      ball.velocity = partyBallVelocity();
    });
    return;
  }

  appProps.party.gravityRef = appProps.gravity.isOn;
  if (appProps.gravity.isOn) toggleGravityBtn(appProps.gravity.isOn);
  appProps.gravity.isOn = false;
  appProps.party.isActive = true;
  appProps.balls.forEach(ball => {
    //randomly assign one of the rainbow colours to a ball at the start.
    appProps.party.colourRef[ball.id] = [Math.floor(Math.random() * appProps.rainBow.length), 0];
    ball.velocity = partyBallVelocity();
  })
}

//randomise velocity for party balls.
function partyBallVelocity(min: number = appProps.party.maxVelocity, max: number = appProps.party.minVelocity): Velocity {
  let signX = -1, signY = -1;
  if (Math.random() < 0.5) signX = 1;
  if (Math.random() < 0.5) signY = 1;
  return {
    vX: Math.max((Math.random() * max), min) * signX,
    vY: Math.max((Math.random() * max), min) * signY
  };
}

/**
 * Set the x position of the Element's backgroup position property as a percentage.
 */
function setEleBackGroundPosition(ele: HTMLElement, pos: number) {
  ele.style.backgroundPosition = `${pos}% 100%`;
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
  } else {
    appProps.isSucking = true;
    if (Math.random() < 0.5) appProps.isBlowing = true;
    [appProps.suckingPosition.x, appProps.suckingPosition.y] = [x, y];
  }
}

function onMouseMove(evt: MouseEvent) {
  if (appProps.selectedBall || appProps.isSucking) {
    const [x, y] = getRelativeMousePos(evt);
    if (appProps.selectedBall) {
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

    if (appProps.isSucking) {
      appProps.suckingPosition = { x, y };
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
      appProps.balls.forEach(ball => {
        if (!ball.selected) {
          if (ball.position.x === appProps.selectedBall?.position.x && ball.position.y === appProps.selectedBall?.position.y) {
            appProps.selectedBall.position.y += Math.random() * Math.random() > 0.5 ? -1 : 1;
            appProps.selectedBall.position.x += Math.random() * Math.random() > 0.5 ? -1 : 1;
          }
        }
      })
    } catch (err) {
      appProps.selectedBall.position = { x: 50, y: 50 };
      console.error(err);
    }
    appProps.selectedBall.selected = false;
    appProps.selectedBall = null;
  }

  if (appProps.isSucking) {
    addSuckToArr();
  }
}

function onMouseLeave(evt: MouseEvent) {
  if (appProps.selectedBall) {
    appProps.selectedBall.selected = false;
    appProps.selectedBall.velocity = { vX: 0, vY: 0 };
    appProps.selectedBall = null;
  }
  if (appProps.isSucking) {
    addSuckToArr();
  }
}

function handleContextMenu(evt: MouseEvent) {
  const [x, y] = getRelativeMousePos(evt);
  const index = appProps.balls.findIndex(ball => ball.containsPoint(x, y));
  if (index >= 0) deleteBall(index);
}

function addSuckToArr() {
  const { suckingPosition, currentSuckingDistance } = appProps;
  appProps.suckingArr.push({ pos: { ...suckingPosition }, curr: currentSuckingDistance, isBlow: appProps.isBlowing });
  appProps.isSucking = false;
  appProps.isBlowing = false;
  appProps.currentSuckingDistance = appProps.radiusSizes.current;
}