const util = {
  calculateCollisionVelocity,
  createCircleImg,
  convertBmpToBlob
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
  return [newVx, newVy];
}


/**
 * Create a cicular image bitmap from a given src
 * crop image to circle with globalCompositeOperation = 'destination-in'
 * returns a promise that resolves to the image bitmap
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
      const ctx = tempCanvas.getContext('2d');
      if (ctx === null) throw new Error('context2D is null');
      ctx.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height);
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
 * Use HTMLCanvasElement.toBlob to convert a bitmap to a blob with a different mime type.
 * Cors problems from tainted canvas.
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