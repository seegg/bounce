const util = {
  calculateCollisionVelocity
};

/**
 * returns the new velocity of object1 after collision with object2
 * https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional_collision_with_two_moving_objects
 * @param x1 x center object1
 * @param y1 y center object1
 * @param x2 x center object2
 * @param y2 y center object2
 * @param vx1 x velocity object1
 * @param vy1 y velocity object1
 * @param vx2 x velocity object2
 * @param vy2 y veloicity object2
 * @param mass1 mass object1
 * @param mass2 mass object2
 */
function calculateCollisionVelocity(x1: number, y1: number, x2: number, y2: number, vx1: number, vy1: number, vx2: number, vy2: number, mass1?: number, mass2?: number): [number, number] {
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
  return [newVx, newVy]
}