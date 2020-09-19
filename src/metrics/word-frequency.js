const fs = require('fs')

const extractWords   = require('./../utils/extractWords.js')
const arrayifyRating = require('./../utils/arrayifyRating.js')

const dialoguesJson = fs.readFileSync('data/parsed/dialogues-index.json', 'utf8')
const dialogues = JSON.parse(dialoguesJson)

const wordsStat = {}

for(let i = 0; i < dialogues.length; i += 1) {
    const { title, id } = dialogues[i]
    
    const messagesJson = fs.readFileSync(`data/parsed/dialogues/${id}.json`, 'utf8')
    const messages = JSON.parse(messagesJson)

    for(let i = 0; i < messages.length; i += 1) {
        const message = messages[i] // { who, date, text }

        if(process.argv[2] !== undefined && message.who !== process.argv[2]) {
            continue
        }
    
        const words = extractWords(message.text)
            .map(w => w.toLowerCase())

        words.forEach(word => {    
            if(word in wordsStat) {
                wordsStat[word] += 1
            } else {
                wordsStat[word] = 1
            }
        })
    }
}

const rating = arrayifyRating(wordsStat)
const wordCount = rating.reduce((acc, word) => acc + word.count, 0)
const uniqueWordCount = rating.length

const savePath = `data/word-frequency-${
    process.argv[2] === undefined
        ? 'total'
        : process.argv[2].split(' ').join('-')
}.csv`

const report = `Всего ${wordCount} слов${
    process.argv[2] === undefined
        ? ''
        : ` от отправителя ${process.argv[2]}`
}, из них ${uniqueWordCount} различных

Топ-50 популярности:
${
    rating.slice(0, 50).map( ({str, count}, i) => `${i + 1}. ${str} — ${count} раз` ).join('\n')
}

Полный список см. файл ${savePath}
`
console.log(report)

const freqReport = `index;word;count;share\n` +
    rating.map( ({ str, count }, i) => `${i + 1};${str};${count};${count / wordCount}` ).join('\n')

fs.writeFileSync(savePath, freqReport, 'utf8')