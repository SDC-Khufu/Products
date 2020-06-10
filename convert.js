const readFile = require('fs').readFile;
const writeFile = require('fs').writeFile

const csvJSON = (csv) => {
    let lines = csv.split("\n");
    let currentId = 1
    let result = [];
    let obj = {}
    
    for (let i = 1; i < lines.length; i++) {
        let currentLine = lines[i].split(",")
        let currentStyleId = JSON.parse(currentLine[1])
        let parsedCurrentLine = JSON.parse(currentLine[2])
        let parsedInventoryLevels = JSON.parse(currentLine[3])
        if (!obj.hasOwnProperty('style_id') || obj.style_id === currentStyleId) {
            obj.style_id = currentStyleId;
            obj[parsedCurrentLine] = parsedInventoryLevels
            
        } else {
            while (obj.style_id !== currentId) {
                let nullObj = {'style_id': currentId, 'null': null}
                result.push(nullObj)
                currentId++
            }
            currentId++
            result.push(obj)
            obj = {}
            obj.style_id = currentStyleId;
            obj[parsedCurrentLine] = parsedInventoryLevels
        }
    }
   return JSON.stringify(result)
}

readFile('./skuscopy.csv', 'utf-8', (err, data) => {
    const jsoned = csvJSON(data)
    writeFile('./SKUJSON2.json', jsoned,  err => {
        console.log(err)
    })
})