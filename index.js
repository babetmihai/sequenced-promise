const sequentialPromise = (fn) => {
  let lastPromise = Promise.resolve()
  return (...args) => new Promise((resolve, reject) => {
    const _lastPromise = lastPromise

    let thisResolve
    let thisReject
    const thisPromise = new Promise((_thisResolve, _thisReject) => {
      thisResolve = _thisResolve
      thisReject = _thisReject
    })

    lastPromise = thisPromise
    _lastPromise
      .then(() => {
        return fn(...args)
          .then((res) => {        
            resolve(res)
            thisResolve()
          })
          .catch((error) => {
            reject(error)
            if (thisPromise !== lastPromise) {
              thisReject(error)
            } else {
              thisResolve()
            }
          })
      })
      .catch((error) => {
        reject(error)
        if (thisPromise !== lastPromise) {
          thisReject(error)
        } else {
          thisResolve()
        }
      })
  })
}


//test
const delay = (time, msg = '') => new Promise((resolve, reject) => setTimeout(() => {
  if (msg.toString().startsWith('err')) return reject(new Error(msg))
  return resolve(msg)
}, time))
const consolePromise = sequentialPromise(delay)

consolePromise(300, 1).then(console.log).catch((error) => console.log('error', error.message))
consolePromise(200, 'err2').then(console.log).catch((error) => console.log('error', error.message))
consolePromise(100, 3).then(console.log).catch((error) => console.log('error', error.message))
delay(500).then(() => consolePromise(400, 4).then(console.log).catch((error) => console.log('error', error.message)))
delay(700).then(() => consolePromise(100, 5).then(console.log).catch((error) => console.log('error', error.message)))
