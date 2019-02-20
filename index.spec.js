const assert = require('assert')
const sequencedPromise = require('./dist').default

const delay = (time) => new Promise((resolve) => setTimeout(() => resolve(time), time))
const sequencedLog = sequencedPromise(delay)

describe('test order promise', () => {
  it('should resolve everything in order', () => {
    const result = []
    return Promise.all([
      sequencedLog(200).then((res) => result.push(res)),
      sequencedLog(100).then((res) => result.push(res)),
      delay(150).then(() => sequencedLog(1000).then((res) => result.push(res))),
      delay(250).then(() => sequencedLog(400).then((res) => result.push(res)))
    ])
      .then(() => assert.deepEqual(result, [200, 100, 1000, 400]))
  })
})