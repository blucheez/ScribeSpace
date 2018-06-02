// app functionality
var electron = require("electron");
var app = electron.app;
var browserwindow = electron.BrowserWindow;
var messenger = electron.ipcMain;

// information about current view
var data = require("./data.json");
// accessible SketchArea for the canvas to know what to display
let currentSketchArea;
// stores which canvas to display
var index = 0;
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
  // we will give the dashboard the data.json file
  event.sender.send("dashboardReply", data);
});

messenger.on("dashboardSelect", (event, arg) => {
  console.log("I received an instruction to go to " + arg);

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
  event.sender.send("confirmation", "canvas update recorded");
});

messenger.on("changeCanvas", (event, arg) => {
  index = arg;
  win.loadFile("canvas.html");
  event.sender.send("confirmation", "changing canvas to " + arg);
});

messenger.on("addCanvas", (event, arg) => {
  var i = currentSketchArea.canvases.length;
  currentSketchArea.canvases.push(arg);
  event.sender.send("newAddr", i);
});
