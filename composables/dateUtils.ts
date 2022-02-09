import format from 'date-fns/format/index.js'

/**
 * Get the locale date and return a nice date format.
 */
function getLocalDate(simpleDate: string): string {
    const date = new Date(simpleDate)
    return format(date, "dd-MM-yyyy")
}

export default () => {
    return { getLocalDate }
}
