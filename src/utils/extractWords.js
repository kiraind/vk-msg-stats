const cyrillicStr = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя-'
const cyrillic = cyrillicStr
    .split('')
    .reduce((obj, char, i) => {
        obj[char] = i
        return obj
    }, {})

function extractWords(message) {
    if(!message) {
        return []
    }

    const words = []

    let inWord = message[0] in cyrillic
    let currentWord = ''

    for(let i = 0; i < message.length; i += 1) {
        const char = message[i]

        if(inWord) {
            if(char in cyrillic) {
                currentWord += char
            } else {
                inWord = false
                words.push( currentWord )
                currentWord = ''

                // reiterate
                i -= 1
            }
        } else {
            if(char in cyrillic) {
                inWord = true

                // reiterate
                i -= 1
            }
        }
    }

    if(currentWord) {
        words.push( currentWord )
    }

    return words
}

module.exports = extractWords