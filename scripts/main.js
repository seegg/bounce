"use strict";
class Ball {
    constructor(img, x, y, r, selected = false) {
        this.id = Ball.baseId;
        this.position = { x, y };
        this.radius = r;
        this.rotation = 0;
        this.velocity = { vX: 0, vY: 0 };
        this.img = img;
        this.selected = selected;
        this.collided = [this.id];
        Ball.baseId++;
    }
    updatePosition(gravity, deceleration, ellapsedTime) {
        if (this.selected)
            return;
        this.position.x += this.velocity.vX * ellapsedTime;
        this.position.y += this.velocity.vY * ellapsedTime;
    }
    move(x, y) {
        this.position.x += x;
        this.position.y += y;
    }
    reverseDistance(distance) {
        const velocityRatio = Math.sqrt(Math.pow(distance, 2) / (Math.pow(this.velocity.vX, 2) + Math.pow(this.velocity.vY, 2))) * -1;
        this.position.x += this.velocity.vX * velocityRatio;
        this.position.y += this.velocity.vY * velocityRatio;
    }
    getTotalVelocity() {
        return Math.sqrt(Math.pow(this.velocity.vX, 2) + Math.pow(this.velocity.vY, 2));
    }
    containsPoint(x, y) {
        return Math.pow(x - this.position.x, 2) + Math.pow(y - this.position.y, 2) <= Math.pow(this.radius, 2);
    }
    resetCollided() {
        this.collided = [this.id];
    }
    wallBounce(wall) {
        switch (wall) {
            case 'left':
                this.velocity.vX *= -1;
                break;
            case 'right':
                this.velocity.vX *= -1;
                break;
            case 'top':
                this.velocity.vY *= -1;
                break;
            case 'bottom':
                this.velocity.vY *= -1;
                break;
        }
    }
    ballBounce(ball2) {
        if (this.selected || ball2.selected)
            return;
        if (this.collided.includes(ball2.id) || ball2.collided.includes(this.id))
            return;
        ball2.collided.push(this.id);
        const distance = util.distanceBetween2Points(this.position, ball2.position);
        const twoRadii = this.radius + ball2.radius;
        if (distance <= twoRadii) {
            console.log('bounce');
            const velocity1 = util.getBallCollisionVelocity(this, ball2);
            const velocity2 = util.getBallCollisionVelocity(ball2, this);
            this.velocity = velocity1;
            ball2.velocity = velocity2;
        }
    }
}
Ball.baseId = 1;
const util = (function utilityFunctions() {
    function calculateCollisionVelocity(x1, y1, vx1, vy1, x2, y2, vx2, vy2, mass1, mass2) {
        const mass = mass1 && mass2 ? (2 * mass2) / (mass1 + mass2) : 1;
        const distX = x1 - x2;
        const distY = y1 - y2;
        const vxDelta = vx1 - vx2;
        const vyDelta = vy1 - vy2;
        const dotProduct = (distX * vxDelta) + (distY * vyDelta);
        const magnitude = Math.pow(distX, 2) + Math.pow(distY, 2);
        const sc = dotProduct / magnitude * mass;
        const newVx = vx1 - (sc * distX);
        const newVy = vy1 - (sc * distY);
        return { vX: newVx, vY: newVy };
    }
    function getBallCollisionVelocity(ball1, ball2) {
        return calculateCollisionVelocity(ball1.position.x, ball1.position.y, ball1.velocity.vX, ball1.velocity.vY, ball2.position.x, ball2.position.y, ball2.velocity.vX, ball2.velocity.vY);
    }
    function xyDiffBetweenPoints(origin, destination) {
        return [origin.x - destination.x, origin.y - destination.y];
    }
    function createCircleImg(imgScr, radius, outlineColour = 'white', outlineSize = 3) {
        return new Promise((resolve, reject) => {
            const tempCanvas = document.createElement('canvas');
            const diameter = radius * 2;
            tempCanvas.width = diameter;
            tempCanvas.height = diameter;
            const image = document.createElement('img');
            image.src = imgScr;
            image.onload = () => {
                const wRatio = image.width / diameter;
                const hRatio = image.height / diameter;
                wRatio >= hRatio ? tempCanvas.width = Math.floor(image.width / hRatio) : tempCanvas.height = Math.floor(image.height / wRatio);
                const adjustedImage = stepDownImage(image, { w: diameter, h: diameter });
                const ctx = tempCanvas.getContext('2d');
                if (ctx === null)
                    throw new Error('context2D is null');
                ctx.drawImage(adjustedImage, 0, 0, tempCanvas.width, tempCanvas.height);
                ctx.beginPath();
                ctx.arc(tempCanvas.width / 2, tempCanvas.height / 2, radius, 0, Math.PI * 2);
                ctx.closePath();
                ctx.lineWidth = outlineSize;
                ctx.strokeStyle = outlineColour;
                ctx.stroke();
                ctx.globalCompositeOperation = 'destination-in';
                ctx.arc(tempCanvas.width / 2, tempCanvas.height / 2, radius, 0, Math.PI * 2);
                ctx.fill();
                resolve(createImageBitmap(tempCanvas, tempCanvas.width / 2 - radius, tempCanvas.height / 2 - radius, diameter, diameter));
            };
            image.onerror = reject;
        });
    }
    function stepDownImage(image, targetSize) {
        const wRatio = image.width / targetSize.w;
        const hRatio = image.height / targetSize.h;
        const steps = Math.ceil(Math.log(wRatio >= hRatio ? hRatio : wRatio) / Math.log(2));
        const canvas = document.createElement('canvas');
        canvas.height = image.height;
        canvas.width = image.width;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        if (steps > 1) {
            const canvas2 = document.createElement('canvas');
            const ctx2 = canvas2.getContext('2d');
            for (let i = 1; i < steps; i++) {
                canvas2.width = canvas.width / 2;
                canvas2.height = canvas.height / 2;
                ctx2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
                canvas.width = canvas2.width;
                canvas.height = canvas2.height;
                ctx.drawImage(canvas2, 0, 0);
            }
        }
        return canvas;
    }
    function convertBmpToBlob(image, mimeType = 'image/png') {
        return new Promise((resolve, reject) => {
            var _a;
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('bitmaprenderer');
            if (ctx) {
                ctx.transferFromImageBitmap(image);
            }
            else {
                (_a = canvas.getContext('2d')) === null || _a === void 0 ? void 0 : _a.drawImage(image, 0, 0);
            }
            canvas.toBlob(function blobCallback(blob) {
                if (blob === null)
                    reject('Blob is null');
                resolve(blob);
            });
        });
    }
    function distanceBetween2Points(point1, point2) {
        const [diffX, diffY] = xyDiffBetweenPoints(point1, point2);
        return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    }
    function angleBetween2DVector(vx1, vy1, vx2, vy2) {
        const dotProduct = (vx1 * vx2) + (vy1 * vy2);
        const magnitude1 = Math.sqrt(Math.pow(vx1, 2) + Math.pow(vy1, 2));
        const magnitude2 = Math.sqrt(Math.pow(vx2, 2) + Math.pow(vy2, 2));
        return Math.acos(dotProduct / (magnitude1 * magnitude2)) * (180 / Math.PI);
    }
    function angleBetween3Points(start, mid, end) {
        return angleBetween2DVector(mid.x - start.x, mid.y - start.y, end.x - mid.x, end.y - mid.y);
    }
    return {
        calculateCollisionVelocity,
        createCircleImg,
        convertBmpToBlob,
        getBallCollisionVelocity,
        xyDiffBetweenPoints,
        angleBetween2DVector,
        angleBetween3Points,
        distanceBetween2Points
    };
})();
const imageList = (function () {
    const imageFiles = ["me.jpeg", "grumpy.webp", "smileface.webp", "spongebob.webp"];
    const imageUrls = [];
    const path = "images/";
    return imageFiles.map(img => path + img).concat(imageUrls);
})();
const appProps = {
    radiusSizes: { s: 20, m: 35, l: 50, current: 50 },
    screenBreakPoints: { l: 1280, m: 768 },
    imageCache: [],
    balls: [],
    selectedImgEle: null,
    selectedBall: null,
    selectedPositions: {
        prev: { x: 0, y: 0 },
        current: { x: 0, y: 0 },
        reference: { x: 0, y: 0 }
    },
    selectedAngleThreshold: 10,
    mouseMoveDistThreshold: 10,
    currentTime: 0,
    selectedTime: 0,
    deceleration: 1.05,
    canvas: document.getElementById('canvas'),
    canvasHorizontalGap: 5 * 2,
    canvasTopOffset: 70,
    party: { active: false, start: 0, duration: 10, colour: '' },
    rainBow: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
};
(function init() {
    addEventListeners();
    appProps.canvas.width = window.innerWidth - appProps.canvasHorizontalGap;
    appProps.canvas.height = window.innerHeight - appProps.canvasTopOffset;
    Promise.all(imageList.map(img => addImage(img, appProps.imageCache, (evt) => { toggleSelectedImgElement(evt.target); }, 50)))
        .then(_ => {
        appProps.currentTime = new Date().getTime();
        draw();
    });
})();
function addImage(imgSrc, imgArr, callback = null, radius = appProps.radiusSizes.current) {
    const classList = ['img-thumb', 'rounded-full', 'filter', 'object-contain', 'h-12', 'w-12', 'filter', 'grayscale'];
    const imgContainer = document.getElementById('img-container');
    const loadingPlaceholder = document.createElement('img');
    loadingPlaceholder.classList.add('h-12', 'w-12');
    loadingPlaceholder.src = 'images/spinner.gif';
    imgContainer === null || imgContainer === void 0 ? void 0 : imgContainer.appendChild(loadingPlaceholder);
    return createAndCacheBitmap(imgSrc, imgArr, radius)
        .then(([img, imgIdx]) => {
        return createImgEleWithIndex(imgSrc, imgIdx, classList, callback);
    })
        .then(imgEle => {
        if (imgContainer === null)
            throw new Error('image container is null');
        appendImgElemToContainer(imgEle, imgContainer, loadingPlaceholder);
    })
        .catch(err => {
        console.error(err);
    });
}
function appendImgElemToContainer(imgEle, imgContainer, loadingImg) {
    if (loadingImg) {
        imgContainer.replaceChild(imgEle, loadingImg);
    }
    else {
        imgContainer.append(imgEle);
    }
}
function createImgEleWithIndex(src, imgIndex, classList, callback) {
    const imgEle = document.createElement('img');
    imgEle.classList.add(...classList);
    imgEle.onclick = callback ? callback : null;
    imgEle.setAttribute('data-index', imgIndex + '');
    imgEle.onload = () => {
        URL.revokeObjectURL(src);
    };
    imgEle.src = src;
    return imgEle;
}
function createAndCacheBitmap(imgSrc, imgArr, radius) {
    return util.createCircleImg(imgSrc, radius)
        .then(image => {
        imgArr.push(image);
        return [image, imgArr.length - 1];
    });
}
function addEventListeners() {
    window.onresize = () => {
        handleWindowResize();
    };
    appProps.canvas.addEventListener('pointerdown', onMouseDown);
    appProps.canvas.addEventListener('pointermove', onMouseMove);
    appProps.canvas.addEventListener('pointerup', onMouseUp);
}
function handleWindowResize() {
    try {
        if (appProps.canvas === null)
            throw new Error('canvas is null');
        const width = window.innerWidth;
        const height = window.innerHeight;
        if (width < appProps.screenBreakPoints.m) {
            appProps.radiusSizes.current = appProps.radiusSizes.s;
        }
        else if (width < appProps.screenBreakPoints.l) {
            appProps.radiusSizes.current = appProps.radiusSizes.m;
        }
        else {
            appProps.radiusSizes.current = appProps.radiusSizes.l;
        }
        appProps.canvas.width = width - appProps.canvasHorizontalGap;
        appProps.canvas.height = height - appProps.canvasTopOffset;
        appProps.balls.forEach(ball => ball.radius = appProps.radiusSizes.current);
    }
    catch (err) {
        console.error(err);
    }
}
function removeBall(ballToDelete) {
    try {
        const index = appProps.balls.findIndex(ball => ball.id === ballToDelete.id);
        if (index === -1) {
            throw new Error(`ball of id:${ballToDelete.id} could not be found.`);
        }
        else {
            appProps.balls.splice(index, 1);
        }
    }
    catch (err) {
        console.error(err);
    }
}
function createAndCacheBall(imgEle, x, y, radius = appProps.radiusSizes.current, selected = false) {
    try {
        const imgIndex = Number(imgEle.dataset['index']);
        const ball = new Ball(appProps.imageCache[imgIndex], x, y, radius, selected);
        appProps.balls.push(ball);
        return ball;
    }
    catch (err) {
        console.log(err);
    }
}
function draw() {
    const ctx = appProps.canvas.getContext('2d');
    const ellapsedTime = new Date().getTime() - appProps.currentTime;
    appProps.currentTime = new Date().getTime();
    ctx.clearRect(0, 0, appProps.canvas.width, appProps.canvas.height);
    appProps.balls.forEach(ball => {
        if (!ball.selected) {
            drawBall(ctx, ball);
        }
        ball.updatePosition(1, 1, ellapsedTime);
        checkWallCollission(ball);
    });
    appProps.balls.forEach(ball => {
        appProps.balls.forEach(ball2 => {
            if (ball2.id !== ball.id) {
                ball.ballBounce(ball2);
            }
        });
    });
    appProps.balls.forEach(ball => ball.collided = []);
    drawBall(ctx, appProps.selectedBall);
    window.requestAnimationFrame(() => { draw(); });
}
function drawBall(ctx, ball) {
    if (ball === null)
        return;
    const { position, radius, selected, rotation, img } = ball;
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.rotate(Math.PI / 180 * rotation);
    ctx.drawImage(img, -radius, -radius, radius * 2, radius * 2);
    if (ball.selected) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'cyan';
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();
}
function checkWallCollission(ball) {
    const { position, radius, velocity } = ball;
    const { width, height } = appProps.canvas;
    if (position.x + radius >= width) {
        velocity.vX < 0 || ball.wallBounce('right');
    }
    if (position.x - radius <= 0) {
        velocity.vX > 0 || ball.wallBounce('left');
    }
    if (position.y + radius >= height) {
        velocity.vY < 0 || ball.wallBounce('bottom');
    }
    if (position.y - radius <= 0) {
        velocity.vY > 0 || ball.wallBounce('top');
    }
}
function getRelativeMousePos(evt) {
    const boundingRect = evt.target.getBoundingClientRect();
    return [evt.clientX - boundingRect.x, evt.clientY - boundingRect.y];
}
function toggleSelectedImgElement(imgEle) {
    var _a;
    const grayscale = 'grayscale';
    (_a = appProps.selectedImgEle) === null || _a === void 0 ? void 0 : _a.classList.toggle(grayscale);
    if (imgEle === appProps.selectedImgEle) {
        appProps.selectedImgEle = null;
    }
    else {
        imgEle.classList.toggle(grayscale);
        appProps.selectedImgEle = imgEle;
    }
    scrollToImgElement(imgEle);
}
function scrollToImgElement(imgEle) {
    const container = document.getElementById('img-container');
    const scrollDistance = imgEle.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
    container.scroll(0, scrollDistance);
}
function onMouseDown(evt) {
    if (evt.button !== 0)
        return;
    const [x, y] = getRelativeMousePos(evt);
    if (appProps.selectedImgEle) {
        appProps.selectedBall = createAndCacheBall(appProps.selectedImgEle, x, y) || null;
    }
    else {
        appProps.selectedBall = appProps.balls.find(ball => ball.containsPoint(x, y)) || null;
    }
    if (appProps.selectedBall) {
        appProps.selectedTime = new Date().getTime();
        appProps.selectedBall.selected = true;
        appProps.selectedBall.velocity = { vX: 0, vY: 0 };
        appProps.selectedPositions.current = { x, y };
        appProps.selectedPositions.prev = { x, y };
        appProps.selectedPositions.reference = { x, y };
    }
}
function onMouseMove(evt) {
    if (appProps.selectedBall) {
        const [x, y] = getRelativeMousePos(evt);
        const [moveX, moveY] = util.xyDiffBetweenPoints({ x, y }, appProps.selectedPositions.current);
        appProps.selectedBall.move(moveX, moveY);
        appProps.selectedPositions.current = { x, y };
        const distance = util.distanceBetween2Points({ x, y }, appProps.selectedPositions.prev);
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
function onMouseUp(evt) {
    if (appProps.selectedBall) {
        console.log(appProps.selectedBall.id);
        const [x, y] = getRelativeMousePos(evt);
        const [distX, distY] = util.xyDiffBetweenPoints({ x, y }, appProps.selectedPositions.reference);
        const ellapsedTime = new Date().getTime() - appProps.selectedTime;
        appProps.selectedBall.velocity.vX = distX / ellapsedTime;
        appProps.selectedBall.velocity.vY = distY / ellapsedTime;
        appProps.selectedBall.selected = false;
        appProps.selectedBall = null;
    }
}
function onMouseLeave(evt) {
    if (appProps.selectedBall) {
        appProps.selectedBall.selected = false;
        appProps.selectedBall.velocity = { vX: 0, vY: 0 };
        appProps.selectedBall = null;
    }
}
