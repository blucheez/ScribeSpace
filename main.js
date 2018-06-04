// app functionality
var electron = require("electron");
var app = electron.app;
var browserwindow = electron.BrowserWindow;
var messenger = electron.ipcMain;
var fs = require("fs");

// information about current view
var data;
// accessible SketchArea for the canvas to know what to display
let currentSketchArea;
// stores which canvas to display
var index = -1;
// accessible context for current window
let win;


function openWindow () {
  // Create the browser window.
  win = new browserwindow({width: 800, height: 600});
  // and load the index.html of the app.
  win.loadFile("dashboard.html");
}

app.on('ready', openWindow);

messenger.on("dashboardRequest", (event, arg) => {
  console.log(arg);
  // if we have a data json, we will give them it, otherwise undefined
  try {
    data = require("./data.json");
  } catch (err) {
    console.log("No data.json file present");
  }
  // we will give the dashboard the data.json file
  event.sender.send("dashboardReply", data);
});

messenger.on("dashboardSelect", (event, arg) => {
  console.log("I received an instruction to go to " + arg);

  // now point to an actual canvas
  index = 0;

  // update currentSketchArea
  currentSketchArea = data.SketchAreas[arg];

  // now load the canvas file
  win.loadFile("canvas.html");
});

// tell the canvas what is going on
messenger.on("canvasRequest", (event, arg) => {
  console.log(arg);
  event.sender.send("canvasReply", currentSketchArea.canvases[index]);
});

messenger.on("canvasUpdate", (event, arg) => {
  currentSketchArea.canvases[index] = arg;
  data.SketchAreas[arg] = currentSketchArea;
  refreshData();
  event.sender.send("confirmation", "canvas update recorded");
});

messenger.on("changeCanvas", (event, arg) => {
  index = arg;
  console.log("The new index will be " + index);
  if(index < 0) {
    console.log("going home");
    win.loadFile("dashboard.html");
  } else {
    console.log("going to " + index);
    win.loadFile("canvas.html");
  }
  event.sender.send("confirmation", "changing canvas to " + arg);
});

messenger.on("addCanvas", (event, arg, message) => {
  console.log("I receieved a arg from link #" + message);
  var i = currentSketchArea.canvases.length;
  arg.index = i;
  currentSketchArea.canvases.push(arg);
  console.log("now I will tell link #" + message + " to be addressed to " + i);
  event.sender.send("newAddr", i, message);
});

messenger.on("addSketchArea", (event, arg) => {
  if(data === undefined) {
    data = {
      "size" : 0,
      "SketchAreas" : []
    }
  }
  data.SketchAreas.push(arg);
  data.size++;
  refreshData();
  console.log("added" + arg.name);
  win.loadFile("dashboard.html");
});

messenger.on("deleteSketchArea", (event, arg) => {
  data.SketchAreas.splice(arg, 1);
  data.size--;
  console.log("deleted " + arg);
  win.loadFile("dashboard.html");
});

messenger.on("goHome", (event, arg) => {
  index = -1;
  win.loadFile("dashboard.html");
});

function refreshData() {
  fs.writeFile("data.json", JSON.stringify(data), (err) => {
    if(err) {
      console.log(err);
      throw err;
    }
    console.log("updated data");
  });
}
