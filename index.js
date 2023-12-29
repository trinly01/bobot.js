
var robot = require("robotjs");

const { bobot } = require('./Bobot')

// console.log(bobot)

bobot.on('key.single.released', data => console.log('key.single.released', data))

bobot.on('key.multi.released', data => console.log('key.multi.released', data))

bobot.on('key.pressing', data => console.log('key.pressing', data))

bobot.on('mouse.*', data => console.log('key.pressing', data))

// robot.typeString("Hello World");

// robot.keyTap("enter");

// Helper functions
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDelay(min, max) {
  return getRandomInt(min, max) * 100; 
}

// Get screen info
const screenSize = robot.getScreenSize();
const screenMidX = Math.floor(screenSize.width / 2);
const screenMidY = Math.floor(screenSize.height / 2);

  // Random arrow key
  const arrows = ["up", "down", "left", "right"];
  for (let i=0; i<getRandomInt(0, 10); i++) {
    robot.keyTap(arrows[getRandomInt(0, 3)]);
  }

  // Page up/down
  const pgChange = getRandomInt(0, 10);
  if (pgChange > 5) {
    robot.keyTap("pageup");
  } else {
    robot.keyTap("pagedown");
  }

  // Random mouse movement
  const x = getRandomInt(0, screenSize.width);
  const y = getRandomInt(0, screenSize.height);
  robot.moveMouseSmooth(x, y);
  
  // Small delay
  robot.setKeyboardDelay(randomDelay(100, 400));

module.exports = {
  bobot,
  robot
}