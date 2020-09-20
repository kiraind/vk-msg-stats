
function extractWords(message) {
    if(!message) {
        return []
    }

    return message.match(/([а-яё])+/gi) ?? [];
}

module.exports = extractWords