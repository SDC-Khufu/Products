const readFile = require('fs').readFile;
const writeFile = require('fs').writeFile

const csvJSON = (csv) => {
    let lines = csv.split("\n");
    let currentId = 1
    let result = [];
    let obj = {}
    let individualResult = []
    
    for (let i = 1; i < lines.length - 1; i++) {
        
        let currentLine = lines[i].split(",")
        let currentProductId = JSON.parse(currentLine[1])
        let related_product_id = JSON.parse(currentLine[2])
        
        if (!obj.hasOwnProperty('product_id') || obj.product_id === currentProductId) {
            obj.product_id = currentProductId;
            individualResult.push(related_product_id)
        } else {
            while (obj.product_id !== currentId) {
                let nullObj = {'product_id': currentId, 'related': null}
                result.push(nullObj)
                currentId++
            }

            currentId++
            obj.related = individualResult.slice()
            result.push(obj)
            obj = Object.assign({}, {})
            individualResult = []
            obj.product_id = currentProductId;
            individualResult.push(related_product_id)
        }
    }
   return JSON.stringify(result)
}

readFile('./related.csv', 'utf-8', (err, data) => {
    const jsoned = csvJSON(data)
    writeFile('./related.json', jsoned,  err => {
        console.log(err)
    })
})