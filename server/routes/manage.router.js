const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('in /manage GET');

    // TODO : moving to somewhere later
    let queryStr = `
        SELECT
            *
        FROM
            "projects"
        ORDER BY
            "id" DESC
        ;
    `;

    pool.query(queryStr)
        .then(results => {
            console.log('Results :', results);
            res.send(results);
        }).catch(err => {
            console.log('Error with searching projects table');
            res.sendStatus(500);
        });
});

module.exports = router;