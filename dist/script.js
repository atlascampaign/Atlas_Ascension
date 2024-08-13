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

let skillPoints;

let character = document.querySelector('body').id; // Declare skillPoints globally
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
  skillPoints = parseInt(document.querySelector('.skillsleft h3').textContent);

  // Function to update the display of skill points


  // Increment skill points when clicking on the skillsleft element
  document.querySelector('.skillsleft h3').addEventListener('click', function() {
    skillPoints++;
    updateSkillPoints();
  });

  // Check if there's any data in the local storage
  var retrievedData = getUnlockedDataFromLocalstorage();
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



function unlockPoint(pointClass) {
  const point = document.querySelector(`.${pointClass}`);
  if (point) {
    point.classList.remove('locked');

    // Redraw lines after unlocking the point
    drawLines();

    // Gather unlocked data and print JSON
    var unlockedData = gatherUnlockedData();
    console.log(JSON.stringify(unlockedData, null, 2));
    saveUnlockedDataToLocalstorage(unlockedData);
  }
}
updateSkillPoints();  
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

          if (connectedPoint.classList.contains('clicked') && point.classList.contains('clicked')) {
            lineFill.setAttribute('stroke', 'rgba(255, 204, 0, 0.8)');
            lineFill.setAttribute('stroke-width', '4');
            lineBorder.setAttribute('stroke-width', '6')
          } else {
            lineFill.setAttribute('stroke', 'rgba(6, 71, 99, 0.8)');
            lineFill.setAttribute('stroke-width', '1');
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

// Call drawLines function to initially draw the lines
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
const points = document.querySelectorAll('.point');
points.forEach(point => {
  point.addEventListener('click', function() {
    // Check if the point is locked
    if (!this.classList.contains('locked')) {
      // Check if there are skill points available and if the point hasn't been clicked before
      if (skillPoints > 0 && !this.classList.contains('clicked')) {
        // Decrease the skill points available
        skillPoints--;
        // Update the display
        updateSkillPoints();

        // Add classes to indicate that the point has been clicked and apply border
        this.classList.add('clicked', 'bordered');
        // Add a class to trigger the flash effect
        this.classList.add('flash');
        // Remove the class after a delay to reset the effect
        setTimeout(() => {
          this.classList.remove('flash');
        }, 500); // Adjust the duration as needed

        // Unlock points based on the map
        unlockPointsFromMap(this.classList[1]);

        // Additional logic for when points are clicked
        var pointsClicked = document.querySelectorAll('.point.clicked').length;
        if (pointsClicked >= 8) {
          unlockPoint('p13');
        }

        console.log(pointsClicked);

        drawLines();
      } else {
        // Display a message or perform any other action if no skill points are available
        console.log("No skill points available or the point has been clicked before.");
      }
    } else {
      // Display a message or perform any other action if the point is locked
      console.log("This point is locked and cannot be clicked.");
    }
  });
});

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
