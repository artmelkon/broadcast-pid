const dbInit = {
  portal: process.env.DB_PORTAL,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  db: process.env.DB_NAME,
};
const { portal, user, pass, host, db } = dbInit;
module.exports = function() {
  const uri = `${portal}://${user}:${pass}@${host}/${db}`;
  // const uri = `${portal}://${user}:${pass}@${host}/${db}`;
  return uri;
}