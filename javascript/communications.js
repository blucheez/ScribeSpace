// create line of communication
var messenger = require("electron").ipcRenderer;
// globally accessible buffer of next canvas to be sent
var toSend;

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
    toSend = {
      "parent" : oldCanvas.parent,
      "height" : oldCanvas.height,
      "width" : oldCanvas.width,
      "image" : tempCanvas.toDataURL(),
      "links" : links,
      "index" : oldCanvas.index
    }
    // if there are no links to add, just send an update
    if(linkQueue.length === 0) {
      messenger.send("canvasUpdate", toSend);
    }
    // update all of the links
    // linkQueue has the indices of each of the links in the links array
    while(linkQueue.length > 0) {
      var link = linkQueue.shift();
      addCanvas(link);
    }
    // 'update'
    // the final step, sending the update, has to be done after the links are
    // updated, so we pass it on to a listener
  }
}

// add a new canvas with a given link address
function addCanvas(linkAddress) {
  var toAdd = {
    "parent" : oldCanvas.index,
    "height" : oldCanvas.height,
    "width" : oldCanvas.width,
    "image" : "",
    "links" : [],
    "index" : -1
  }
  // index will be changed server side from -1 to correct value
  messenger.send("addCanvas", toAdd, linkAddress);

}
// receives message from server to change a link address
// also conveys the final update step
messenger.on("newAddr", (event, newAddr, linkIndex) => {
  links[linkIndex].address = newAddr;
  messenger.send("canvasUpdate", toSend);
});


// change the current canvas to a different one
// this happens when a link is pressed
function changeTo(address) {
  if(address === 'back') {
    messenger.send("changeCanvas", oldCanvas.parent);
  } else {
    messenger.send("changeCanvas", address);
  }
}

messenger.on("confirmation", (event, arg) => {
  console.log(arg);
});

// request a return to the dashboard
function goHome() {
  messenger.send("goHome", "request to go home");
}
