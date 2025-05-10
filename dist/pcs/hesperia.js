const unlockmap = {
  hesperia: {
    "p1": ["p2"],
    "p2": ["p5","p3"],
    "p3": ["p15","p6"],
    "p4": ["p8","p9"],
    "p5": ["p6","p16"],
    "p6": ["p4","p7"],
    "p7": ["p8","p9"],
    "p8": ["p10"],
    "p9": ["p11"],
    "p10": ["p12"],
    "p11": ["p14"],
    "p12": ["p13"],
    "p14": ["p13"],
    "p15": ["p4"],
    "p16": ["p7"],
  }
};

const connectionsMap = {
  one: ['two'],
  two: ['five','three'],
  three: ['six','fifteen'],
  four: [''],
  five: ['sixteen','six'],
  six: ['four','seven'],
  seven: [''],
  eight: ['ten'],
  nine: ['eleven'],
  ten: ['twelve'],
  eleven: ['fourteen'],
  twelve: [''],
  fourteen: [''],
  fifteen: ['four'],
  sixteen: ['seven'],
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