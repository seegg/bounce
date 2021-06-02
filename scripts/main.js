"use strict";
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
    calculateCollisionVelocity
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
        const image = new Image();
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
const canvas = document.getElementById('canvas');
window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
