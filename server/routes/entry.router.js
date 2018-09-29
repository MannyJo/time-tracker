const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('in /entry GET');

    // TODO : moving to somewhere later
    let selectEntryQueryStr = `
        SELECT
            e1."id",
            e1."entry",
            p1."project_name",
            TO_CHAR(e1."work_date", 'yyyy-MM-dd') AS "work_date",
            e1."work_hour"
        FROM
            "entries" e1
            JOIN "projects" p1
                ON e1."project_id" = p1."id"
        ORDER BY
            e1."id" DESC
        ;
    `;

    pool.query(selectEntryQueryStr)
        .then(results => {
            for(row of results.rows){
                row.work_hour = parseFloat(row.work_hour)
            }
            res.send(results.rows);
        }).catch(err => {
            console.log('Error with searching entries table :', err);
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

router.delete('/delete', (req, res) => {
    let deleteEntry = `
        DELETE FROM "entries"
        WHERE "id" = $1
        ;
    `;

    pool.query(deleteEntry, [req.query.id])
        .then(() => {
            res.sendStatus(200);
        }).catch(err => {
            console.log('Error with deleting entries table :', err);
            res.sendStatus(500);
        });
});

module.exports = router;