// create line of communication
var messenger = require("electron").ipcRenderer;

// when the user saves, send an update to the server
// takes in an array of links
function update(links) {
  // get the correct toDataURL
  var tempCanvas = document.createElement("canvas");
  tempCanvas.height = oldCanvas.height;
  tempCanvas.width = oldCanvas.width;
  var tempImg = document.createElement("img");
  tempImg.src = canvas.toDataURL();

  var ctx = tempCanvas.getContext("2d");
  tempImg.onload = function() {
    ctx.drawImage(tempImg,0,0, oldCanvas.width, oldCanvas.height);

    // the server needs to know which canvas to update
    // the server already knows which canvas, it is the currentSketchArea
    // it just needs the new image and link array
    var toSend = {
      "height" : oldCanvas.height,
      "width" : oldCanvas.width,
      "image" : tempCanvas.toDataURL(),
      "links" : links
    }

    messenger.send("canvasUpdate", toSend);
  }
}

// change the current canvas to a different one
// this happens when a link is pressed
function changeTo(address) {
  messenger.send("changeCanvas", address);
}

// add a new canvas
// return the address of this new canvas
function addCanvas() {
  var toAdd = {
    "height" : oldCanvas.height,
    "width" : oldCanvas.width,
    "image" : "",
    "links" : []
  }
  messenger.send("addCanvas", toAdd);
  messenger.on("newAddr", (event, arg) => {
    return arg;
  });
}

messenger.on("confirmation", (event, arg) => {
  console.log(arg);
});

// request a return to the dashboard
function goHome() {
  messenger.send("goHome", "request to go home");
}
