const readFile = require('fs').readFile;
const writeFile = require('fs').writeFile

const csvJSON = (csv) => {
    let lines = csv.split("\n");
    let currentId = 1
    let result = [];
    let overallObj = {}
    let individualResult = []
    
    for (let i = 0; i < lines.length - 1; i++) {
        let obj = {}
        let currentLine = lines[i].split(",")
        let currentProductId = JSON.parse(currentLine[1])
        let parsedFeature = JSON.parse(currentLine[2])
        let parsedValue = currentLine[3]
        
        if (currentLine[4] !== undefined) {
            let fixecCurrentLine = currentLine.slice(3)
            parsedValue = fixecCurrentLine.join()
        }

        if (parsedValue !== null) parsedValue = JSON.parse(parsedValue)
        
        if (!overallObj.hasOwnProperty('product_id') || overallObj.product_id === currentProductId) {
            overallObj.product_id = currentProductId
            obj.feature = parsedFeature;
            obj.value = parsedValue;
            individualResult.push(obj)
        } else {
            while (overallObj.product_id !== currentId) {
                let nullObj = {'product_id': currentId, 'features': null}
                result.push(nullObj)
                currentId++
            }
            
            currentId++
            overallObj.features = individualResult;
            result.push(overallObj);
            individualResult = [];
            overallObj = {}
            overallObj.product_id = currentProductId
            obj.feature = parsedFeature;
            obj.value = parsedValue;
            individualResult.push(obj)
        }
    }
   return JSON.stringify(result)
}



readFile('./features.csv', 'utf-8', (err, data) => {
    const jsoned = csvJSON(data)
    writeFile('./features.json', jsoned,  err => {
        console.log(err)
    })
})