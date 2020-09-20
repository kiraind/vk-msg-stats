
const extractEmoji = require('../utils/extractEmoji.js')
const makeTopList = require('../utils/makeYourTopList.js')

console.log("Топ использованных вами эмоджи:")

console.log(makeTopList(extractEmoji))