

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

function drawLines() {
  const container = document.getElementById('container');
  let svg = document.getElementById('linesSvg');

  if (!svg) {
    // If SVG element does not exist, create a new one
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('id', 'linesSvg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    container.appendChild(svg);
  } else {
    // Clear existing lines
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
  }

  // Get all points
  const points = document.querySelectorAll('.point');
  const lines = [];

    // Iterate through each point to determine connections
    points.forEach(point => {
        // Get the connections data attribute value
        const connections = point.dataset.connections;
        if (connections) {
            // Split the connections string into an array of points
            const connectedPoints = connections.split(',');

            // Calculate coordinates of the current point
            const rect1 = point.getBoundingClientRect();
            const x1 = rect1.left + rect1.width / 2;
            const y1 = rect1.top + rect1.height / 2;

            // Iterate through connected points to draw lines
            const purpleConnections = ["one","two", "three","five","six","twelve","sixteen","twenty","eight","ten","nineteen"];
            const goldConnections = ["one","four", "seven","fourteen","twentytwo","eleven","fifteen","seventeen","nine","twentyone","eighteen"];

            // Iterate through connected points to draw lines
            connectedPoints.forEach(connectedPointId => {
            const connectedPoint = document.getElementById(connectedPointId.trim());
            if (connectedPoint) {
                // Calculate coordinates of the connected point
                const rect2 = connectedPoint.getBoundingClientRect();
                const x2 = rect2.left + rect2.width / 2;
                const y2 = rect2.top + rect2.height / 2;

                // Create a line element for the border
                const lineBorder = document.createElementNS("http://www.w3.org/2000/svg", "line");
                lineBorder.setAttribute('x1', x1);
                lineBorder.setAttribute('y1', y1);
                lineBorder.setAttribute('x2', x2);
                lineBorder.setAttribute('y2', y2);
                lineBorder.setAttribute('stroke', 'rgba(22, 22, 22, 0.8)'); // Set the border color
                lineBorder.setAttribute('stroke-width', '4'); // Set the border width
                svg.appendChild(lineBorder);

                // Create a line element for the fill
                const lineFill = document.createElementNS("http://www.w3.org/2000/svg", "line");
                lineFill.setAttribute('x1', x1);
                lineFill.setAttribute('y1', y1);
                lineFill.setAttribute('x2', x2);
                lineFill.setAttribute('y2', y2);

                // Check if the connection is in the purple or gold list
                if (connectedPoint.classList.contains('clicked') && point.classList.contains('clicked')) {
                    if (purpleConnections.includes(connectedPointId.trim()) && purpleConnections.includes(point.id.trim())) {
                        lineFill.setAttribute('stroke', 'purple');
                        lineFill.setAttribute('stroke-width', '4');
                        lineBorder.setAttribute('stroke-width', '6');
                    } else if (goldConnections.includes(connectedPointId.trim()) && goldConnections.includes(point.id.trim())) {
                        lineFill.setAttribute('stroke', 'gold');
                        lineFill.setAttribute('stroke-width', '4');
                        lineBorder.setAttribute('stroke-width', '6');
                }} else {
                lineFill.setAttribute('stroke', 'rgba(22, 22, 22, 0.8)'); // Apply the gradient
                lineFill.setAttribute('stroke-width', '2'); // Adjust stroke width as needed
                lineFill.setAttribute('opacity', '0.3');
                }

                    // Append the fill line to the SVG
                    svg.appendChild(lineFill);

                    // Push the line to the lines array (for future reference)
                    lines.push(lineFill);
                }
            });
        }
    });

    // Update lines when window is resized
    window.addEventListener('resize', drawLines);
}


// Call drawLines initially to set up the lines
drawLines();