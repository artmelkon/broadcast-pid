const express = require('express')
const router = express.Router();

router.get('/api/stats/:cpu', (req, res) => {
  try {
    const $PID = execSync('pgrep -l "Adobe Photoshop"', {stdio: 'pipe'});
    res.send('PID ' + $PID)
}
catch (error) {
    console.log(error.message);
}
})

module.exports = router;