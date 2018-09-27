const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('in /entry GET');

    // TODO : moving to somewhere later
    let selectEntryQueryStr = `
        SELECT
            "id",
            "entry",
            "project_id",
            to_char("work_date", 'yyyy-MM-dd') as "work_date",
            "work_hour"
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
                        entries: results.rows,
                        projects: projectList
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

router.post('/', (req, res) => {
    console.log('in /entry POST');

    console.log('Request :', req.body);

    // TODO : moving to somewhere later
    let insertNewEntry = `
        INSERT INTO "entries" (
            "entry", 
            "project_id", 
            "work_date", 
            "work_hour")
        VALUES ($1, $2, $3, $4)
        ;
    `;

    pool.query(insertNewEntry, [
        req.body.entry,
        req.body.project_id,
        req.body.work_date,
        req.body.work_hour
    ]).then(() => {
        res.sendStatus(201);
    }).catch(err => {
        console.log('Error with inserting entries table :', err);
        res.sendStatus(500);
    });
});

module.exports = router;