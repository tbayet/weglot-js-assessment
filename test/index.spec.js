const { getFile } = require('../src/utils')
const findAvailabilityFromFile = require('../src/findAvailabilityFromFile')

const NB_FILE_TESTS = 5

describe('comparing inputs and outputs files', () => {
    const pathList = new Array(NB_FILE_TESTS * 2)
        .fill(0)
        .map((_, index) => `data/${index < NB_FILE_TESTS ? 'input' : 'output'}${index % NB_FILE_TESTS + 1}.txt`)

    // loads files before tests
    let inputs
    let outputs
    beforeAll(async () => {
        try {
            const files = await Promise.all(pathList.map(path => getFile(path)))
            inputs = [...files]
            outputs = inputs.splice(NB_FILE_TESTS, NB_FILE_TESTS)
        } catch(err) {
            console.error(err)
        }
    });

    // executes all tests
    for (let i = 0; i < NB_FILE_TESTS; i++) {
        test(pathList[i], () => {
            const result = findAvailabilityFromFile(inputs[i])
            expect([result]).toEqual(outputs[i]);
        });
    }
})
