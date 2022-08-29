const path = require("path");
const _ = require("lodash");
const jsonfile = require("jsonfile");

const {
  qrcode,
  timeStamp,
  assignedJson,
} = require("../services/functions-lib");
const { sign } = require("crypto");

const assetJsonGenerator = async (assetFile, assetOut) => {
  const replaceChooser = _.replace(
    assetOut,
    "01_outputChooser",
    "01_outputChooserParallel"
  );
  const pathRegEx = /^\/(.+)\//g;
  const parallelPath = pathRegEx.exec(replaceChooser)[0];
  const directiveRip_path = parallelPath + "_ripDirective_DNA.json";
  const assetId = assetFile.split(".").shift();
  const assetType = assetFile.split(".").pop();
  const originalTStamp = timeStamp();
  const orignialTStampHex = Number(originalTStamp).toString(16); // hex timestampp
  const orignialTStampBase36 = Number(originalTStamp).toString(36); // base-36 timesstampl
  const retainedObj = {
    parallelPath,
    directiveRip_path,
    assetId,
    originalTStamp,
    orignialTStampHex,
    orignialTStampBase36,
  };

  /* validate if file exists and write to metadata json */
  try {
    let assetJsonPath =
      process.env.ENGINE_ROOT + `/04_metadata/${assetId}.json`;
    jsonfile.writeFileSync(assetJsonPath, assignedJson(retainedObj));
    // return qrcode.qrcodeImg({ base36: orignialTStampBase36, assetId: assetId };  }
  } catch (err) {
    console.log(err);
  }
};

module.exports = assetJsonGenerator;
