const imageFiles = <string[]>["me.jpeg", "grumpy.webp", "smileface.webp", "spongebob.webp"];
const imageUrls = <string[]>[];

function getImageList(): string[] {
  const path = "images/";
  return imageFiles.map(img => path + img).concat(imageUrls);
}