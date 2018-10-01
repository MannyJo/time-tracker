const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('in /manage GET');

    let offset = (req.query.pageNum-1)*10;

    let selectQueryStr = `
        SELECT
            pr1."id",
            pr1."project_name",
            SUM(COALESCE(en1."work_hour", 0)) as "total_hours"
        FROM
            "projects" pr1
            LEFT OUTER JOIN "entries" en1
                ON pr1."id" = en1."project_id"
        GROUP BY
            pr1."id"
        ORDER BY
            pr1."id" DESC
        LIMIT 10
        OFFSET $1
        ;
    `;

    pool.query(selectQueryStr, [offset])
        .then(results => {
            res.send(results);
        }).catch(err => {
            console.log('Error with searching projects table :', err);
            res.sendStatus(500);
        });
});

router.get('/all', (req, res) => {
    console.log('in /manage/all GET');

    let selectQueryStr = `
        SELECT
            pr1."id",
            pr1."project_name",
            SUM(COALESCE(en1."work_hour", 0)) as "total_hours"
        FROM
            "projects" pr1
            LEFT OUTER JOIN "entries" en1
                ON pr1."id" = en1."project_id"
        GROUP BY
            pr1."id"
        ORDER BY
            pr1."id" DESC
        ;
    `;

    pool.query(selectQueryStr)
        .then(results => {
            res.send(results);
        }).catch(err => {
            console.log('Error with searching all projects table :', err);
            res.sendStatus(500);
        });
});

router.get('/page', (req, res) => {
    let selectPageCount = `
        SELECT
            COUNT(*) AS page_count
        FROM
            "projects"
        ;
    `;

    pool.query(selectPageCount)
        .then((results) => {
            res.send(results.rows[0].page_count);
        }).catch(err => {
            console.log('Error with searching projects count :', err);
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
            res.sendStatus(201);
        }).catch(err => {
            console.log('Error with inserting new project :', err);
            res.sendStatus(500);
        });
});

router.delete('/delete', (req, res) => {
    console.log('in /manage/delete DELETE');

    let deleteProject = `
        DELETE FROM "projects"
        WHERE "id" = $1
        ;
    `;

    pool.query(deleteProject, [req.query.id])
        .then(() => {
            res.sendStatus(200);
        }).catch(err => {
            console.log('Error with deleting projects table :', err);
            res.sendStatus(500);
        });
});

router.put('/update', (req, res) => {
    console.log('in /manage/update PUT');
    
    let updateProject = `
        UPDATE "projects"
        SET "project_name" = $1
        WHERE "id" = $2
        ;
    `;

    pool.query(updateProject, [req.body.project_name, req.body.id])
        .then(() => {
            res.sendStatus(200);
        }).catch(err => {
            console.log('Error with updating projects table :', err);
            res.sendStatus(500);
        });
});

module.exports = router;