let initialId = 1;
class Ball {
  readonly id: number;
  x: number;
  y: number;
  radius: number;
  rotation: number;
  velocity: { vX: number, vY: number };
  selected: boolean;
  img: string;

  constructor() {
    this.id = initialId;
    initialId++;
  }

}