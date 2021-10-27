"use strict";
class Ball {
    constructor(img, x, y, r, selected = false) {
        this.id = Ball.baseId;
        this.position = { x, y };
        this.prevPosition = { x, y };
        this.radius = r;
        this.rotation = 0;
        this.velocity = { vX: 0, vY: 0 };
        this.img = img;
        this.selected = selected;
        Ball.baseId++;
    }
    move(x, y) {
        this.position.x += x;
        this.position.y += y;
    }
    reversePosition(distance) {
        if (this.getTotalVelocity() === 0) {
        }
        else {
            const velocityRatio = Math.sqrt(Math.pow(distance, 2) / (Math.pow(this.velocity.vX, 2) + Math.pow(this.velocity.vY, 2))) * -1;
            this.position.x += this.velocity.vX * velocityRatio;
            this.position.y += this.velocity.vY * velocityRatio;
        }
    }
    getTotalVelocity() {
        return Math.sqrt(Math.pow(this.velocity.vX, 2) + Math.pow(this.velocity.vY, 2));
    }
    containsPoint(x, y) {
        return Math.pow(x - this.position.x, 2) + Math.pow(y - this.position.y, 2) <= Math.pow(this.radius, 2);
    }
    getOverlap(otherBall) {
        const centerDistance = util.distanceBetween2Points(this.position, otherBall.position);
        const sumOfRadii = this.radius + otherBall.radius;
        const overlap = sumOfRadii - centerDistance;
        return overlap >= 0 ? overlap : -1;
    }
    checkBallCollision(ball2) {
        if (this.getOverlap(ball2) >= 0) {
            const centerToCenter = util.xyDiffBetweenPoints(this.position, ball2.position);
            const angle = util.angleBetween2DVector(this.velocity.vX, this.velocity.vY, centerToCenter[0], centerToCenter[1]) || 0;
            return angle <= 90;
        }
        return false;
    }
    ballBounce(ball2) {
        if (this.selected || ball2.selected)
            return;
        if (this.checkBallCollision(ball2)) {
            const modifierY = 0.95;
            const modifierX = 1;
            const velocity1 = util.getBallCollisionVelocity(this, ball2);
            const velocity2 = util.getBallCollisionVelocity(ball2, this);
            velocity1.vX *= modifierX;
            velocity1.vY *= modifierY;
            velocity2.vX *= modifierX;
            velocity2.vY *= modifierY;
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
        return [destination.x - origin.x, destination.y - origin.y];
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
        const canvas = document.createElement('canvas');
        canvas.height = image.height;
        canvas.width = image.width;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const wRatio = image.width / targetSize.w;
        const hRatio = image.height / targetSize.h;
        const steps = Math.ceil(Math.log(wRatio >= hRatio ? hRatio : wRatio) / Math.log(2));
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
        canvas2.width = targetSize.w;
        canvas2.height = targetSize.h;
        ctx2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
        return canvas2;
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
    const imageFiles = ["me.jpeg", "grumpy.webp", "smileface.webp", "spongebob.webp", "pepper.png"];
    const imageUrls = [];
    const path = "images/";
    return imageFiles.map(img => path + img).concat(imageUrls);
})();
let imageCache = [];
function addImage(imgSrc, imgArr, radius) {
    const classList = ['img-thumb', 'grayscale'];
    const imgContainer = document.getElementById('img-container');
    const loadingPlaceholder = document.createElement('img');
    loadingPlaceholder.classList.add('img-thumb');
    loadingPlaceholder.src = 'images/spinner.gif';
    imgContainer === null || imgContainer === void 0 ? void 0 : imgContainer.appendChild(loadingPlaceholder);
    return util.createCircleImg(imgSrc, radius)
        .then(bitmapImg => {
        const index = imgArr.push(bitmapImg) - 1;
        return createImgEleWithIndex(imgSrc, index, classList);
    })
        .then(imgEle => {
        if (imgContainer === null)
            throw new Error('image container is null');
        appendImgElemToContainer(imgEle, imgContainer, loadingPlaceholder);
    })
        .catch(err => {
        imgContainer === null || imgContainer === void 0 ? void 0 : imgContainer.removeChild(loadingPlaceholder);
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
function createImgEleWithIndex(src, imgIndex, classList) {
    const imgEle = document.createElement('img');
    imgEle.classList.add(...classList);
    imgEle.onclick = ({ target }) => { toggleSelectedImgElement(target); };
    imgEle.setAttribute('data-index', imgIndex + '');
    imgEle.onload = () => {
        URL.revokeObjectURL(src);
    };
    imgEle.src = src;
    return imgEle;
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
const appProps = {
    count: 0,
    radiusSizes: { s: 20, m: 35, l: 50, current: 50 },
    screenBreakPoints: { l: 1280, m: 768 },
    gravity: { value: 0.01, isOn: false },
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
    overlapThreshold: 0.05,
    wallModifiers: { left: 1.1, right: 1.1, top: 1, bottom: 1.8 },
    currentTime: 0,
    selectedTime: 0,
    deceleration: 0.995,
    canvas: document.getElementById('canvas'),
    canvasHorizontalGap: 5 * 2,
    canvasTopOffset: 70,
    party: { active: false, start: 0, duration: 10, gravity: true },
    rainBow: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
};
(function init() {
    addEventListeners();
    appProps.canvas.width = window.innerWidth - appProps.canvasHorizontalGap;
    appProps.canvas.height = window.innerHeight - appProps.canvasTopOffset;
    setSizes();
    appProps.canvas.width = 300;
    Promise.all(imageList.map(img => addImage(img, imageCache, 50))).then(_ => {
        appProps.currentTime = new Date().getTime();
        draw();
    });
})();
function addEventListeners() {
    var _a;
    window.onresize = () => {
        setSizes();
    };
    appProps.canvas.addEventListener('pointerdown', onMouseDown);
    appProps.canvas.addEventListener('pointermove', onMouseMove);
    appProps.canvas.addEventListener('pointerup', onMouseUp);
    appProps.canvas.addEventListener('pointerleave', onMouseLeave);
    (_a = document.getElementById('gravity-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function toggleGravity() {
        appProps.gravity.isOn = !appProps.gravity.isOn;
    });
}
function setSizes() {
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
function createAndStoreBall(imgEle, x, y, radius = appProps.radiusSizes.current, selected = false) {
    try {
        const imgIndex = Number(imgEle.dataset['index']);
        const ball = new Ball(imageCache[imgIndex], x, y, radius, selected);
        appProps.balls.push(ball);
        appProps.count++;
        return ball;
    }
    catch (err) {
        console.error(err);
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
        updateBall(ball, ellapsedTime);
    });
    fixBallCollisions(appProps.balls);
    appProps.balls.forEach(ball => {
        if (!ball.selected) {
            ball.rotation += calcBallRotation(ball, 0);
        }
    });
    drawBall(ctx, appProps.selectedBall);
    window.requestAnimationFrame(() => { draw(); });
}
function updateBall(ball, ellapsedTime) {
    let { position, selected, velocity } = ball;
    if (!selected) {
        ball.prevPosition = Object.assign({}, position);
        const halfGravity = appProps.gravity.value / 2;
        if (Math.abs(ball.velocity.vX) < halfGravity)
            ball.velocity.vX = 0;
        if (Math.abs(ball.velocity.vY) < halfGravity)
            ball.velocity.vY = 0;
        appProps.gravity.isOn && (velocity.vY += appProps.gravity.value);
        const distX = velocity.vX * ellapsedTime;
        position.x += distX;
        position.y += velocity.vY * ellapsedTime;
        velocity.vX *= appProps.deceleration;
        if (ball.prevPosition.x === ball.position.x)
            ball.velocity.vX = 0;
        if (ball.prevPosition.y === ball.position.y)
            ball.velocity.vY = 0;
        handleBallCollissions(ball);
        handleWallCollissions(ball);
    }
}
function handleBallCollissions(ball) {
    let collisions = [];
    appProps.balls.forEach(ball2 => {
        if (ball.id !== ball2.id && !ball2.selected) {
            if (ball.getOverlap(ball2) > appProps.overlapThreshold)
                collisions.push(ball2);
        }
    });
    if (collisions.length > 0) {
        collisions.sort((a, b) => {
            const distA = util.distanceBetween2Points(ball.position, a.position);
            const distB = util.distanceBetween2Points(ball.position, b.position);
            return distA - distB;
        });
        ball.reversePosition(ball.getOverlap(collisions[0]));
        ball.ballBounce(collisions[0]);
    }
    collisions = [];
}
function handleWallCollissions(ball) {
    const { position, radius, velocity } = ball;
    const { canvas, wallModifiers } = appProps;
    if (position.x + radius > canvas.width) {
        position.x = canvas.width - radius;
        velocity.vX < 0 || (ball.velocity.vX *= -1 / wallModifiers['right']);
    }
    if (position.x - radius < 0) {
        position.x = radius;
        velocity.vX > 0 || (ball.velocity.vX *= -1 / wallModifiers['left']);
    }
    if (position.y + radius > canvas.height) {
        position.y = canvas.height - radius;
        velocity.vY < 0 || (ball.velocity.vY *= -1 / wallModifiers['bottom']);
        if (Math.abs(velocity.vY) < 0.05)
            velocity.vY = 0;
    }
    if (position.y - radius < 0) {
        position.y = radius;
        velocity.vY > 0 || (ball.velocity.vY *= -1 / wallModifiers['top']);
    }
}
function sortBalls(balls) {
    let sortedBallList = [];
    balls.forEach(ball => {
        let listPosition = sortedBallList.findIndex(ball2 => {
            if (ball.position.y > ball2.position.y)
                return true;
            if (ball.position.y === ball2.position.y && ball.position.x < ball2.position.x)
                return true;
            return false;
        });
        listPosition === -1 ? sortedBallList.push(ball) : sortedBallList.splice(listPosition, 0, ball);
    });
    return sortedBallList;
}
function fixBallCollisions(balls) {
    let sortedBallList = sortBalls(balls);
    sortedBallList.forEach(ball => {
        !ball.selected && sortedBallList.forEach(ball2 => {
            if (ball2.selected)
                return;
            const overlap = ball.getOverlap(ball2);
            const distInY = ball.position.y - ball2.position.y;
            if (ball.id !== ball2.id && overlap > 0.03) {
                const [x, y] = util.xyDiffBetweenPoints(ball.position, ball2.position);
                const total = Math.abs(x) + Math.abs(y);
                const xRatio = (x / total) * overlap;
                const yRatio = (y / total) * overlap;
                if (distInY === 0) {
                    ball.position.x -= 0.5 * overlap;
                    ball2.position.x += 0.5 * overlap;
                }
                else if (distInY > 0) {
                    ball2.position.x += xRatio;
                    ball2.position.y += yRatio;
                }
                else {
                    ball.position.x += xRatio;
                    ball.position.y += yRatio;
                }
            }
        });
    });
}
function drawBall(ctx, ball) {
    if (ball === null)
        return;
    const { position, radius, selected, rotation, img } = ball;
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.rotate(Math.PI / 180 * rotation);
    ctx.drawImage(img, -radius, -radius, radius * 2, radius * 2);
    if (selected) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'cyan';
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();
}
function calcBallRotation(ball, distance) {
    const parameter = 2 * Math.PI * ball.radius;
    const dist = ball.position.x - ball.prevPosition.x;
    const rotation = dist / parameter;
    return rotation * 360;
}
function getRelativeMousePos(evt) {
    const boundingRect = evt.target.getBoundingClientRect();
    return [evt.clientX - boundingRect.x, evt.clientY - boundingRect.y];
}
function onMouseDown(evt) {
    if (evt.button !== 0)
        return;
    const [x, y] = getRelativeMousePos(evt);
    if (appProps.selectedImgEle) {
        appProps.selectedBall = createAndStoreBall(appProps.selectedImgEle, x, y) || null;
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
        const [moveX, moveY] = util.xyDiffBetweenPoints(appProps.selectedPositions.current, { x, y });
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
        try {
            const [x, y] = getRelativeMousePos(evt);
            const [distX, distY] = util.xyDiffBetweenPoints(appProps.selectedPositions.reference, { x, y });
            const ellapsedTime = new Date().getTime() - appProps.selectedTime;
            appProps.selectedBall.velocity.vX = distX / ellapsedTime;
            appProps.selectedBall.velocity.vY = distY / ellapsedTime;
        }
        catch (err) {
            appProps.selectedBall.position = { x: 50, y: 50 };
            console.error(err);
        }
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
var _a, _b, _c, _d;
const imageUploadModal = {
    modal: document.getElementById('modal'),
    overlay: document.getElementById('modal-overlay'),
    openButton: document.getElementById('image-upload-btn'),
    toggle: () => {
        var _a, _b;
        (_a = imageUploadModal.modal) === null || _a === void 0 ? void 0 : _a.classList.toggle('close');
        (_b = imageUploadModal.overlay) === null || _b === void 0 ? void 0 : _b.classList.toggle('close');
    }
};
const imageForm = {
    form: document.getElementById('image-upload-form'),
    okButton: document.getElementById('form-ok-btn'),
    imgFileInput: document.getElementById('img-file'),
    imgURLInput: document.getElementById('img-URL'),
    imgFileDisplay: document.getElementById('file-name'),
    imgFileDisplayButton: document.getElementById('upload-button'),
    cancelButton: document.getElementById('form-cancel-btn'),
    handleFileDisplayClick: (evt) => {
        evt.preventDefault();
        imageForm.imgFileInput.click();
    },
    handleFileChange: () => {
        var _a, _b;
        imageForm.imgFileDisplay.value = ((_b = (_a = imageForm.imgFileInput.files) === null || _a === void 0 ? void 0 : _a.item(0)) === null || _b === void 0 ? void 0 : _b.name) || 'No Image Selected';
    },
    handleSubmit: (evt) => {
        var _a;
        evt.preventDefault();
        let imgSrc = '';
        if ((_a = imageForm.imgFileInput.files) === null || _a === void 0 ? void 0 : _a.item(0)) {
            try {
                imgSrc = URL.createObjectURL(imageForm.imgFileInput.files[0]);
            }
            catch (e) {
                console.error(e);
            }
        }
        else {
            imgSrc = imageForm.imgURLInput.value;
        }
        addImage(imgSrc, imageCache, appProps.radiusSizes.current)
            .then(_ => {
            console.log('whatever');
            imageUploadModal.toggle();
        })
            .catch(err => {
            console.log('something');
        });
    },
    handleCancel: (evt) => {
        imageForm.imgURLInput.value = '';
        imageForm.imgFileInput.value = '';
        imageForm.imgFileDisplay.value = '';
        imageUploadModal.toggle();
    }
};
(_a = imageUploadModal.overlay) === null || _a === void 0 ? void 0 : _a.addEventListener('click', imageUploadModal.toggle);
(_b = imageUploadModal.openButton) === null || _b === void 0 ? void 0 : _b.addEventListener('click', imageUploadModal.toggle);
(_c = imageForm.form) === null || _c === void 0 ? void 0 : _c.addEventListener('submit', imageForm.handleSubmit);
imageForm.imgFileDisplayButton.addEventListener('click', imageForm.handleFileDisplayClick);
imageForm.imgFileInput.addEventListener('change', imageForm.handleFileChange);
(_d = imageForm.cancelButton) === null || _d === void 0 ? void 0 : _d.addEventListener('click', imageForm.handleCancel);
