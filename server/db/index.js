// const { DB_PASSWORD } = require('../../config.js')
const pgp = require('pg-promise')(/*options*/)

const db = pgp({
    user: 'postgres',
    host: 'khufu_db_1',
    database: 'products',
    password: 'postgres',
    port: 5432,
})


module.exports = {
    getRelated: (productId, cb) => {
        const query = `SELECT related_products FROM relatedproducts WHERE productid = $1;`
        db.one(query, productId)
        .then(results => cb(null, results))
        .catch(error => console.log('error with related', error))
    },
    
    getProducts: (productId, cb) => {
        const query = `SELECT * FROM products WHERE id = $1;`
        db.one(query, productId)
        .then(results => cb(null, results))
        .catch(err => console.log('error db products', err))
    },

    // getStyles: (productId, cb) => {
    //     const query = `SELECT style_id, name, original_price, COALESCE(sale_price, '0') AS sale_price, defaultt as "default?", skus FROM styles WHERE product_id = ${productId} ORDER BY style_id ASC;`
    //     db.many(query, (err, db1Results) => {
    //         const results = db1Results.rows
    //         let styleArray = []
    //         results.forEach(result => {
    //             styleArray.push(result.style_id)
    //         })
    //         let newQuery = ''
    //         for (let i = 0; i < styleArray.length; i++) {
    //             if (i !== styleArray.length -1) {
    //                 const addToNewQuery = `style_id = ${styleArray[i]} or `
    //                 newQuery += addToNewQuery
    //             } else {
    //                 const addToNewQueryEnd = `style_id = ${styleArray[i]}`
    //                 newQuery += addToNewQueryEnd
    //             }
    //         }
    //         const secondQuery =  `select json_build_object('photos', (select json_agg(photo) from (select style_id, thumbnail_url, url from photos where ${newQuery}) as photo))`
    //         db.many(secondQuery, (err, db2Results) => {
    //             if (err) cb(err)
    //             else cb(null, db1Results, db2Results, productId)
    //         })
    //     })
    // },
    getStyles: (productId, cb) => {
        let results
        const query = `SELECT style_id, name, original_price, COALESCE(sale_price, '0') AS sale_price, defaultt as "default?", skus FROM styles WHERE product_id = $1 ORDER BY style_id ASC;`
        db.many(query, productId)
        .then(results1 => {
            results = results1
            let styleArray = [];
            results1.forEach(result => {
                styleArray.push(result.style_id)
            })
            let newQuery = ''
            for (let i = 0; i < styleArray.length; i++) {
                if (i !== styleArray.length -1) {
                    const addToNewQuery = `style_id = ${styleArray[i]} or `
                    newQuery += addToNewQuery
                } else {
                    const addToNewQueryEnd = `style_id = ${styleArray[i]}`
                    newQuery += addToNewQueryEnd
                }
            }
            const secondQuery =  `select json_build_object('photos', (select json_agg(photo) from (select style_id, thumbnail_url, url from photos where ${newQuery}) as photo))`
            return secondQuery
        })
        .then(secondQuery => db.many(secondQuery))
        .then(results2 => cb(null, results, results2, productId))
        .catch(err => console.log('styles db error', err))
    },

}

// client.connect()
// .then(() => console.log('connected to database'))
// .catch(err => console.log('failed to connect'))
// // const db = pool.connect()
// module.exports = db