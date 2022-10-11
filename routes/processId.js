const { execSync } = require("node:child_process");
const express = require('express');
const router = express.Router()

const adobeApp = {
  pid: null,
};

router.get('/:app', (req, res, next) => {
  throw new Error('Unabel get process id');
  
  const _pid = parseInt(execSync(`pgrep -i "${req.params.app}"`));
  adobeApp.pid = _pid;
  res.send(adobeApp);
});

module.exports = router;