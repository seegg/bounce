export type Point = { x: number, y: number };
export type MouseClickCallback = (e: MouseEvent) => any;
export type Wall = 'top' | 'bottom' | 'left' | 'right';
export type Velocity = { vX: number, vY: number };
export type Circle = Point & { r: number };