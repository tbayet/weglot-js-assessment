const findAvailabilityFromFile = require('./findAvailabilityFromFile')
const { getFile } = require('utils')

if (process.argv.length < 3) {
  console.warn('** argument filepath expected **\nusage: npm start [filepath]')
} else {
  getFile(process.argv[2])
    .then(file => {
      console.info(findAvailabilityFromFile(file))
    })
    .catch(console.error)
}
