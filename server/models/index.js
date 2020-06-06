const client = require('../db')

    module.exports = {
        getProducts: (productId, cb) => {
            const query = `SELECT * FROM products WHERE id = ${productId};`
            client.query(query, (err, results) => {
                if (err) cb(err)
                else cb(null, results)
            })
        },

        getRelated: (productId, cb) => {
            const query = `SELECT related_products FROM relatedproducts WHERE productid = ${productId};`
            client.query(query, (err, results) => {
                if (err) cb(err)
                else cb(null, results)
            })
        },


        getStyles: (productId, cb) => {
            const query = `SELECT style_id, name, original_price, COALESCE(sale_price, '0') AS sale_price, defaultt as "default?", skus FROM styles WHERE product_id = ${productId} ORDER BY style_id ASC;`
            client.query(query, (err, db1Results) => {
                const results = db1Results.rows
                let styleArray = []
                results.forEach(result => {
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
                client.query(secondQuery, (err, db2Results) => {
                    if (err) cb(err)
                    else cb(null, db1Results, db2Results, productId)
                })
            })
        },


    }

