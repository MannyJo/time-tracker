const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('in /entry GET');

    let offset = (req.query.pageNum-1)*10;

    let selectEntryQueryStr = `
        SELECT
            e1."id",
            e1."entry",
            p1."project_name",
            TO_CHAR(e1."work_date", 'MM/dd/yyyy') AS "work_date",
            e1."work_date" AS "date",
            e1."work_hour",
            substr(e1."start_time", 1, 2) || ':' || substr(e1."start_time", 3, 2)AS "start_time",
            substr(e1."end_time", 1, 2) || ':' || substr(e1."end_time", 3, 2)AS "end_time"
        FROM
            "entries" e1
            JOIN "projects" p1
                ON e1."project_id" = p1."id"
        ORDER BY
            e1."id" DESC
        LIMIT 10
        OFFSET $1
        ;
    `;

    pool.query(selectEntryQueryStr, [offset])
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

// select total count of entries
router.get('/page', (req, res) => {
    let selectPageCount = `
        SELECT
            COUNT(*) AS page_count
        FROM
            "entries" e1
            JOIN "projects" p1
                ON e1."project_id" = p1."id"
        ;
    `;

    pool.query(selectPageCount)
        .then((results) => {
            res.send(results.rows[0].page_count);
        }).catch(err => {
            console.log('Error with searching entries count :', err);
            res.sendStatus(500);
        });
});

router.post('/', (req, res) => {
    console.log('in /entry POST');

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
            "project_id" = $1
            AND "work_date" = $2
            AND (
                $3 BETWEEN "start_time" AND "end_time"
                OR $4 BETWEEN "start_time" AND "end_time"
                OR "start_time" BETWEEN $3 AND $4
                OR "end_time" BETWEEN $3 AND $4
            )
        ;
    `;

    pool.query(overlapDetect, [
        req.body.project_id,
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

router.put('/update', (req, res) => {
    let updateEntry = `
        UPDATE
            "entries"
        SET
            "entry" = $1,
            "project_id" = $2,
            "work_date" = $3,
            "work_hour" = $4,
            "start_time" = $5,
            "end_time" = $6
        WHERE
            "id" = $7
        ;
    `;

    let overlapDetect = `
        SELECT 
            SUBSTR("start_time", 1, 2) || ':' || SUBSTR("start_time", 3, 2) AS "start_time",
            SUBSTR("end_time", 1, 2) || ':' || SUBSTR("end_time", 3, 2) AS "end_time"
        FROM 
            "entries"
        WHERE 
            "project_id" = $1
            AND "work_date" = $2
            AND (
                $3 BETWEEN "start_time" AND "end_time"
                OR $4 BETWEEN "start_time" AND "end_time"
                OR "start_time" BETWEEN $3 AND $4
                OR "end_time" BETWEEN $3 AND $4
            )
            AND "id" != $5
        ;
    `;

    pool.query(overlapDetect, [
        req.body.project_id,
        req.body.work_date,
        req.body.start_time,
        req.body.end_time,
        req.body.id
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
            pool.query(updateEntry, [
                req.body.entry,
                req.body.project_id,
                req.body.work_date,
                req.body.work_hour,
                req.body.start_time,
                req.body.end_time,
                req.body.id
            ]).then(() => {
                res.sendStatus(200);
            }).catch(err => {
                console.log('Error with inserting entries table :', err);
                res.sendStatus(500);
            });
        }
    }).catch(err => {
        console.log('Error with searching duplicated entry time :', err);
        res.sendStatus(500);
    });
})

module.exports = router;