const fs = require('fs');
const path = require('path');

const getAllFiles = (holdingBay, fileListArr) => {
  fileList = fs.readdirSync(holdingBay);
  // console.log('fileList ', fileList)
  fileList = fileList.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));

  fileListArr = fileListArr || [];
  fileList.forEach( file => {
    if(fs.statSync(holdingBay + '/' + file).isDirectory()) {
      fileListArr = getAllFiles(holdingBay + '/' + file, fileListArr);
    } else {
      fileListArr.push(path.join(holdingBay, '/', file));
    }
  });

  return fileListArr;
}

module.exports = getAllFiles;

