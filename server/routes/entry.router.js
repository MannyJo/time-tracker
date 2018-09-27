const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('in /entry GET');

    // TODO : moving to somewhere later
    let selectEntryQueryStr = `
        SELECT
            *
        FROM
            "entries"
        ORDER BY
            "id" DESC
        ;
    `;

    let selectProjectQueryStr = `
        SELECT
            *
        FROM
            "projects"
        ORDER BY
            "id" DESC
        ;
    `;

    let projectList = [];

    pool.query(selectProjectQueryStr)
        .then(projectResults => {
            projectList = projectResults.rows;
            pool.query(selectEntryQueryStr)
                .then(results => {
                    console.log('Results :', results.rows);
                    console.log('projectList :', projectList);
                    let objectToClient = {
                        entries : results.rows,
                        projects : projectList
                    };
                    res.send(objectToClient);
                }).catch(err => {
                    console.log('Error with searching entries table :', err);
                    res.sendStatus(500);
                });
        }).catch(err => {
            console.log('Error with searching projects table in entry :', err);
            res.sendStatus(500);
        });
});

// router.post()

module.exports = router;