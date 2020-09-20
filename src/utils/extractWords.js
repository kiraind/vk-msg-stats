
function extractWords(message) {
    if(!message) {
        return []
    }

    return message.match(/([А-Я,а-я,Ё,ё])+/g) ?? [];
}

module.exports = extractWords