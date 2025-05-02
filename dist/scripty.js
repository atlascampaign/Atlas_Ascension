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

let skillPoints;


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
updateSkillPoints();  
var retrievedData = getUnlockedDataFromLocalstorage();
console.log(retrievedData);
unlockElementsFromData(retrievedData);
loadSkillPoints(retrievedData);



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