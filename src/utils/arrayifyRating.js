function arrayifyRating(mappedRating) {
    const strings = Object.keys(mappedRating)

    const rating = strings.map(str => ({
        str,
        count: mappedRating[str]
    }))

    rating.sort(
        (a, b) => b.count !== a.count ? b.count - a.count  // по рейтингу,
            : a.str < b.str ? -1 : a.str === b.str ? 0 : 1 // иначе по алфавиту
    )

    return rating
}

module.exports = arrayifyRating