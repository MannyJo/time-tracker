const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.get('/', (req, res) => {
    // if there is no data from client, initialize those
    if (!req.query.start_date) {
        req.query.start_date = new Date('1970-01-01');
    }
    if (!req.query.end_date) {
        req.query.end_date = new Date();
    }

    let selectProjectTimes = `
        SELECT
            pj1."id",
            pj1."project_name",
            SUM(et1."work_hour") AS "work_hour",
            COUNT(et1.*) AS "entry_count"
        FROM
            "projects" pj1
            JOIN "entries" et1
                ON pj1."id" = et1."project_id"
        WHERE
            et1."work_date" BETWEEN $1 AND $2
        GROUP BY
            pj1."id"
        ORDER BY
            pj1."id" ASC
        ;
    `;

    pool.query(selectProjectTimes, [
        req.query.start_date,
        req.query.end_date
    ]).then((results) => {
        res.send(results.rows);
    }).catch((err) => {
        console.log('Error with getting projects time :', err);
    });
});

module.exports = router;