const fs = require('fs')
const path = require('path')

// проверка аргумента
if(!fs.existsSync(
    path.join(process.argv[2], '/messages')
)) {
    throw new Error('Указан некорректный путь к папке Archive')
}

const getPages     = require('./collect-utils/getPages.js')
const getDialogues = require('./collect-utils/getDialogues.js')

const dialogues = getDialogues()

// sorting
dialogues.sort( (a, b) => a.title < b.title ? -1 : a.title === b.title ? 0 : 1 )

// serializing
const json = JSON.stringify(dialogues, null, 4)

// writing
if( !fs.existsSync(`data/parsed`) ) {
    fs.mkdirSync(`data/parsed`, { recursive: true })
}
fs.writeFileSync(`data/parsed/dialogues-index.json`, json, 'utf8')

let messagesCount = 0

for(let i = 0; i < dialogues.length; i += 1) {
    const { id } = dialogues[i]

    console.log( Math.round(100 * i / dialogues.length).toString().padStart(3) + '% : ' + id )

    const pages = getPages(id)

    const messages = []

    // reading
    for(let messagesPage of pages) {
        messages.push(...messagesPage)
    }

    messagesCount += messages.length

    // sorting
    messages.sort( (a, b) => a.date.valueOf() - b.date.valueOf() )

    // serializing
    const json = JSON.stringify(messages, null, 4)

    // writing
    if( !fs.existsSync(`data/parsed/dialogues`) ) {
        fs.mkdirSync(`data/parsed/dialogues`)
    }
    fs.writeFileSync(`data/parsed/dialogues/${id}.json`, json, 'utf8')
}

console.log(`Завершено. Обработано ${messagesCount} сообщений.`)