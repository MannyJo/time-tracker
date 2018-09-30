const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.get('/', (req, res) => {
    if(!req.query.start_date){
        req.query.start_date = new Date('1970-01-01')
    }
    if(!req.query.end_date){
        req.query.end_date = new Date();
    }
    console.log(req.query);

    let selectProjectTimes = `
        SELECT
            pj1."id",
            pj1."project_name",
            SUM(et1."work_hour") as "work_hour"
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
    ])
        .then((results) => {
            res.send(results.rows);
            // res.sendStatus(200);
        }).catch((err) => {
            console.log('Error with getting projects time :', err);
        });
});

module.exports = router;