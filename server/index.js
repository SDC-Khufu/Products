const express = require('express');
const bodyParser = require("body-parser")
const app = express();
const models = require('./models')
const morgan = require('morgan')

const port = 3000
app.use(bodyParser.json())
app.use(morgan('dev'))

app.get('/products/:productId', (req, res) => {
    const productId = req.params.productId
    models.getProducts(productId, (err, dbRes) => {
        if (err) {
            res.status(400)
            res.send("error getting styles")
        } else {
            const features = dbRes.rows[0].features.features
            dbRes.rows[0].features = features
            res.send(dbRes.rows[0])
        }
    })
})

app.get('/products/:productId/styles', (req, res) => {
    const productId = req.params.productId + ''
    models.getStyles(productId, (err, db1Res, db2Res, productId) => {
        if (err) {
            res.status(400)
            res.send("error getting styles")
        } else {
            let obj = {}
            obj.product_id = productId
            let photoArray = db2Res.rows[0].json_build_object.photos
            let addPhotos = db1Res.rows
            addPhotos.forEach(style => {
                delete style.skus.style_id
                let photoArrayToAdd = []
                if (photoArray !== null) {
                    photoArray.forEach(photo => {
                        if (photo.style_id === style.style_id) {
                            delete photo.style_id
                            photoArrayToAdd.push(photo)
                        }
                    })
                    style.photos = photoArrayToAdd
                } else {
                    style.photos = [{ "thumbnail_url": null, "url": null}]
                }
            })
            
            obj.results = addPhotos
            res.send(obj)
        }
    })
})

app.get('/products/:productId/related', (req, res) => {
    const productId = req.params.productId
    models.getRelated(productId, (err, dbRes) => {
        if (err) {
            res.status(400)
            res.send("error getting related")
        } else {
            res.send(dbRes.rows[0].related_products.related)
        }
    })
})

app.get('/photos/:styleId', (req, res) => {
    const styleId = req.params.styleId
    models.getPhotos(styleId, (err, dbRes) => {
        if (err) {
            res.status(400)
            res.send('error getting photos')

        } else {
            res.send(dbRes.rows[0].json_agg)
        }
    })
})
    
    app.listen(port, () => console.log(`listening on port ${port}`))
