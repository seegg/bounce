let initialId = 1;
class Ball {
  readonly id: number;
  x: number;
  y: number;
  radius: number;
  rotation: number;
  velocity: { vX: number, vY: number };
  selected: boolean;
  // The img associated with an instance of Ball
  img: string;

  constructor(x: number, y: number, r: number, imgSrc: string, selected: boolean = false) {
    this.id = initialId;
    initialId++;
    this.x = x;
    this.y = y;
    this.radius = r;
    this.img = imgSrc;
    this.selected = selected;
  }

  // Update the position of the ball after every frame
  updatePosition(gravity: number, deceleration: number,): void {

  }

  reverseDirection(distance: number) {

  }

}