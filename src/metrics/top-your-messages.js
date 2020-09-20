
const makeTopList = require('../utils/makeYourTopList.js')

console.log("Топ ваших сообщений:")

console.log(makeTopList(
    message => [message.toLowerCase()]
));