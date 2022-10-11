const path = require('path');
const chokidar = require('chokidar');

const logger = require("../utils/logger");
const { sortFiles } = require("../services/functions-lib");


async function listen_queue(selectedDir, regEx) {
  const assetQueue = await chokidar.watch(selectedDir, regEx);
  assetQueue
    .on("add", (asset) => {
      console.log(`File ${asset} has been added`);
      try {
        fs.accessSync(asset, fs.constants.F_OK);
        var fileType = path.extname(asset).slice(1).toLocaleLowerCase();

        if (fileType === "tif" || fileType === "psd" || fileType === "psb") {
          console.log("File type ", fileType.toUpperCase());

          // /** read doAction string from asset json file */
          // "/Users/Shared/dd_color_engine/04_metadata/" +
          const assetName = path.basename(asset).split(".")[0];
          console.log("base name ", assetName);
          
          var pathJson = path.join(
            process.env.DD_ROOT,
            process.env.METADATA,
            assetName,
            ".json"
          );

          console.log("metadata path", pathJson);

          // if (!fs.existsSync(pathJson)) {
          //   const error = new Error(`JSON file does not exists ${pathJson}`);
          //   loger.error(error.message);
          // }

          /** function call for embedded applescript to trigger photoshop doAction */
          start_doAction(pathJson, asset);
        }
      } catch (err) {
        logger.error(err.massage, err);
      }

      // fs.access(res, fs.constants.F_OK, (err) => {
      //   console.log(
      //     `FS access ${res} ${err ? "file does not exist" : "file exists"}`
      //   );

      //   var fileType = path.extname(res).slice(1);

      //   if (fileType === "tif" || fileType === "psd" || fileType === "psb") {
      //     console.log("File type ", fileType.toUpperCase());

      //     // /** read doAction string from asset json file */
      //     var pathJson =
      //       "/Users/Shared/dd_color_engine/04_metadata/" +
      //       path.basename(res).split(".").splice(0, 1) +
      //       ".json";
      //     // console.log('metadata path', pathJson);

      //     if (!fs.existsSync(pathJson)) {
      //       const error = new Error(`JSON file does not exists ${pathJson}`);
      //       console.log(error);
      //     }
      //     /** function call for embedded applescript to trigger photoshop doAction */
      //     start_doAction(pathJson, res);
      //   }

      //   // IF THIS FUNCTION TRIGGERS BEFORE THE CONSOLE LOG, THEN THE MESSAGE WOULD BE "file does not exist"
      //   // fs.unlinkSync(res);
      // });
      // /* the function call will copy 000_listArray directory to03_interim */
      // copyToInterim();
    })
    .on("unlink", (file) => {
      console.log(`File ${file} has been removed`);
      sortFiles(file, selectedDir, moveAsset);
      // let result = getAllFiles(
      //   process.env.CHOOSER
      // );
      // result = result
      //   .map((fileName) => {
      //     return {
      //       name: fileName,
      //       time: fs.statSync(fileName).mtime.getTime(),
      //     };
      //   })
      //   .sort((a, b) => a.time - b.time)
      //   .map((v) => v.name);

      // moveAsset(result);
    });
}

module.exports = listen_queue;