var initialBallId = 1;
var Ball = /** @class */ (function () {
    function Ball(x, y, r, imgSrc, selected) {
        if (selected === void 0) { selected = false; }
        this.id = initialBallId;
        initialBallId++;
        this.x = x;
        this.y = y;
        this.radius = r;
        this.img = imgSrc;
        this.selected = selected;
    }
    // Update the position of the ball after every frame
    Ball.prototype.updatePosition = function (gravity, deceleration) {
    };
    Ball.prototype.reverseDirection = function (distance) {
    };
    return Ball;
}());
function sayHello(name) {
    console.log('hello', name + '!');
}
var testBall = {
    hello: sayHello
};
