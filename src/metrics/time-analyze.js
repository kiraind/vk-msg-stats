const fs = require('fs')

const extractWords   = require('./../utils/extractWords.js')
const arrayifyRating = require('./../utils/arrayifyRating.js')

const dialogues = JSON.parse(
    fs.readFileSync(`data/parsed/dialogues-index.json`, 'utf-8')
)

const id = dialogues.find(dialogue => dialogue.title === process.argv[2])?.id

if(id === undefined) {
    throw new Error(`Диалог "${process.argv[2]}" не найден`)
}

// read
const json = fs.readFileSync(`data/parsed/dialogues/${id}.json`, 'utf8')
const messages = JSON.parse(json)

// count
console.log(`Обработка ${messages.length} сообщений`)

const messageStats = Array(24).fill(0)
let messagesTotal  = 0

const wordsStats   = Array(24).fill(0)
let wordsTotal     = 0

for(let i = 0; i < messages.length; i += 1) {
    const message = messages[i] // { who, date, text }

    const words = extractWords(message.text)

    // '2016-12-24T19:10:38.000Z'
    //             ^^
    const hour = parseInt( message.date.split('T')[1].split(':')[0] )

    messageStats[ hour ] += 1
    messagesTotal += 1

    wordsStats[ hour ] += words.length
    wordsTotal += 1
}

const messagePart = messageStats.map(count => count / messagesTotal)
const wordsPart   =   wordsStats.map(count => count / wordsTotal)

const maxLength = 50
const signPerMessagePart = maxLength / Math.max(...messagePart)
const signPerWordPart   = maxLength  / Math.max(...wordsPart)

console.log(`
Статистика по сообщениям (час суток/сообщения):
${messagePart.map(
    (part, i) => `${
        i.toString().padStart(2, 0)
    }: ${'#'.repeat( Math.round(signPerMessagePart * part) )} — ${messageStats[i]}`
).join('\n')}

Статистика по словам (час суток/слова):
${wordsPart.map(
    (part, i) => `${
        i.toString().padStart(2, 0)
    }: ${'#'.repeat( Math.round(signPerWordPart * part) )} — ${wordsStats[i]}`
).join('\n')}
`)