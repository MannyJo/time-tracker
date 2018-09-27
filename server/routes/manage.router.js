const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('in /manage GET');

    res.sendStatus(200);
});

module.exports = router;