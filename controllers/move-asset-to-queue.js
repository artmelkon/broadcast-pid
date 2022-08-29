const fs = require("fs");
const path = require("path");
const logger = require('../utils/logger')

const assetJsonGenerator = require("./json-asset-generator");
const { validateAssetReady } = require("../services/functions-lib");

const moveAsset = (result) => {
  const queue = path.join(process.env.DD_ROOT,process.env.QUEUE);
  console.log("result move file ", result);

  const assetToBeOut = result.shift();

    const moveToQueue = (assetOut) => {
      // console.log("asset OUT ", assetOut);
      const assetFile = !assetOut ? null : path.basename(assetOut);
      is_asset = fs.readdirSync(queue);
      is_asset = is_asset.filter((item) => !/(^|\/)\.[^\/\.]/g.test(item));
      const assetCount = is_asset.length;

      if (validateAssetReady(assetCount, assetOut)) {
        setTimeout(function () {
          /* Here we will move the asset to queue in *sec interval */
          fs.rename(assetOut, path.join(queue, "/", assetFile), (err) => {
            if (err) logger.errorLogger.error(err.message, err);
            // /* here we generate asset json file */
            // assetJsonGenerator(assetFile, assetOut);
          });
        }, 3600);
      } else
      {
        return console.log('directory not empty', is_asset)
      }

    };


  /* updating byte size and pushing into an array for comparison */
  let sizeArr = [null];
  const fileSize = (size) => {
    sizeArr.splice(0, 1, size);
  };

  /* this intervale function will compare current byte size with stored byte size for progress */
  let intSize = setInterval(() => {
    const sizeStats = fs.statSync(assetToBeOut).size;
    if (sizeArr[0] === null || sizeArr[0] < sizeStats) {
      console.log(sizeArr[0], " ", sizeStats);
    } else if (sizeArr[0] > 0 && sizeArr[0] === sizeStats) {
      console.log("break point ", sizeArr[0], " ", sizeStats);
      moveToQueue(assetToBeOut);
      clearInterval(intSize);
    }

    fileSize(sizeStats);
  }, 2000);
};

module.exports = moveAsset;
