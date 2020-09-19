const fs = require('fs')
const path = require('path')
const iconv = require('iconv-lite')
const unescape = require('unescape')

const {
    parse,
    HTMLElement,
    TextNode
} = require('node-html-parser')

function getDialogues() {
    const file = fs.readFileSync(
        path.join(process.argv[2], '/messages/index-messages.html')
    )

    const fileString = iconv.encode(
        iconv.decode(file, 'cp1251'),
        'utf8'
    ).toString()

    const root = parse(fileString)

    const peerElements = root.querySelectorAll('.message-peer--id')

    const linkElements = peerElements.map( elem => elem.querySelector('a') )

    const dialogues = linkElements.map(
        linkElement => ({
            title: linkElement.text,
            id: linkElement.getAttribute('href').split('/')[0]
        })
    )

    return dialogues
}

module.exports = getDialogues