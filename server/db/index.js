const { DB_PASSWORD } = require('../../config.js')
const pgp = require('pg-promise')(/*options*/)

const db = pgp({
    user: 'postgres',
    host: '3.17.129.23',
    database: 'productsservice',
    password: DB_PASSWORD,
    port: 80,
    query_timeout: 100000
})


module.exports = {
    getRelated: (productId, cb) => {
        const query = `SELECT related_products FROM relatedproducts WHERE productid = $1;`
        db.one(query, productId)
        .then(results => cb(null, results))
        .catch(error => cb(error))
    },
    
    getProducts: (productId, cb) => {
        const query = `SELECT * FROM products WHERE id = $1;`
        db.one(query, productId)
        .then(results => cb(null, results))
        .catch(err => cb(err))
    },

    getStyles: (productId, cb) => {
        let results
        const query = `SELECT style_id, name, original_price, COALESCE(sale_price, '0') AS sale_price, defaultt as "default?", skus FROM styles WHERE product_id = $1 ORDER BY style_id ASC;`
        db.many(query, productId)
        .then(results1 => {
            results = results1
            let styleArray = [];
            results1.forEach(result => styleArray.push(result.style_id))
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
        .catch(err => cb(err, null, null, productId))
    },

}