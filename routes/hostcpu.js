const express = require('express')
const router = express.Router();

router.get('/api/stats/:cpu', ((req, res) => {
    const $PID = execSync('pgrep -l "Adobe Photoshop"', {stdio: 'pipe'});
    res.send('PID ' + $PID)
}))

module.exports = router;