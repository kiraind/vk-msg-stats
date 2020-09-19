const months = {
    'янв': 0,
    'фев': 1,
    'мар': 2,
    'апр': 3,
    'мая': 4,
    'июн': 5,
    'июл': 6,
    'авг': 7,
    'сен': 8,
    'окт': 9,
    'ноя': 10,
    'дек': 11,
}

function parseHeader(header) {
    const who  = header.split(',').slice(0, -1).join(',').trim()
    const when = header.split(',').slice(-1)[0].trim()

    // parse date
    let [day, month, year, _, time] = when.split(' ')

    let [hours, minutes, seconds] = time.split(':')

    day     = parseInt(day)
    year    = parseInt(year)
    hours   = parseInt(hours)
    minutes = parseInt(minutes)
    seconds = parseInt(seconds)

    const date = new Date(year, months[month], day, hours, minutes, seconds)

    return {
        who,
        date,
    }
}

module.exports = parseHeader