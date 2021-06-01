
let balls: Ball[] = new Array(10).fill(0).map(_ => new Ball(0, 0, 10, ''))
console.log("balls", balls)
balls.forEach(ball => console.log(ball.id));