const connectionsMap = {
  one: ["two"],
  two: ["three", "five"],
  three: ["six"],
  four: ["eight", "ten"],
  five: ["six"],
  six: ["four", "seven"],
  seven: ["nine", "eleven"],
  eight: ["nineteen", "twenty"],
  nine: ["seventeen", "eighteen"],
  ten: ["twelve", "sixteen"],
  eleven: ["fourteen", "fifteen"],
  twelve: [],
  thirteen: [],
  fourteen: [],
  fifteen: [],
  sixteen: [],
  seventeen: [],
  eighteen: [],
  nineteen: [],
  twenty: []
}

const unlockmap = {
  yvette : {
  "p1": ["p2"],
  "p2": ["p3", "p5"],
  "p3": ["p6"],
  "p4": ["p8", "p10"],
  "p5": ["p6"],
  "p6": ["p4", "p7"],
  "p7": ["p9", "p11"],
  "p8": ["p19", "p20"],
  "p9": ["p17", "p18"],
  "p10": ["p12", "p16"],
  "p11": ["p14", "p15"],
  "p12": ["p21"],
  "p14": ["p22"],
  "p15": ["p22"],
  "p16": ["p21"],
  "p17": ["p22"],
  "p18": ["p22"],
  "p19": ["p21"],
  "p20": ["p21"],
  "p21": ["p13"],
  "p22": ["p13"]
}}

const pointElements = document.querySelectorAll('.point');
pointElements.forEach(element => {
  const pointId = element.id;
  const connections = connectionsMap[pointId];
  if (connections) {
    element.setAttribute('data-connections', connections.join(', '));
  }
});

function unlockPointsFromMap(clickedPoint) {
  const unlockList = unlockmap[character][clickedPoint]; // Access the correct nested object
  if (unlockList) {
    console.log("Unlocking points from map:", unlockList);
    unlockList.forEach(point => unlockPoint(point));
  } else {
    console.log("No unlock list found for clicked point:", clickedPoint);
  }
}

// The unlockPoint function should remain as master.js calls it.
// Ensure it's consistent with the master.js version if you've made changes there.
function unlockPoint(pointClass) {
  const point = document.querySelector(`.${pointClass}`);
  if (point) {
    point.classList.remove('locked');
    // master.js handles drawing lines and saving data
  }
}

