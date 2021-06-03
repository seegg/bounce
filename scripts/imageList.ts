function getImageList(): string[] {
  const path = "images/";
  const imageList = [
    "me.jpeg"
  ];
  return imageList.map(img => path + img);
}