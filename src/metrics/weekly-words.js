const fs = require('fs')

const extractWords = require('./../utils/extractWords.js')

const dialogues = JSON.parse(
    fs.readFileSync(`data/parsed/dialogues-index.json`, 'utf-8')
)

const id = dialogues.find(dialogue => dialogue.title === process.argv[2])?.id

if(id === undefined) {
    throw new Error(`Диалог "${process.argv[2]}" не найден`)
}

const json = fs.readFileSync(`data/parsed/dialogues/${id}.json`, 'utf8')
const messages = JSON.parse(json)

let weekIndex = 1
let weekStart = new Date('Jan 02 2006')
const weekStepMs = 7 * 24 * 60 * 60 * 1000

const weeks = []

let currentWeek = {
    id: weekIndex,
    date: weekStart.toISOString(),
    
    myWords:    0,
    elsesWords: 0,

    myMessages:    0,
    elsesMessages: 0,
}

for(let i = 0; i < messages.length; i += 1) {
    const message = messages[i] // { who, date, text }

    const date = new Date(message.date)

    while(date.valueOf() > weekStart.valueOf() + weekStepMs) {
        if(currentWeek.myMessages + currentWeek.elsesMessages > 0) {
            weeks.push( currentWeek )
        }
        
        weekStart = new Date( weekStart.valueOf() + weekStepMs )
        weekIndex += 1

        currentWeek = {
            id: weekIndex,
            date: weekStart.toISOString(),
            
            myWords:    0,
            elsesWords: 0,

            myMessages:    0,
            elsesMessages: 0,
        }
    }

    if(message.who === 'Вы') {
        currentWeek.myMessages += 1
        currentWeek.myWords += extractWords(message.text).length
    } else {
        currentWeek.elsesMessages += 1
        currentWeek.elsesWords += extractWords(message.text).length
    }  
}

weeks.push( currentWeek )

const report = `week_id;date;messages;my_messages;elses_messages;words;my_words;elses_words;words_per_message;my_words_per_message;elses_words_per_message\n` + 
weeks.map(week => `${week.id};${week.date};${
    week.myMessages + week.elsesMessages
};${
    week.myMessages
};${
    week.elsesMessages
};${
    week.myWords + week.elsesWords
};${
    week.myWords
};${
    week.elsesWords
};${
    (week.myMessages + week.elsesMessages) !== 0 ? (week.myWords + week.elsesWords) / (week.myMessages + week.elsesMessages) : 0
};${
    week.myMessages !== 0 ? week.myWords / week.myMessages : 0
};${
    week.elsesMessages !== 0 ? week.elsesWords / week.elsesMessages : 0
}`).join('\n')

fs.writeFileSync(`data/dialogue-weekly-rating-${id}.csv`, report, 'utf8')

console.log(`Статистка количества сообщений в диалоге ${process.argv[2]} сохранена в data/dialogue-weekly-rating-${id}.csv`)