const fs = require('fs')

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
            const lowerCase = text.toLowerCase()

            if( lowerCase in stats ) {
                stats[lowerCase] += 1
            } else {
                stats[lowerCase] = 1
            }
        }
    })
})

const rating = arrayifyRating(stats)
const top50 = rating.slice(0, 50)

console.log(
    top50.map(({ str, count }, i) => `${i+1}. «${str}», ${count}`).join('\n')
)