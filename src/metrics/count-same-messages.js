const fs = require('fs')

const arrayifyRating = require('./../utils/arrayifyRating.js')

const dialogues = JSON.parse(
    fs.readFileSync(`data/parsed/dialogues-index.json`, 'utf-8')
)

const textQuery = process.argv[2].toLowerCase()
console.log(`Поиск сообщения «${textQuery}»`)

const found = []

dialogues.forEach(({ id }) => {
    const messages = JSON.parse(
        fs.readFileSync(`data/parsed/dialogues/${id}.json`, 'utf-8')
    )

    messages.forEach(msg => {
        const { who, text } = msg

        const lowerCase = text.toLowerCase()

        if(lowerCase === textQuery) {
            found.push( msg )
        }
    })
})

console.log( `Всего: ${found.length}` )

const days = {}

found.forEach(({ date }) => {
    const day = date.split('T')[0]

    if( day in days ) {
        days[day] += 1
    } else {
        days[day] = 1
    }
})

const rating = arrayifyRating(days)

console.log(
    rating.map(({ str, count }, i) => `${i+1}. ${str}: ${count}`).join('\n')
)