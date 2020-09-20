const fs = require('fs')

const extractEmoji = require('../utils/extractEmoji.js')
const arrayifyRating = require('../utils/arrayifyRating.js')

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
            
            const emojis = extractEmoji(text)

            emojis.forEach( emoji => {
                if(stats[emoji]) stats[emoji]++
                else stats[emoji] = 1
            })
        }
    })
})

const rating = arrayifyRating(stats)
const top50 = rating.slice(0, 50)

console.log(
    "Топ использованных вами эмоджи:\n",
    top50.map(({ str, count }, i) => `${i+1}. «${str}», ${count}`).join('\n')
)