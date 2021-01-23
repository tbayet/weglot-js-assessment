const { convertEntryToMinutes, convertMinutesToEntry } = require('./utils')
const { WORK_STARTS_AT, WORK_ENDS_AT, MEETING_TIME } = require('../config')

const scopeStart = convertEntryToMinutes(WORK_STARTS_AT) - 1
const scopeEnd = convertEntryToMinutes(WORK_ENDS_AT) + 1

const formatUnavailabilitiesFromFile = (file) => {
  const unavailabilities = Array(5).fill(0).map(e => [])

  // Format file data into a double array of unavailabilities
  file.forEach(entry => {
    const [day, entryStart, entryEnd] = entry.split(/[ -]/)
    const index = parseInt(day) - 1
    let start = convertEntryToMinutes(entryStart)
    let end = convertEntryToMinutes(entryEnd)

    if (start - scopeStart < MEETING_TIME) {
      start = scopeStart
    }
    if (scopeEnd - end < MEETING_TIME) {
      end = scopeEnd
    }

    unavailabilities[index].push({ start, end })
  })
  return unavailabilities
}

// merge overlaping time slots
const mergeUnavailabilities = (unavailabilities) => unavailabilities
  .map(daySlots => daySlots
    .sort((a, b) => (a.start - b.start))
    .reduce((mergedUnavailabilities, slot) => {
      const index = mergedUnavailabilities.findIndex(s => (slot.start - MEETING_TIME) < s.end)
      if (index !== -1) {
        mergedUnavailabilities[index].end = Math.max(slot.end, mergedUnavailabilities[index].end)
      } else {
        mergedUnavailabilities.push(slot)
      }
      return mergedUnavailabilities
    }, [])
  )

// find the first MEETING_TIME slot available
const findAvailability = (mergedUnavailabilities) => {
  let firstAvaibility = null

  mergedUnavailabilities.some((day, dayNumber) => {
    day.some((slot, index) => {
      if (index === 0 && (slot.start - scopeStart >= MEETING_TIME)) {
        firstAvaibility = scopeStart
      } else if (index && (slot.start - day[index - 1].end >= MEETING_TIME)) {
        firstAvaibility = day[index - 1].end
      } else if (index === day.length - 1 && (scopeEnd - slot.end >= MEETING_TIME)) {
        firstAvaibility = slot.end
      }
      return firstAvaibility
    })

    // format result
    if (firstAvaibility) {
      firstAvaibility =
        `${dayNumber + 1} ${convertMinutesToEntry(firstAvaibility + 1)
        }-${convertMinutesToEntry(firstAvaibility + MEETING_TIME)}`
    }
    return firstAvaibility
  })
  return firstAvaibility
}

const findAvailabilityFromFile = file => {
  const unavailabilities = formatUnavailabilitiesFromFile(file)
  const mergedUnavailabilities = mergeUnavailabilities(unavailabilities)
  const result = findAvailability(mergedUnavailabilities)
  return result
}

module.exports = findAvailabilityFromFile
