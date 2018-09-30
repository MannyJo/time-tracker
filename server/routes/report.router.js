const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.get('/', (req, res) => {
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
            et1."work_date" BETWEEN '2018-09-01' AND '2018-09-30'
        GROUP BY
            pj1."id"
        ORDER BY
            pj1."id" ASC
        ;
    `;

    pool.query(selectProjectTimes)
        .then((results) => {
            res.send(results.rows);
            // res.sendStatus(200);
        }).catch((err) => {
            console.log('Error with getting projects time :', err);
        });
});

module.exports = router;