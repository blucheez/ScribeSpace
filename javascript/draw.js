// create the working canvas
var canvas;
// reference to data from the old canvas
var oldCanvas;
// array of links, with locations and addresses
var links;
// the old background image
var img;
// stores in String the "state" of the canvas
// view, draw, text, erase, link
var mode;
// record thickness desired
var thickness = 10;

function changeMode(str) {
  mode = str;
  if(str === "draw") {
    cursor(CROSS);
  } else {
    cursor(ARROW);
  }
  if(str === "view") {
    update(links);
  }
  console.log("Mode is " + mode);
}

function setup() {
  // default values until server update comes in
  img = loadImage("");
  links = [];
  mode = "view";

  // send a request to the server to get preliminary information
  messenger.send("canvasRequest", "canvas is ready");
  messenger.on("canvasReply", (event, arg) => {
    // arg contains the current canvas
    oldCanvas = arg;
    links = oldCanvas.links;

    createCanvas(oldCanvas.width, oldCanvas.height);
    canvas = document.getElementById("defaultCanvas0");

    img = loadImage(oldCanvas.image);

    document.getElementById("content").appendChild(canvas);
  });
}

function draw() {
  // draw the image in the background
  image(img, 0, 0);

  // draw the links
  if(mode === "link") {
    for(var i = 0; i < links.length; i++) {
      strokeWeight(1);
      fill(255);
      stroke(0);
      ellipse(links[i].x, links[i].y, links[i].radius);
    }
  }

}

function mouseDragged() {
  if(mode === "draw") {
    strokeWeight(thickness);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function touchMoved() {
  if(mode === "draw") {
    strokeWeight(thickness);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function touchStarted() {
  if(mode === "draw") {
    fill(0);
    ellipse(mouseX, mouseY, thickness, thickness);
  }
}
