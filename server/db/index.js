const { Client } = require('pg');


const client = new Client({
    user: 'postgres',
    host: 'khufu_db_1',
    database: 'products',
    password: 'postgres',
    port: 5432,
})

client.connect()
.then(() => console.log('connected to database'))
.catch(err => console.log('failed to connect'))
// const db = pool.connect()
module.exports = client