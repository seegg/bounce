class Ball {
  readonly id: number;
  private static baseId = 1;
  position: { x: number, y: number }
  radius: number;
  rotation: number;
  velocity: { vX: number, vY: number };
  selected: boolean;
  collided: number[];
  // The img associated with an instance of Ball
  img: ImageBitmap;

  constructor(img: ImageBitmap, x: number, y: number, r: number, selected: boolean = false) {
    this.id = Ball.baseId;
    this.position = { x, y }
    this.radius = r;
    this.rotation = 0;
    this.velocity = { vX: 0, vY: 0 }
    this.img = img;
    this.selected = selected;
    this.collided = [this.id];
    Ball.baseId++;
  }

  // Update the position of the ball after every frame
  updatePosition(gravity: number, deceleration: number,): void {

  }

  reverseDistance(distance: number): void {

  }

  resetCollided(): void {
    this.collided = [this.id]
  }

}