const fse = require('fs-extra');
const path = require('path');

console.log(process.env.DD_ROOT)

exports.copyToInterim = async () => {
  try{
    await fse.copy(path.join(process.env.DD_ROOT, '000_listArray'), path.join(process.env.DD_ROOT, pricess.env.INTERIM, '000_listArray'))
    console.log('directory copied successfully!')
  } catch(err) {
    throw new Error('Something went wrong ', err.message)
  }
}