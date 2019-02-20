wrapper that makes an asynchronous service run sequentially in the order it was called

#### Setup
```
npm i -S sequenced-promise
```
```
const sequencedPromise = require('sequenced-promise')
```
```
const delay = (time, msg = '') => new Promise((resolve, reject) => setTimeout(() => {
  if (msg.toString().startsWith('err')) return reject(new Error(msg))
  return resolve(msg)
}, time))
const sequencedLog = sequencedPromise(delay)
```

#### Example 1
```
sequencedLog(600, 1).then(console.log, console.log)
sequencedLog(500, 2).then(console.log, console.log)
sequencedLog(400, 3).then(console.log, console.log)
delay(1200).then(() => consolePromise(100, 4).then(console.log, console.log))
```
```
1
2
3
4
```
#### Example 2
```
sequencedLog(600, 1).then(console.log, console.log)
sequencedLog(500, 'err2').then(console.log, console.log)
sequencedLog(400, 3).then(console.log, console.log)
delay(1200).then(() => consolePromise(100, 4).then(console.log, console.log))
```
```
1
err2
err2
4
```
