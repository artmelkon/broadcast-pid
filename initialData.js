const path = require('path');

const dbInit = {
  portal: process.env.DB_PORTAL,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  db: process.env.DB_NAME,
};
const { portal, user, pass, host, db } = dbInit;
exports.dbUri = () => {
  const uri = `${portal}://${user}:${pass}@${host}/${db}`;
  return uri;
}

exports.rootObj = () => {
  return {
    chooser: path.join(process.env.DD_ROOT, process.env.CHOOSER),
    queue: path.join(process.env.DD_ROOT, process.env.QUEUE),
  // triggerDir: "/Users/Shared/dd_color_engine/04_metadata",
}};

