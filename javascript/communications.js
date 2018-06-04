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
      "parent" : oldCanvas.parent,
      "height" : oldCanvas.height,
      "width" : oldCanvas.width,
      "image" : tempCanvas.toDataURL(),
      "links" : links,
      "index" : oldCanvas.index
    }

    // update all of the links
    // linkQueue has the indices of each of the links in the links array
    while(linkQueue.length > 0) {
      var link = linkQueue.shift();
      addCanvas(link);
    }

    messenger.send("canvasUpdate", toSend);
  }
}

// change the current canvas to a different one
// this happens when a link is pressed
function changeTo(address) {
  if(address === 'back') {
    messenger.send("changeCanvas", oldCanvas.parent);
  } else {
    messenger.send("changeCanvas", address);
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
  console.log("I am sending the server toAdd from link #" + linkAddress);
  // for some reason, the messenger.send function sends multiple messages
  // as such, the main.js has a variable to keep track and reject duplicates
  messenger.send("addCanvas", toAdd, linkAddress);

}
// receives message from server to change a link address
messenger.on("newAddr", (event, newAddr, linkIndex) => {
  console.log("I got the memo to change link #" + linkIndex + "'s address to " + newAddr);
  links[linkIndex].address = newAddr;
  console.log(links);
});

messenger.on("confirmation", (event, arg) => {
  console.log(arg);
});

// request a return to the dashboard
function goHome() {
  messenger.send("goHome", "request to go home");
}
