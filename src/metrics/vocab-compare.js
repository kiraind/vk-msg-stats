
const arrayifyRating = require('./../utils/arrayifyRating.js')
const extractWords = require('../utils/extractWords.js')
const compareEntities = require('../utils/compareEntities.js')


// settings
const topSize = 20
const popTopSize = 500
const countWordLength = true

const {
    wordsStat,
    myWordsStat, 
    elsesWordsStat, 
    myWordCount, 
    elsesWordCount,
    myWordsLengths, 
    elsesWordsLengths
} = compareEntities(process.argv[2], extractWords, countWordLength)

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