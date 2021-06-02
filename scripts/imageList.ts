function getImageList(): string[] {
  const path = "images/";
  const imageList = [
    "me.jpeg",
    "spinner.gif"
  ];
  return imageList.map(img => path + img);
}