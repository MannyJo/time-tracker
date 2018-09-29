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
            "work_hour",
            "start_time",
            "end_time")
        VALUES ($1, $2, $3, $4, $5, $6)
        ;
    `;

    let overlapDetect = `
        SELECT 
            SUBSTR("start_time", 1, 2) || ':' || SUBSTR("start_time", 3, 2) AS "start_time",
            SUBSTR("end_time", 1, 2) || ':' || SUBSTR("end_time", 3, 2) AS "end_time"
        FROM 
            "entries"
        WHERE 
            "work_date" = $1
            AND (
                $2 BETWEEN "start_time" AND "end_time"
                OR $3 BETWEEN "start_time" AND "end_time"
                OR "start_time" BETWEEN $2 AND $3
                OR "end_time" BETWEEN $2 AND $3
            )
        ;
    `;

    pool.query(overlapDetect, [
        req.body.work_date,
        req.body.start_time,
        req.body.end_time
    ]).then(results => {
        if(results.rowCount > 0){
            console.log('Duplicated entry count :',results.rowCount);
            let objectToClient = {
                message: 'Cannot insert the data due to time duplication',
                duplicated_time: results.rows
            };

            res.status(400).send(objectToClient);
        } else {
            console.log('Duplicated entry count :',results.rowCount);
            pool.query(insertNewEntry, [
                req.body.entry,
                req.body.project_id,
                req.body.work_date,
                req.body.work_hour,
                req.body.start_time,
                req.body.end_time
            ]).then(() => {
                res.sendStatus(201);
            }).catch(err => {
                console.log('Error with inserting entries table :', err);
                res.sendStatus(500);
            });
        }
    }).catch(err => {
        console.log('Error with searching duplicated entry time :', err);
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