const fs = require('fs')

const convertEntryToMinutes = entry => {
  const [hours, minutes] = entry.split(':')
  return parseInt(hours) * 60 + parseInt(minutes)
}

const convertMinutesToEntry = minutes => {
  const time = new Date(0, 0)
  time.setMinutes(minutes)
  return time.toTimeString().slice(0, 5)
}

const getFile = async path => {
    try {
      const data = await fs.readFileSync(path, { encoding: 'utf8' })
      return data.split('\n')
    } catch (_) {
      throw new Error(`File '${path}' does not exists or require permissions`)
    }
  }

module.exports = {
  convertEntryToMinutes,
  convertMinutesToEntry,
  getFile
}
