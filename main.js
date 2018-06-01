var electron = require("electron");
var app = electron.app;
var browserwindow = electron.BrowserWindow;
var messenger = electron.ipcMain;
var data = require("./data.json");

// accessible context for current window
let win;
// accessible SketchArea for the canvas to know what to display
let currentSketchArea;

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
  currentSketchArea = data.SketchAreas[arg].canvases[0];

  // now load the canvas file
  win.loadFile("canvas.html");
});

// tell the canvas what is going on
messenger.on("canvasRequest", (event, arg) => {
  console.log(arg);
  event.sender.send("canvasReply", currentSketchArea);
})
