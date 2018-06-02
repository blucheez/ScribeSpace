// create line of communication
var messenger = require("electron").ipcRenderer;

// when the user saves, send an update to the server
// takes in an array of links
function update(links) {
  // the server needs to know which canvas to update
  // the server already knows which canvas, it is the currentSketchArea
  // it just needs the new image and link array
  var toSend = {
    "image" : canvas.toDataURL(),
    "links" : links
  }

  messenger.send("canvasUpdate", toSend);
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
