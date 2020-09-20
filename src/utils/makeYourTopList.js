const fs = require('fs')

const arrayifyRating = require('./arrayifyRating.js')

function makeTopList(extractorFunction){

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
                const elements = extractorFunction(text)

                elements.forEach(element => {
                    if( element in stats ) {
                        stats[element] += 1
                    } else {
                        stats[element] = 1
                    }
                });
            }
        })
    })

    const rating = arrayifyRating(stats)
    const top50 = rating.slice(0, 50)

    return top50.map(({ str, count }, i) => `${i+1}. «${str}», ${count}`).join('\n')
}

module.exports = makeTopList