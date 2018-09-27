const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('in /manage GET');

    // TODO : moving to somewhere later
    let selectQueryStr = `
        SELECT
            pr1."id",
            pr1."project_name",
            SUM(en1."work_hour") as "total_hours"
        FROM
            "projects" pr1
            JOIN "entries" en1
                ON pr1."id" = en1."project_id"
        GROUP BY
            pr1."id"
        ORDER BY
            pr1."id" DESC
        ;
    `;

    pool.query(selectQueryStr)
        .then(results => {
            // console.log('Results :', results);
            res.send(results);
        }).catch(err => {
            console.log('Error with searching projects table :', err);
            res.sendStatus(500);
        });
});

router.post('/', (req, res) => {
    console.log('in /manage POST');

    let projectName = req.body.projectName;

    // TODO : moving to somewhere later
    let insertQueryStr = `
        INSERT INTO "projects" ( "project_name" )
        VALUES ( $1 )
        ;
    `;

    pool.query(insertQueryStr, [projectName])
        .then(() => {
            res.sendStatus(201);
        }).catch(err => {
            console.log('Error with inserting new project :', err);
            res.sendStatus(500);
        });
});

module.exports = router;