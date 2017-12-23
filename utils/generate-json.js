const { readdirSync, writeFileSync } = require('fs')
const isImage = file => /.jpg/.test(file) || /.png/.test(file)
const files = readdirSync('static/images').filter(isImage)
const data = files.map(file => `/static/images/${file}`)
const fileName = 'static/data/images.json'
writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf-8')
console.log('done')
