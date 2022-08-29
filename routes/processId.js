const { execSync } = require("node:child_process");
const express = require('express');
const router = express.Router()

const adobeApp = {
  pid: null,
};

router.get('/:app', (req, res, next) => {
  const _pid = parseInt(execSync(`pgrep -i "${req.params.app}"`));
  adobeApp.pid = _pid;
  res.send(adobeApp);
});

module.exports = router;