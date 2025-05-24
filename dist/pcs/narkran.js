const unlockmap = {
    narkran: {
      "p1": ["p3","p4"],
      "p2": ["p6"],
      "p3": ["p5","p2"],
      "p4": ["p7","p14"],
      "p5": ["p6"],
      "p6": ["p16","p12","p11","p15"],
      "p7": ["p22"],
      "p8": ["p10"],
      "p9": ["p21"],
      "p10": ["p13"],
      "p11": ["p17"],
      "p12": ["p20"],
      "p14": ["p22"],
      "p15": ["p17"],
      "p16": ["p20"],
      "p17": ["p19","p18","p8","p9"],
      "p18": ["p21"],
      "p19": ["p10"],
      "p20": ["p19","p18","p8","p9"],
      "p21": ["p13"],
      "p22": ["p16","p12","p11","p15"],
    }
  };
  
  const connectionsMap = {
    one: ['three','four'],
    two: ['six'],
    three: ['two','five'],
    four: ['seven','fourteen'],
    five: ['six'],
    six: [],
    seven: ['twentytwo'],
    eight: ['ten'],
    nine: ['twentyone'],
    ten: ['nineteen'],
    eleven: ['seventeen'],
    twelve: ['twenty'],
    fourteen: ['twentytwo'],
    fifteen: ['seventeen'],
    sixteen: ['twenty'],
    seventeen: [],
    eighteen: [''],
    nineteen: [''],
    twenty: [],
    twentyone: ['eighteen'],
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
  console.log('here is', character)
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