const fse = require("fs-extra");
const path = require("path");
const qr = require("qr-image");
const TinyURL = require("tinyurl");
const jsonfile = require("jsonfile");
const _ = require("lodash");
const si = require("systeminformation");

  const getAllFiles = require("../controllers/directory-array");


const createDirectoryList = (dirObj, fileListArr) => {
  try {
    fileListArr = fileListArr || [];
    const folderList = fse.readdirSync(dirObj);
    folderList.forEach(function (file) {
      const stats = fse.statSync(path.resolve(dirObj, file));
      if (stats.isDirectory()) {
        /* recursive loop drill down the directories */
        // console.log('path resolver 2 ', path.resolve(dirObj, file));
        fileListArr = createDirectoryList(
          path.resolve(dirObj, file),
          fileListArr
        );
      } else {
        /* if the file exists it will be copied and removed */
      
        fse.copySync(
          path.resolve(dirObj),
          process.env.QUARANTINE
        );
        fse.unlinkSync(path.resolve(dirObj, file));
      }
    });
  } catch (err) {
    console.error(new Error(err.message));
  }
  return createDirectoryList;
};
module.exports.directoryList = createDirectoryList;

exports.timeStamp = () => {
  /* creating timestamp string for JSON file */
  let timeStampArr = [];
  const dd = new Date();
  timeStampArr = _.concat(
    timeStampArr,
    dd.getFullYear(),
    ("0" + dd.getMonth() + 1).slice(-2),
    ("0" + dd.getDate()).slice(-2),
    ("0" + dd.getHours()).slice(-2),
    ("0" + dd.getMinutes()).slice(-2),
    ("0" + dd.getSeconds()).slice(-2),
    dd.getMilliseconds()
  );
  return _.join(timeStampArr, " ");
};

const generateQRCode = async (obj) => {
  const qrcodeDir = path.join(process.env.ENGINE_ROOT, "03_interim");
  if (!fse.existsSync(qrcodeDir)) fse.mkdirSync(qrcodeDir);

  try {
    // const qrcodeStr = process.env.GPCOLOR_URL +  + obj.base36; // needs to be updated after
    const qrcodeStr = "https://gpcolor.com/" + obj.base36;
    console.log(obj.base36);
    TinyURL.shorten(qrcodeStr)
      .then((res) => {
        return res;
      })
      .then((tinyUrl) => {
        var qr_png = qr.imageSync(tinyUrl, {
          type: "png",
          size: 30,
          margin: 1,
          parse_url: true,
        });
        fse.writeFileSync(qrcodeDir + "/qrcode.png", qr_png);
        return tinyUrl;
      })
      .then((tinyUrl) => {
        console.log("tiny url qr script", tinyUrl);
        console.log("assetId qr script", obj.assetId);
        let assetJson = `/Users/Shared/dd_color_engine/04_metadata/${obj.assetId}.json`;
        jsonfile.readFile(assetJson).then((data) => {
          const assignedJson = _.assign(data, { tinyUrl: tinyUrl });
          jsonfile.writeFileSync(assetJson, assignedJson);
        });
      });
  } catch (err) {
    return console.log(err);
  }
};
module.exports.qrcode = generateQRCode;

exports.setCPUnameEnv = async () => {
  /* capturing CPU name of the machine */
  try {
    const cpuId = await si.baseboard();
    return cpuId.serial;
  } catch (e) {
    console.log(e);
  }
};

exports.fileExists = (file) => {
  if (!fse.existsSync(file)) {
    console.log("404 - File not found");
    return false;
  }
  return true;
};

exports.validateAssetReady = (assetCount, assetOut) => {
  if (assetCount === 0 && assetOut) {
    console.log(`asset ${assetOut} does not exists and will be created`);
    return true;
  } else {
    console.log("directory 02_queue not empty");
    return false;
  }
};

exports.assignedJson = (retainedObj) => {
  const { parallelPath, assetId, assetType, directiveRip_path } = retainedObj;
  if (!fse.existsSync(directiveRip_path))
    return console.log(`${directiveRip_path} does not exists!`);
  const assetData = {
    parallelPath: parallelPath,
    assetID: assetId,
    assetType: assetType,
    cpuId: process.env.CPU_NUM,
    CPU_shortcode: process.env.CPU_SHORT,
  };
  const directiveData = jsonfile.readFileSync(directiveRip_path);
  return _.assign(assetData, directiveData);
};

exports.sortFiles = (file, dirChooser, moveAsset) => {

  if (file) {
    let selectedFile = getAllFiles(dirChooser);
    selectedFile
      .map((fileName) => {
        return {
          name: fileName,
          time: fse.statSync(fileName).mtime.getTime(),
        };
      })
      .sort((a, b) => a.time - b.time)
      .map((v) => v.name);

      console.log('Selected file ', selectedFile)

    // stage the array of dropped files to be moved to queue
    moveAsset(selectedFile);
    return;
  }
}
