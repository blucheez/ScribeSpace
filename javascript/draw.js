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
// record radius of links
var linkRad = 25;
// buffer to hold the temporary links that haven't been saved
var linkQueue = [];

function changeMode(str) {
  mode = str;
  if(str === "draw") {
    cursor(CROSS);
  } else {
    cursor(ARROW);
  }
  if(str === "save") {
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
      ellipse(links[i].x, links[i].y, 2 * links[i].radius);
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
  if(mode === "link" && within(mouseX, mouseY, linkRad)) {
    // create a new link
    fill(255);
    stroke(0);
    strokeWeight(2);
    ellipse(mouseX, mouseY, 2 * linkRad, 2 * linkRad);
    links.push({
      "x" : mouseX,
      "y" : mouseY,
      "radius" : linkRad,
      "address" : -1
    });
    linkQueue.push(links.length - 1);
    console.log(links);
    console.log(linkQueue);
  }

  // check if clicked on a link
  if(mode === "view") {
    var x = mouseX;
    var y = mouseY;
    // pythagorean distance from center
    for (var i = 0; i < links.length; i++) {
      var link = links[i];

      var xDist = Math.pow(link.x - x, 2);
      var yDist = Math.pow(link.y - y, 2);

      if(Math.pow(link.radius, 2) > (xDist + yDist)) {
        console.log("you hit a link!");
      }

    }
  }
}

// check if point is within the canvas at a certain radius
function within(x, y, rad) {
  if (x > (width - rad)) {
    return false;
  }
  if (x < (0 + rad)) {
    return false;
  }
  if (y < (0 + rad)) {
    return false;
  }
  if (y > (height - rad)) {
    return false;
  }
  for (var i = 0; i < links.length; i++) {
    var link = links[i];

    var xDist = Math.pow(link.x - x, 2);
    var yDist = Math.pow(link.y - y, 2);

    if(Math.pow(link.radius + linkRad, 2) > (xDist + yDist)) {
      return false;
    }
  }
  return true;
}
