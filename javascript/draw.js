// create the working canvas
var canvas;
var oldCanvas;
var links;
var img;

function setup() {
  // default values until server update comes in
  img = loadImage("");
  links = [];

  messenger.send("canvasRequest", "canvas is ready");
  messenger.on("canvasReply", (event, arg) => {
    console.log("canvas got the reply!");
    // arg contains the current canvas
    console.log(arg);

    oldCanvas = arg;
    links = oldCanvas.links;

    createCanvas(oldCanvas.width, oldCanvas.height);
    canvas = document.getElementById("defaultCanvas0");

    img = loadImage(oldCanvas.image);

    document.getElementById("content").appendChild(canvas);
  });
}

function draw() {
  image(img, 0, 0);

  for(var i = 0; i < links.length; i++) {
    ellipse(links[i].x, links[i].y, links[i].radius);
  }
}
