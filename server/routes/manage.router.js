const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('in /manage GET');

    // TODO : moving to somewhere later
    let selectQueryStr = `
        SELECT
            *
        FROM
            "projects"
        ORDER BY
            "id" DESC
        ;
    `;

    pool.query(selectQueryStr)
        .then(results => {
            console.log('Results :', results);
            res.send(results);
        }).catch(err => {
            console.log('Error with searching projects table');
            res.sendStatus(500);
        });
});

router.post('/', (req, res) => {
    console.log('in /manage POST');

    let projectName = req.body.projectName;

    let insertQueryStr = `
        INSERT INTO "projects" ( "project_name" )
        VALUES ( $1 )
        ;
    `;

    pool.query(insertQueryStr, [projectName])
        .then(() => {
            res.sendStatus(200);
        }).catch(err => {
            console.log('Error with inserting new project');
            res.sendStatus(500);
        });
});

module.exports = router;