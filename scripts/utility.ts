const util = (function utilityFunctions() {


  /**
   * returns the new velocity of object1 after collision with object2
   * https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional_collision_with_two_moving_objects
   * @param x1 x center object1
   * @param y1 y center object1
   * @param vx1 x velocity object1
   * @param vy1 y velocity object1
   * @param x2 x center object2
   * @param y2 y center object2
   * @param vx2 x velocity object2
   * @param vy2 y veloicity object2
   * @param mass1 mass object1
   * @param mass2 mass object2
   */
  function calculateCollisionVelocity(
    x1: number, y1: number,
    vx1: number, vy1: number,
    x2: number, y2: number,
    vx2: number, vy2: number,
    mass1?: number, mass2?: number
  ): Velocity {
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
    return { vX: newVx, vY: newVy };
  }

  /**
   * returns the velocity of ball1 after colliding with ball2.
   */
  function getBallCollisionVelocity(ball1: Ball, ball2: Ball) {
    return calculateCollisionVelocity(ball1.position.x, ball1.position.y, ball1.velocity.vX, ball1.velocity.vY,
      ball2.position.x, ball2.position.y, ball2.velocity.vX, ball2.velocity.vY);
  }
  /**
   * returns the difference between x and y axis of two points
   * from origin to destination
   */
  function xyDiffBetweenPoints(origin: Point, destination: Point): [number, number] {
    return [origin.x - destination.x, origin.y - destination.y];
  }

  /**
   * Draw an image to a temp HTMLCanvas element
   * crop image to circle with globalCompositeOperation = 'destination-in'
   * returns a promise that resolves to an bitmap of the canvas picture.
   * @param imgScr image src
   * @param radius radius of the circle
   * @param outlineColour the outline colour of the circle
   */
  function createCircleImg(imgScr: string, radius: number, outlineColour: string = 'white', outlineSize: number = 3): Promise<ImageBitmap> {
    return new Promise((resolve, reject) => {
      const tempCanvas = document.createElement('canvas');
      const diameter = radius * 2;
      tempCanvas.width = diameter;
      tempCanvas.height = diameter;
      const image = document.createElement('img');
      image.src = imgScr;
      image.onload = () => {
        //Calculate width and height of image in proportion to canvas size 
        //so the new image doesn't look distorted.
        const wRatio = image.width / diameter;
        const hRatio = image.height / diameter;
        wRatio >= hRatio ? tempCanvas.width = Math.floor(image.width / hRatio) : tempCanvas.height = Math.floor(image.height / wRatio);

        const adjustedImage = stepDownImage(image, { w: diameter, h: diameter });

        const ctx = tempCanvas.getContext('2d');
        if (ctx === null) throw new Error('context2D is null');
        ctx.drawImage(adjustedImage, 0, 0, tempCanvas.width, tempCanvas.height);
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
      }
      image.onerror = reject
    })
  }

  /**
   * Downscale an image in incremental steps using 2 HTMLcanvas by halving
   * the size of the image each time for better results.
   */
  function stepDownImage(image: HTMLImageElement, targetSize: { w: number, h: number }): HTMLCanvasElement {
    const wRatio = image.width / targetSize.w;
    const hRatio = image.height / targetSize.h;
    const steps = Math.ceil(Math.log(wRatio >= hRatio ? hRatio : wRatio) / Math.log(2))

    const canvas = document.createElement('canvas');
    canvas.height = image.height;
    canvas.width = image.width;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    if (steps > 1) {
      const canvas2 = document.createElement('canvas');
      const ctx2 = canvas2.getContext('2d')!;
      for (let i = 1; i < steps; i++) {
        canvas2.width = canvas.width / 2;
        canvas2.height = canvas.height / 2;
        ctx2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
        canvas.width = canvas2.width;
        canvas.height = canvas2.height;
        ctx.drawImage(canvas2, 0, 0);
      }
    }

    return canvas;
  }

  /**
   * Use HTMLCanvasElement.toBlob to convert a bitmap to a blob with a different mime type.
   * CORS problems from canvas if using images from different domain.
   * @param image the input bitmap
   * @param mimeType the mimeType for the blob, default image/png
   */
  function convertBmpToBlob(image: ImageBitmap, mimeType: string = 'image/png'): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('bitmaprenderer');
      if (ctx) {
        ctx.transferFromImageBitmap(image);
      } else {
        canvas.getContext('2d')?.drawImage(image, 0, 0);
      }
      canvas.toBlob(function blobCallback(blob) {
        if (blob === null) reject('Blob is null');
        resolve(blob);
      })
    })
  }

  function distanceBetween2Points(point1: Point, point2: Point): number {
    const [diffX, diffY] = xyDiffBetweenPoints(point1, point2);
    return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
  }

  function angleBetween2DVector(vx1: number, vy1: number, vx2: number, vy2: number): number {

    const dotProduct = (vx1 * vx2) + (vy1 * vy2);
    const magnitude1 = Math.sqrt(Math.pow(vx1, 2) + Math.pow(vy1, 2));
    const magnitude2 = Math.sqrt(Math.pow(vx2, 2) + Math.pow(vy2, 2));
    return Math.acos(dotProduct / (magnitude1 * magnitude2)) * (180 / Math.PI);
  }

  function angleBetween3Points(start: Point, mid: Point, end: Point): number {
    return angleBetween2DVector(mid.x - start.x, mid.y - start.y, end.x - mid.x, end.y - mid.y);
  }

  return {
    calculateCollisionVelocity,
    createCircleImg,
    convertBmpToBlob,
    getBallCollisionVelocity,
    xyDiffBetweenPoints,
    angleBetween2DVector,
    angleBetween3Points,
    distanceBetween2Points
  };
})();