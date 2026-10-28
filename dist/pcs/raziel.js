// Percorso a clessidra, simmetrico rispetto all'asse centrale: ogni livello offre al massimo due nodi
// alternativi (se ne sceglie uno solo) e tutti i percorsi arrivano a thirteen (Equilibrio Assoluto).
//   p1 -> p4 | p5 -> p3 -> p6 | p7 -> p2 -> p10 | p11 -> p16 | p17 -> p19 | p18 -> p13
const connectionsMap = {
  one: ["four", "five"],
  two: ["ten", "eleven"],
  three: ["six", "seven"],
  four: ["three"],
  five: ["three"],
  six: ["two"],
  seven: ["two"],
  ten: ["sixteen"],
  eleven: ["seventeen"],
  sixteen: ["nineteen"],
  seventeen: ["eighteen"],
  eighteen: [],   // su desktop nessuna linea dagli ultimi due nodi al finale (resta lo sblocco in unlockmap)
  nineteen: []
}

const unlockmap = {
  raziel : {
  "p1": ["p4", "p5"],
  "p3": ["p6", "p7"],
  "p4": ["p3"],
  "p5": ["p3"],
  "p6": ["p2"],
  "p7": ["p2"],
  "p2": ["p10", "p11"],
  "p10": ["p16"],
  "p11": ["p17"],
  "p16": ["p19"],
  "p17": ["p18"],
  "p18": ["p13"],
  "p19": ["p13"]
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

