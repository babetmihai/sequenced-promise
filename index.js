export default (fn) => {
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
            return thisResolve()
          })
          .catch((error) => {
            reject(error)
            if (thisPromise !== lastPromise) {
              return thisReject(error)
            }
            return thisResolve()
          })
      })
      .catch((error) => {
        reject(error)
        if (thisPromise !== lastPromise) {
          return thisReject(error)
        }
        return thisResolve()
      })
  })
}
