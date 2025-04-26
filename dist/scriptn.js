let abilityData = {};
let character; // Declare character globally

async function loadAbilities() {
  try {
    const response = await fetch('utils/narkran.json'); // Fetch the JSON file
    abilityData = await response.json();
    populateUnlockedPoints();
    console.log(abilityData) // Store the JSON data
  } catch (error) {
    console.error('Error loading abilities:', error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  character = document.querySelector('body').id;
  loadAbilities();
});

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
      "p10": ["p8"],
      "p11": ["p17"],
      "p12": ["p20"],
      "p14": ["p22"],
      "p15": ["p17"],
      "p16": ["p20"],
      "p17": ["p19","p18","p8","p9"],
      "p18": ["p21"],
      "p19": ["p10"],
      "p20": ["p19","p18","p8","p9"],
      "p21": ["p18"],
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

let skillPoints;

console.log(character);

function unlockPointsFromMap(clickedPoint) {
  const unlockList = unlockmap[character][clickedPoint]; // Access the correct nested object
  if (unlockList) {
    console.log("Unlocking points:", unlockList);
    unlockList.forEach(point => unlockPoint(point));
  } else {
    console.log("No unlock list found for clicked point:", clickedPoint);
  }
}



function updateSkillPoints() {
  document.querySelector('.skillsleft h3').textContent = skillPoints;
}

document.addEventListener("DOMContentLoaded", function() {
  // Initialize the skill points available
  var retrievedData = getUnlockedDataFromLocalstorage();
  skillPoints = retrievedData.length > 0 ? retrievedData[0].skillpoints : 0;
  updateSkillPoints();

  // Increment skill points when clicking on the skillsleft element
  document.querySelector('.skillsleft h3').addEventListener('click', function() {
    skillPoints++;
    updateSkillPoints();
  });

  // Check if there's any data in the local storage
  console.log('HAAAAAAAAAAAAAAAAAAAAAAAAAAA', retrievedData);

  // If local storage is empty, initialize with a default JSON structure
  if (!retrievedData || retrievedData.length === 0) {
    var defaultData = [{ id: "", maps: "", skillpoints: 0 }];
    saveUnlockedDataToLocalstorage(defaultData);
  }
  else {
    var mapss = retrievedData.map(function(item) {
      return item.maps;
    });
    console.log(mapss);
    mapss.forEach(point => unlockPointsFromMap(point));
  }
});

function populateUnlockedPoints() {
  document.querySelectorAll('.point').forEach(point => {
    if (!point.classList.contains('locked')) { // Only target non-locked points
      const pointClass = [...point.classList].find(cls => /^p\d+$/.test(cls)); // Find class matching "pX"
      if (pointClass && abilityData[pointClass]) {
        const ability = abilityData[pointClass];

        // Find the card elements inside this point
        const card = point.querySelector('.card');
        if (card) {
          card.querySelector('.card-title h3').textContent = ability.titolo;
          card.querySelector('.card-foot span:not(.quote)').innerHTML = ability.abilita.replace(/\n/g, '<br>'); // Preserve line breaks
          card.querySelector('.quote').innerHTML = ability.quote;
        }
      }
    }
  });
}
populateUnlockedPoints();

function unlockPoint(pointClass) {
  const point = document.querySelector(`.${pointClass}`);
  if (point) {
    point.classList.remove('locked');

    populateUnlockedPoints();
    // Redraw lines after unlocking the point
    drawLines();

    // Gather unlocked data and print JSON
    var unlockedData = gatherUnlockedData();
    console.log(JSON.stringify(unlockedData, null, 2));
    saveUnlockedDataToLocalstorage(unlockedData);
  }
}

var retrievedData = getUnlockedDataFromLocalstorage();
console.log(retrievedData);
unlockElementsFromData(retrievedData);
loadSkillPoints(retrievedData);

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

  
document.addEventListener("DOMContentLoaded", function() {
  const points = document.querySelectorAll('.point');

  points.forEach(point => {
    point.addEventListener('mouseenter', () => {
      point.style.zIndex = '3'; // Set the z-index of the point to a higher value
    });

    point.addEventListener('mouseleave', () => {
      point.style.zIndex = '1'; // Reset the z-index of the point
    });
  });
});

// Add click event listener to each .point element

function gatherUnlockedData() {
  var unlockedElements = document.querySelectorAll('.clicked');
  var unlockedData = [];
  var skillPointsElement = document.querySelector('.skillsleft h3');
  var skillPoints = skillPointsElement ? parseInt(skillPointsElement.textContent) : 0;

  unlockedElements.forEach(function(element) {
    var id = element.getAttribute('id');
    var map = element.getAttribute('class').split(' ')[1];
    console.log("HERE",map);

    // Construct an object for each unlocked element
    var unlockedItem = {
      id: id,
      maps: map,
      skillpoints: skillPoints // Add more properties as needed
    };

    // Push the object to the array
    unlockedData.push(unlockedItem);
  });



  return unlockedData;
}

function saveUnlockedDataToLocalstorage(data) {
  localStorage.setItem('unlockedData', JSON.stringify(data));
}

function getUnlockedDataFromLocalstorage() {
  var data = localStorage.getItem('unlockedData');
  return data ? JSON.parse(data) : [];
}

function unlockElementsFromData(data) {
  // Loop through each item in the retrieved data
  data.forEach(function(item) {
    // Get the ID from the item
    var id = item.id;

    // Unlock the element with the corresponding ID
    var element = document.getElementById(id);
    if (element) {
      element.classList.remove('locked');
      element.classList.add('clicked');

      // Additional unlocking logic based on the map can go here

      drawLines();
    }
  });
};

function loadSkillPoints(data) {
  if (data.length > 0 && data[0].hasOwnProperty('skillpoints')) {
      var skillPoints = data[0].skillpoints;
      document.querySelector('.skillsleft h3').textContent = skillPoints.toString();
  } else {
      data = { id: "", maps: "", skillpoints: 0 };
      document.querySelector('.skillsleft h3').textContent = "0"; // or handle as needed
  }
}

