"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let initialBallId = 1;
class Ball {
    constructor(x, y, r, imgSrc, selected = false) {
        this.id = initialBallId;
        initialBallId++;
        this.position = { x, y };
        this.radius = r;
        this.rotation = 0;
        this.velocity = { vX: 0, vY: 0 };
        this.img = imgSrc;
        this.selected = selected;
        this.collided = [this.id];
    }
    updatePosition(gravity, deceleration) {
    }
    reverseDistance(distance) {
    }
    resetCollided() {
        this.collided = [this.id];
    }
}
const util = {
    calculateCollisionVelocity,
    createCircleImg,
    convertBmpToBlob
};
function calculateCollisionVelocity(x1, y1, x2, y2, vx1, vy1, vx2, vy2, mass1, mass2) {
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
    return [newVx, newVy];
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
            const ctx = tempCanvas.getContext('2d');
            if (ctx === null)
                throw new Error('context2D is null');
            ctx.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height);
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
function getImageList() {
    const path = "images/";
    const imageList = [
        "me.jpeg"
    ];
    return imageList.map(img => path + img);
}
const appProps = {
    radiusSizes: { s: 20, m: 35, l: 50 },
    imageCache: [],
};
init();
function init() {
    const imageLink = 'images/me.jpeg';
    addImage(imageLink, appProps.imageCache, appProps.radiusSizes.l, () => { console.log('hello world'); });
}
function loadInitialImages(imgSrcs) {
}
function addImage(imgSrc, imgArr, radius, callback) {
    const classList = ['img-thumb', 'h-12', 'w-12', 'rounded-full', 'filter', 'grayscale'];
    const imgContainer = document.getElementById('img-container');
    const loadingPlaceholder = document.createElement('img');
    loadingPlaceholder.src = 'images/spinner.gif';
    imgContainer === null || imgContainer === void 0 ? void 0 : imgContainer.appendChild(loadingPlaceholder);
    return createAndCacheBitmap(imgSrc, imgArr, radius)
        .then(([img, imgIdx]) => {
        return createImageEleFromBmp(img, imgIdx, classList, callback);
    })
        .then(imgEle => {
        if (imgContainer === null)
            throw new Error('image container is null');
        appendImageElemToContainer(imgEle, imgContainer, loadingPlaceholder);
    });
}
function appendImageElemToContainer(imgEle, imgContainer, loadingImg) {
    if (loadingImg) {
        imgContainer.replaceChild(imgEle, loadingImg);
    }
    else {
        imgContainer.append(imgEle);
    }
}
function createImageEleFromBmp(bmpImg, imgArrIndex, classList, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        return util.convertBmpToBlob(bmpImg)
            .then(blob => {
            const url = URL.createObjectURL(blob);
            const imgEle = document.createElement('img');
            imgEle.classList.add(...classList);
            imgEle.onclick = callback ? callback : null;
            imgEle.setAttribute('data-index', imgArrIndex + '');
            imgEle.onload = () => {
                URL.revokeObjectURL(url);
            };
            imgEle.src = url;
            return imgEle;
        });
    });
}
function createAndCacheBitmap(imgSrc, imgArr, radius) {
    return util.createCircleImg(imgSrc, radius)
        .then(image => {
        console.log(image);
        imgArr.push(image);
        return [image, imgArr.length - 1];
    });
}
