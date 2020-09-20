const fs = require('fs')
const iconv = require('iconv-lite')
const he = require('he')

const {
    parse,
    HTMLElement,
    TextNode
} = require('node-html-parser')

const parseHeader = require('./parseHeader.js')

function parseFile(path) {
    const file = fs.readFileSync(path)

    const fileString = iconv.encode(
        iconv.decode(file, 'cp1251'),
        'utf8'
    ).toString()

    // console.log( fileString )

    const root = parse(fileString)

    const messageElements = root.querySelectorAll('.message')

    // text - if 2nd child's first child is textnode

    // console.log( messages )

    const messages = messageElements.map(messageElement => {
        // get children elements
        const children = messageElement.childNodes.filter(
            node => node instanceof HTMLElement
        )

        // extract exact children
        const headerElem = children[0]
        const bodyElem   = children[1]

        // extract content
        const header = headerElem.text

        let messageTexts = []
        let line = 0
        while(
            bodyElem.childNodes[line] && (
                bodyElem.childNodes[line] instanceof TextNode ||
                bodyElem.childNodes[line].tagName === 'br'
            )
        ) {
            if(bodyElem.childNodes[line] instanceof TextNode) {
                messageTexts.push( bodyElem.childNodes[line].rawText )
            }
            
            line += 1
        }

        const messageText = he.decode(
            messageTexts.length > 0 ?
                messageTexts.join('\n')
                : ""
        )

        return {
            ...parseHeader(header),
            text: messageText,
        }
    })

    return messages
}

module.exports = parseFile