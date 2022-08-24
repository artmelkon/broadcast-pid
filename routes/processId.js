const { execSync } = require("node:child_process");

const adobeApp = {
  pid: null,
};

function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = asyncMiddleware((req, res, next) => {
  const _pid = parseInt(execSync(`pgrep -i "${req.params.app}"`));
  adobeApp.pid = _pid;
  res.send(adobeApp);
});
