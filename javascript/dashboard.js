// create a means of communication with the server
var messenger = require("electron").ipcRenderer;

// request from server an object containing list of SketchAreas
messenger.send("dashboardRequest", "dashboard ready");
messenger.on("dashboardReply", (event, arg) => {
  // arg contains the data json file
  for(var i = 0; i < arg.size; i++) {
    var tempCanvas = document.createElement("div");

    // add the canvas to the dashboard
    tempCanvas.className = "canvas";
    tempCanvas.innerHTML = "<img src= '" + arg.SketchAreas[i].canvases[0].image + "' />";

    // assign a task for when the element is clicked
    // when clicked, tell server to go to the ith sketcharea
    var index = i;
    tempCanvas.onclick = function() {
      // (defined later)
      select(index);
    };

    // actually add the thing
    document.getElementById("content").appendChild(tempCanvas);
  }
});

// send the server a click on a particular SketchArea
function select(index) {
  messenger.send("dashboardSelect", index);
}
