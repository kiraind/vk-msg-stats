const fs = require('fs')

function compareEntities(name, extractorFunction, countWordLength) {

    const dialogues = JSON.parse(
        fs.readFileSync(`data/parsed/dialogues-index.json`, 'utf-8')
    )

    const id = dialogues.find(dialogue => dialogue.title === name)?.id

    if(id === undefined) {
        throw new Error(`Диалог "${name}" не найден`)
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

        const words = extractorFunction(message.text)

        if(message.who === 'Вы') {
            myWordCount += words.length

            
            if(countWordLength) myWordsLengths += words.reduce((acc, word) => acc + word.length, 0)
        } else {
            elsesWordCount += words.length

            if(countWordLength) elsesWordsLengths += words.reduce((acc, word) => acc + word.length, 0)
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

    if (countWordLength) return {
        wordsStat,
        myWordsStat, 
        elsesWordsStat, 
        myWordCount, 
        elsesWordCount,
        myWordsLengths, 
        elsesWordsLengths
    }
    else return {
        wordsStat,
        myWordsStat, 
        elsesWordsStat, 
        myWordCount, 
        elsesWordCount
    }
}

module.exports = compareEntities