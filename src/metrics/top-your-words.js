const fs = require('fs')

const extractWords = require('../utils/extractWords.js')
const arrayifyRating = require('./../utils/arrayifyRating.js')

const dialogues = JSON.parse(
    fs.readFileSync(`data/parsed/dialogues-index.json`, 'utf-8')
)

const whoQuery = 'Вы'
const stats = {}

dialogues.forEach(({ id }) => {
    const messages = JSON.parse(
        fs.readFileSync(`data/parsed/dialogues/${id}.json`, 'utf-8')
    )

    messages.forEach(({ who, text }) => {
        if(who === whoQuery && text !== '') {
            const words = extractWords(text.toLowerCase())

            words.forEach(word => {
                if(stats[word]) stats[word]++
                else stats[word] = 1
            })
        }
    })
})

const rating = arrayifyRating(stats)
const top50 = rating.slice(0, 50)

console.log(
    "Статистика использованных вами слов:\n",
    top50.map(({ str, count }, i) => `${i+1}. «${str}», ${count}`).join('\n')
)