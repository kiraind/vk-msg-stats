const fs = require('fs')
const path = require('path')

const parseFile = require('./parseFile.js')

const messagesPerPage = 300

function makePath(i, id) {
    return path.join(process.argv[2], `/messages/${id}/messages${i * messagesPerPage}.html`) 
}

function* getPages(id) {
    for(let i = 0; ; i += 1) {
        const path     = makePath(i, id)

        // if current is not the last
        if( fs.existsSync( path ) ) {
            yield parseFile(path)
        } else {
            return
        }
    }
}

module.exports = getPages