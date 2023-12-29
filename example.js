
const { bobot, robot } = require('./Bobot')

// console.log(bobot)

bobot.on('key.single.released', data => console.log('key.single.released', data))

bobot.on('key.multi.released', data => {
  console.log('key.multi.released', data)

  if (arraysEqual(data, [ 'Left Control', 'Left Shift', 'Back Slash' ])) {
    // pause
    clearTimeout(timeout)
    console.log('...paused!')
    active = false
  }

  if (arraysEqual(data, [ 'Left Control', 'Left Shift', 'Close Bracket' ])) {
    // start
    active = true
    start()
  }
})

bobot.on('key.pressing', data => console.log('key.pressing', data))

let active = false

const actions = [
  randomDirection,
  randomMouseMove,
  randomScroll
]

let timeout
function start () {
  if (!active) {
    clearTimeout(timeout)
    return;
  }
  console.log('starting...')
  timeout = setTimeout(() => {
    actions[getRandomInt(0, 2)]()
    start()
  }, getRandomInt(1000, 3000))
}

// bobot.on('mouse.*', data => console.log('key.pressing', data))

// robot.typeString("Hello World");

// robot.keyTap("enter");

// Helper functions
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  
  return arr1.every((el, i) => el === arr2[i]);
}

// Get screen info
const screenSize = robot.getScreenSize();
const screenMidX = Math.floor(screenSize.width / 2);
const screenMidY = Math.floor(screenSize.height / 2);

// Random arrow key, Page up/down
function randomDirection () {
  const direction = ["up", "down", "left", "right", "pageup", "pagedown"];
  for (let i=0; i<getRandomInt(5, 30); i++) {
    console.log('arrow navigation...')
    robot.setKeyboardDelay(getRandomInt(0, 3000));
    robot.keyTap(direction[getRandomInt(0, 5)], getRandomInt(0, 1) ? 'shift' : []);
  }
}



function randomScroll() {
  for (let i=0; i<getRandomInt(5, 50); i++) {
    robot.setMouseDelay(getRandomInt(0, 2000));
    console.log('scrolling...')
    if (getRandomInt(0, 1)) {
      robot.scrollMouse(getRandomInt(-100, 100), 0);
    } else {
      robot.scrollMouse(0, getRandomInt(-100, 100));
    }
  }
}

function randomMouseMove () {
  console.log('moving mouse...')
  const x = getRandomInt(0, screenSize.width);
  const y = getRandomInt(0, screenSize.height);

  robot.setMouseDelay(getRandomInt(0, 2000));
  robot.moveMouseSmooth(x, y, getRandomInt(0, 5));

  robot.setMouseDelay(getRandomInt(0, 2000));
  robot.moveMouseSmooth(
    screenSize.width/2 + getRandomInt(-64, 64), 
    screenSize.height/2 + getRandomInt(-64, 64), 
    getRandomInt(0, 5)
  );

  robot.setMouseDelay(getRandomInt(0, 3000));
  robot.mouseClick();

  for (let i=0; i<getRandomInt(0, 5); i++) {
    robot.setKeyboardDelay(getRandomInt(0, 1000));
    robot.keyTap('escape');
  }
}

process.stdin.resume();

active = true
start()

module.exports = {
  bobot,
  robot
}