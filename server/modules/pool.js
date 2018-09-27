const pg = require('pg');
const url = require('url');

let config = {};

if(process.env.DATABASE_URL){
    let params = url.parse(process.env.DATABASE_URL);
    let auth = params.auth.split(':');

    config = {
        user: auth[0],
        password: auth[1],
        host: params.hostname,
        port: params.port,
        database: params.pathname.split('/')[1],
        ssl: true,
        max: 10,
        idleTimeoutMillis: 30000
    };
} else {
    config = {
        database: 'time_tracker',
        host: '',
        port: 5432,
        max: 10,
        idleTimeoutMillis: 30000
    };
}

const pool = new pg.Pool(config);

pool.on('connect', () => {
    console.log('Database connected');
});

pool.on('error', (error) => {
    console.log('Unexpected Error connecting to Postgresql', err);
    process.exit(-1);
});

module.exports = pool;