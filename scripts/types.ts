type Point = { x: number, y: number };
type MouseClickCallback = (e: MouseEvent) => any;
type Wall = 'top' | 'bottom' | 'left' | 'right';
type Velocity = { vX: number, vY: number };
type Circle = Point & { r: number };