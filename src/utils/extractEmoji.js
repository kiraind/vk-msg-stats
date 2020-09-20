const emojiRegex = require('emoji-regex');

function extractEmoji(message) {
    if(!message) {
        return []
    }

    return message.match(emojiRegex()) ?? [];
}

module.exports = extractEmoji