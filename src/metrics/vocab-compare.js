const fs = require('fs')

const extractWords   = require('./../utils/extractWords.js')
const arrayifyRating = require('./../utils/arrayifyRating.js')

// settings
const topSize = 20
const popTopSize = 500

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

// ANALYZE

// count words
let myWordCount    = 0
let elsesWordCount = 0
// word length's
let myWordsLengths    = 0
let elsesWordsLengths = 0

// exact words
const wordsStat      = {}
const myWordsStat    = {}
const elsesWordsStat = {}

for(let i = 0; i < messages.length; i += 1) {
    const message = messages[i] // { who, date, text }

    const words = extractWords(message.text)

    if(message.who === 'Вы') {
        myWordCount += words.length

        myWordsLengths += words.reduce((acc, word) => acc + word.length, 0)
    } else {
        elsesWordCount += words.length

        elsesWordsLengths += words.reduce((acc, word) => acc + word.length, 0)
    }

    words.forEach(rawWord => {
        const word = rawWord.toLowerCase()

        if(word in wordsStat) {
            wordsStat[word] += 1
        } else {
            wordsStat[word] = 1
        }
        
        if(message.who === 'Вы') {
            if(word in myWordsStat) {
                myWordsStat[word] += 1
            } else {
                myWordsStat[word] = 1
            }
        } else {
            if(word in elsesWordsStat) {
                elsesWordsStat[word] += 1
            } else {
                elsesWordsStat[word] = 1
            }
        }
    })
}


// report
console.log(`
Всего слов: ${myWordCount + elsesWordCount}
    из них
    ваших:            ${myWordCount}
    собеседника(-ов): ${elsesWordCount}

Средняя длина слова:    ${(myWordsLengths + elsesWordsLengths) / (myWordCount + elsesWordCount)} букв/слово
    ваша:               ${myWordsLengths / myWordCount} букв/слово
    у собеседника(-ов): ${elsesWordsLengths / elsesWordCount} букв/слово

Уникальных слов:      ${Object.keys(wordsStat).length}
    ваших:            ${Object.keys(myWordsStat).length}
    собеседника(-ов): ${Object.keys(elsesWordsStat).length}
`)

const myPopTopSet    = new Set(
    arrayifyRating(myWordsStat).slice(0, popTopSize).map(word => word.str)
)
const elsesPopTopSet = new Set(
    arrayifyRating(elsesWordsStat).slice(0, popTopSize).map(word => word.str)
)

const     iSayMore = new Set([...myPopTopSet].filter(x => !elsesPopTopSet.has(x)))
const elseSaysMore = new Set([...elsesPopTopSet].filter(x => !myPopTopSet.has(x)))

console.log(`
Слова, которые часто говорите вы, а собеседник(и) нет:
${[...iSayMore].join(', ')}

Слова, которые часто говорит(-ят) собеседник(и), а вы нет:
${[...elseSaysMore].join(', ')}
`)

console.log(`
Топ ${topSize} наиболее частых слов:
${
    arrayifyRating(wordsStat)
        .slice(0, topSize)
        .map( ({str, count}, i) => `${i + 1}. ${str} — ${count} раз` ).join('\n')
}

Топ ${topSize} ваших слов:
${
    arrayifyRating(myWordsStat)
        .slice(0, topSize)
        .map( ({str, count}, i) => `${i + 1}. ${str} — ${count} раз` ).join('\n')
}

Топ ${topSize} слов собеседника(-ов):
${
    arrayifyRating(elsesWordsStat)
        .slice(0, topSize)
        .map( ({str, count}, i) => `${i + 1}. ${str} — ${count} раз` ).join('\n')
}
`)