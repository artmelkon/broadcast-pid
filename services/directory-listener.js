const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");

const {
  start_doAction,
  start_triggerAction,
  setMarker1,
  setMarker0,
} = require("./doaction-functions");
const moveAsset = require("../controllers/move-asset-to-queue");
const { sortFiles } = require("./functions-lib");
const listen_queue = require("../controllers/listen-queue");

const regEx = {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  usePolling: true,
  awaitWriteFinish: {
    stabilityThreshold: 1000,
    pollInterval: 100,
  },
};

const launchListener = function (rootObj) {
  // listen_outputChooser(rootObj.chooser);
  listen_queue(rootObj.queue, regEx);
};

async function listen_outputChooser(selectedDir) {
  const assetChooser = await chokidar.watch(selectedDir, regEx);
  assetChooser
    .on("add", (file) => {
      console.log(`File ${file} has been added`);
      sortFiles(file, selectedDir, moveAsset);
    })
    .on("unlink", (dir) => console.log(`${dir} has been deleted`));
}

module.exports = launchListener;
