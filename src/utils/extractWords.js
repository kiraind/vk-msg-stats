
function extractWords(message) {
    if(!message) {
        return []
    }

    return message.match(/([а-яёa-z])+/gi) ?? [];
}

module.exports = extractWords