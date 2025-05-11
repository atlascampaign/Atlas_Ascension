let character = document.querySelector('body').id;

const unlockmap = {
  erevan: {
    "p1": ["p2", "p3","p4"],
    "p2": ["p5","p7"],
    "p3": ["p5"],
    "p4": ["p7"],
    "p5": ["p6","p12"],
    "p6": ["p16"],
    "p7": ["p14", "p11"],
    "p8": ["p19"],
    "p9": ["p18"],
    "p10": ["p19"],
    "p11": ["p15"],
    "p12": ["p16"],
    "p14": ["p15"],
    "p15": ["p17","p20"],
    "p16": ["p17","p20"],
    "p17": ["p9","p21"],
    "p20": ["p10","p8"],
    "p21": ["p18"],
  }
};

const connectionsMap = {
  one: ['two', 'three', 'four'],
  two: ['five','seven'],
  three: ['five'],
  four: ['seven'],
  five: ['twelve','six'],
  six: ['sixteen'],
  seven: ['fourteen', 'eleven'],
  eight: ['nineteen'],
  nine: ['eighteen'],
  ten: ['nineteen'],
  eleven: ['fifteen'],
  twelve: ['sixteen'],
  fourteen: ['fifteen'],
  seventeen: ['twentyone','nine'],
  eighteen: ['thirteen'],
  nineteen: ['thirteen'],
  twenty: ['ten','eight'],
  twentyone: ['eighteen'],
  // Add more mappings as needed
};

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