// based on https://www.npmjs.com/package/gkm-class?activeTab=readme

const { EventEmitter2 } = require('eventemitter2')
const path = require('path');
const { spawn } = require('child_process');
var robot = require("robotjs");

class GKM extends EventEmitter2 {
  gkm;
  constructor() {
    super({ wildcard: true });
    console.log('spawning gkm...')
    this.gkm = spawn('java', ['-jar', path.join('lib/gkm.jar')]);
    this.gkm.stdout.on('data', (function (data) {
      data = data.toString().split(/\r\n|\r|\n/).filter(function (item) { return item; });
      for (var i in data) {
        var parts = data[i].split(':');
        this.emit(parts[0], parts.slice(1));
      }
    }).bind(this));
    console.log('...spawned gkm!')
  }
  quit() {
    console.log('removing event listeners...')
    this.removeAllListeners('*');
    console.log('...Event listeners removed!')
    this.gkm.kill();
    console.log('bobot exited...')
    process.exit();
  }
}

const bobot = new GKM()
const activeKeys = new Set()

function getActiveKeys () {
  return [...activeKeys]
}

bobot.on('key.*', function (data) {
  // this.emit(this.event, activeKeys)

  if (data[0]) {
    activeKeys.add(data[0])

    // unknown
    if (!['key.pressed', 'key.released', 'key.typed', 'key.pressing'].includes(this.event)) {
      console.log('unknown', this.event, activeKeys)
      this.emit('unknown', activeKeys)
    }

    if (this.event === 'key.pressed') {
      // console.log(this.event, activeKeys)
      this.emit('key.pressing', getActiveKeys())
    }

    if (activeKeys.size > 1 && this.event === 'key.released') {
      // console.log(this.event, activeKeys)
      this.emit('key.multi.released', getActiveKeys())
    }

    if (activeKeys.size === 1 && ['key.released', 'key.typed'].includes(this.event)) {
      // console.log(this.event, activeKeys)
      this.emit('key.single.released', getActiveKeys())
    }

    if (['key.released', 'key.typed', 'key.single.released', 'key.multi.released'].includes(this.event)) {
      // console.log('released', data[0])
      activeKeys.delete(data[0])
    }
  }

  function exitHandler(options, exitCode) {
    console.log('bobot is exiting...')
    bobot.quit()
  }
  
  // do something when app is closing
  process.on('exit', exitHandler);
  
  // catches ctrl+c event
  process.on('SIGINT', exitHandler);
  
  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', exitHandler);
  process.on('SIGUSR2', exitHandler);
  
  // catches uncaught exceptions
  process.on('uncaughtException', exitHandler);
})


module.exports = {
  bobot,
  robot
}