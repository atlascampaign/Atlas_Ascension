const unlockmap = {
  fedra: {
    "p1": ["p2"],
    "p2": ["p3", "p4"],
    "p3": ["p5", "p6"],
    "p4": ["p8", "p7"],
    "p5": ["p16", "p9"],
    "p6": ["p9", "p16"],
    "p7": ["p11", "p9"],
    "p8": ["p9", "p11"],
    "p9": ["p15", "p17"],
    "p10": ["p13"],
    "p11": ["p14", "p17"],
    "p12": ["p16"],
    "p14": ["p10"],
    "p15": ["p14"],
    "p16": ["p15"],
    "p17": ["p14"],
  }
};

const connectionsMap = {
  one: ['two'],
  two: ['three', 'four'],
  three: ['five', 'six'],
  four: ['seven', 'eight'],
  five: ['sixteen', 'nine'],
  six: ['nine', 'sixteen'],
  seven: ['eleven', 'nine'],
  eight: ['nine', 'eleven'],
  nine: ['fifteen', 'seventeen'],
  ten: ['thirteen'],
  eleven: ['seventeen'],
  twelve: [],
  fourteen: ['ten'],
  fifteen: ['fourteen'],
  sixteen: ['fifteen'],
  seventeen: ['fourteen'],
  eighteen: [],
  nineteen: [],
  twenty: [],
  twentyone: []
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



// The local storage functions (getUnlockedDataFromLocalstorage, saveUnlockedDataToLocalstorage, unlockElementsFromData)
// are also managed by master.js.

// The DOMContentLoaded listener for initializing skill points and loading from local storage
// is now handled in master.js.

// The click listener for the skillsleft h3 is in master.js.

// The mouseenter/mouseleave listeners for z-index are in master.js.

// The generic click listener on all points is handled in master.js.

// Keep any Fedra-specific audio logic if it's unique to this character.
