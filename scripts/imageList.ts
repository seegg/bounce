const imageList = (function () {

  const imageFiles = <string[]>["me.jpeg", "grumpy.webp", "smileface.webp", "spongebob.webp"];
  const imageUrls = <string[]>[];
  const path = "images/";

  return imageFiles.map(img => path + img).concat(imageUrls);

})();