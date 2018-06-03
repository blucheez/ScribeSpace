// create a means of communication with the server
var messenger = require("electron").ipcRenderer;

// request from server an object containing list of SketchAreas
messenger.send("dashboardRequest", "dashboard ready");
messenger.on("dashboardReply", (event, arg) => {
  // arg contains the data json file
  for(var i = 0; i < arg.size; i++) {
    console.log("creating canvas " + i);
    console.log(arg.SketchAreas[i]);
    var tempCanvas = document.createElement("div");

    // add the canvas to the dashboard
    tempCanvas.className = "canvas";
    tempCanvas.innerHTML = "<img src= '" + arg.SketchAreas[i].canvases[0].image + "' />";

    // create the buttons associated with deleting the particular canvas
    var deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.innerHTML = "Delete " + arg.SketchAreas[i].name;

    // add click triggers
    (function(index) {
      tempCanvas.onclick = function() {
        console.log("you clicked on " + index);
        messenger.send("dashboardSelect", index);
      }
      deleteButton.onclick = function() {
        console.log("DELETE" + index);
        messenger.send("deleteSketchArea", index);
      }
    })(i);
    
    // actually add the thing
    document.getElementById("content").appendChild(tempCanvas);
    document.getElementById("content").appendChild(deleteButton);
  }

  // create and add a canvas meant only for adding a new canvas
  var addCanvas = document.createElement("div");
  addCanvas.className = "canvas";
  addCanvas.id = "addCanvas";
  addCanvas.onclick = function() {
    // (also defined later)
    add();
  }
  document.getElementById("content").appendChild(addCanvas);
});

// adds a new empty SketchArea to the argument
function add() {
  console.log("ADD");
  // create an empty SketchArea with specifications
  var newSketchArea = {
    "name" : "defaultName",
    "canvases" : [
      {
        "height" : 400,
        "width" : 600,
        "image" : "",
        "links" : []
      }
    ]
  }
  messenger.send("addSketchArea", newSketchArea);
}

// delete a sketch element from the argument with the given index
function end(index) {

}
