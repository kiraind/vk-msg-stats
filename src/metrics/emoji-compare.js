
const arrayifyRating = require('./../utils/arrayifyRating.js')
const extractEmoji = require('../utils/extractEmoji.js')
const compareEntities = require('../utils/compareEntities.js')

// settings
const topSize = 20
const popTopSize = 500
const countWordLength = false

const {
    wordsStat,
    myWordsStat, 
    elsesWordsStat, 
    myWordCount, 
    elsesWordCount,
} = compareEntities(process.argv[2], extractEmoji, countWordLength)

// report
console.log(`
Всего эмоджи: ${myWordCount + elsesWordCount}
    из них
    ваших:            ${myWordCount}
    собеседника(-ов): ${elsesWordCount}

Уникальных эмоджи:      ${Object.keys(wordsStat).length}
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
Эмоджи, которые часто используете вы, а собеседник(и) нет:
${[...iSayMore].join(', ')}

Эмоджи, которые часто использует(-ют) собеседник(и), а вы нет:
${[...elseSaysMore].join(', ')}
`)

console.log(`
Топ ${topSize} наиболее частых эмоджи:
${
    arrayifyRating(wordsStat)
        .slice(0, topSize)
        .map( ({str, count}, i) => `${i + 1}. ${str} — ${count} раз` ).join('\n')
}

Топ ${topSize} ваших эмоджи:
${
    arrayifyRating(myWordsStat)
        .slice(0, topSize)
        .map( ({str, count}, i) => `${i + 1}. ${str} — ${count} раз` ).join('\n')
}

Топ ${topSize} эмоджи собеседника(-ов):
${
    arrayifyRating(elsesWordsStat)
        .slice(0, topSize)
        .map( ({str, count}, i) => `${i + 1}. ${str} — ${count} раз` ).join('\n')
}
`)