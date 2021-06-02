let initialBallId = 1;
class Ball {
  readonly id: number;
  position: { x: number, y: number }
  radius: number;
  rotation: number;
  velocity: { vX: number, vY: number };
  selected: boolean;
  collided: number[];
  // The img associated with an instance of Ball
  img: string;

  constructor(x: number, y: number, r: number, imgSrc: string, selected: boolean = false) {
    this.id = initialBallId;
    initialBallId++;
    this.position = { x, y }
    this.radius = r;
    this.rotation = 0;
    this.velocity = { vX: 0, vY: 0 }
    this.img = imgSrc;
    this.selected = selected;
    this.collided = [this.id];
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