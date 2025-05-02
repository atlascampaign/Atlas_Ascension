let abilityData = {};
let character = document.querySelector('body').id; // Declare character globally

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

function stylePointElements() {
  // Get all elements with class 'point'
  const pointElements = document.querySelectorAll('.point:not(.locked)');
  
  // Iterate through each point element
  pointElements.forEach(point => {
    // Get the point's ID (e.g., 'p1' from class 'point p1')
    const pointId = Array.from(point.classList)
    .find(cls => cls.startsWith('p') && cls.length > 1 && !isNaN(cls.substring(1)));
    
    if (pointId) {
      // Apply styles to the main point element
      point.style.backgroundImage = `url('images/${character}/bg_${pointId}.png')`;
      point.style.backgroundSize = 'cover';
      
      // Find the card title within this point
      const cardTitle = point.querySelector('.card-title');
      
      if (cardTitle) {
        // Apply styles to the card title
        cardTitle.style.position = 'relative';
        
        // Create and style the pseudo-element
        const style = document.createElement('style');
        style.textContent = `
          .${pointId} .card-title::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url("images/${character}/bg_${pointId}.png");
            background-size: cover;
            background-position: center;
            opacity: 0.5;
            z-index: -1;
          }
        `;
        
        // Add the style to the document head
        document.head.appendChild(style);
      }
    }
  });
}


async function loadAbilities() {
  try {
    const response = await fetch(`utils/${character}.json`);
    abilityData = await response.json();
    populateUnlockedPoints();
    console.log(abilityData) // Store the JSON data
    stylePointElements();
  } catch (error) {
    console.error('Error loading abilities:', error);
  }
}

populateUnlockedPoints();

document.addEventListener("DOMContentLoaded", function () {
  loadAbilities();
  stylePointElements();
});

stylePointElements();

const ascension = {"hesperia" : "Astromanzia",
    "fedra" : "Primofulmine",
    "erevan" : "Campione del Fato",
    "narkran" : "Sentinella dell'Equilibrio",
    "yvette" : "Driade Iridescente"}


// Initial memories object
const initialMemories = {
    "hesperia": ["Azor'halun", "Teulos Avair", "Kalvas Astraiel", "Saeryn Lavaion", "Tyr'faelys", "Lumis Yoraan", "Onsaeru Luxian", "Yorion Ostraia", "Daelis Teunar"],
    "narkran" : ["Nel mezzo la via","Tra le dita la sabbia","Nel vento la dimora","Nel cuore il coraggio","Nella mente il giusto","Nel pugno la giustizia","Sulle gambe il sogno","Negli occhi la fermezza","Sopra di noi la fede"]
};

function updateSkillPoints() {
    document.querySelector('.skillsleft h3').textContent = skillPoints;
    sessionStorage.setItem('skillPoints', skillPoints);
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    // Initialize the skill points available
    skillPoints = parseInt(document.querySelector('.skillsleft h3').textContent);
  
    // Function to update the display of skill points
  
  
    // Increment skill points when clicking on the skillsleft element

  
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

const container = document.getElementById('container');

const skillsContainer = document.createElement('div');
skillsContainer.id = 'skills-container';


const skillsLeftDiv = document.createElement('div');
skillsLeftDiv.id = 'skills-left';
skillsLeftDiv.textContent = 'Recupera Ricordo';

const inputBoxWrapper = document.createElement('div');
inputBoxWrapper.style.display = 'flex';

const inputBox = document.createElement('input');
inputBox.id = 'input-box';
inputBox.type = 'text';
inputBox.style.alignSelf = 'center';

inputBoxWrapper.appendChild(inputBox);
skillsContainer.appendChild(skillsLeftDiv);
skillsContainer.appendChild(inputBoxWrapper);
container.appendChild(skillsContainer);

// Store memories in sessionStorage if not already present
if (!sessionStorage.getItem('memories')) {
    sessionStorage.setItem('memories', JSON.stringify(initialMemories));
}

// Retrieve memories from sessionStorage
let memories = JSON.parse(sessionStorage.getItem('memories'));

// Retrieve the current player character (pc) from the body ID
const pc = document.querySelector('body').id;

// Set the ascension description in the UI
const desc = ascension[pc];
document.querySelector('.skillsleft h1').textContent = desc;

// Add event listener for input box
inputBox.addEventListener('keydown', (event) => {
    // Check if the pressed key is Enter (key code 13)
    if (event.key === 'Enter') {
        const typedValue = event.target.value; // Keep the case sensitivity as is
        console.log(memories[pc]);

        // Retrieve the correct memory list for the current character
        if (memories[pc] && memories[pc].includes(typedValue)) {
            const index = memories[pc].indexOf(typedValue);
            memories[pc].splice(index, 1); // Remove the recovered memory from the list

            // Update the sessionStorage with the modified memories
            sessionStorage.setItem('memories', JSON.stringify(memories));

            // Increment the global skillPoints variable
            skillPoints++;

            // Update the UI with the new skill points
            updateSkillPoints();

            // Save the unlocked data to localStorage
            var unlockedData = gatherUnlockedData();
            saveUnlockedDataToLocalstorage(unlockedData);

            // Clear the input box after successful recovery
            inputBox.value = '';

            console.log(`Recovered memory: ${typedValue}. Skill points now: ${skillPoints}`);
        } else {
            console.log("Memory not found or already recovered.");
        }

        console.log("Updated Memories for " + pc + ": ", memories[pc]);
    }
});



// Create a new link element for the preconnect to Google Fonts
const preconnectGoogleFonts = document.createElement('link');
preconnectGoogleFonts.setAttribute('rel', 'preconnect');
preconnectGoogleFonts.setAttribute('href', 'https://fonts.googleapis.com');

// Create a new link element for the preconnect to Google Fonts
const preconnectGoogleFontsGstatic = document.createElement('link');
preconnectGoogleFontsGstatic.setAttribute('rel', 'preconnect');
preconnectGoogleFontsGstatic.setAttribute('href', 'https://fonts.gstatic.com');
preconnectGoogleFontsGstatic.setAttribute('crossorigin', 'anonymous');

// Create a new link element for the Google Fonts stylesheet
const googleFontsStylesheet = document.createElement('link');
googleFontsStylesheet.setAttribute('rel', 'stylesheet');
googleFontsStylesheet.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Bona+Nova+SC:ital,wght@0,400;0,700;1,400&display=swap');

// Get the existing head element
const head = document.querySelector('head');

// Append the new link elements to the head element
head.appendChild(preconnectGoogleFonts);
head.appendChild(preconnectGoogleFontsGstatic);
head.appendChild(googleFontsStylesheet);

document.querySelector('.skillsleft h1').textContent = desc

const baclinkDiv = document.createElement('div');
baclinkDiv.className = 'back-link';

const a = document.createElement('a');
a.href = '../index.html';

const backImg = document.createElement('img');
backImg.src = 'images/ccorb.png';

a.appendChild(backImg);

const forgetDiv = document.createElement('div');
forgetDiv.className = 'forget';

const span = document.createElement('span');
span.textContent = 'Oblio';

const img = document.createElement('img');
img.src = 'images/oblivion.png';

forgetDiv.appendChild(span);
forgetDiv.appendChild(img);

baclinkDiv.appendChild(a);

container.appendChild(forgetDiv);
container.appendChild(baclinkDiv);

document.querySelector('.forget').addEventListener('click', function() {
    localStorage.removeItem('unlockedData');
    sessionStorage.removeItem('memories');
    console.log("Local storage cleared.");
    location.reload();
  });

const audio = new Audio('audio/unlock-point.mp3');
const points = document.querySelectorAll('.point');

points.forEach(point => {
    point.addEventListener('click', function() {
      // Check if the point is locked
      if (!this.classList.contains('locked')) {
        // Check if there are skill points available and if the point hasn't been clicked before
        if (skillPoints > 0 && !this.classList.contains('clicked')) {
          // Play the sound
          if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0.1;
          }
          console.log("master audio played");
          audio.play();
  
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
          populateUnlockedPoints();
          stylePointElements();
  
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

let lastParticleTime = 0; // Tracks the last time a particle was created
const particleCooldown = 50; // Time in milliseconds between particles

document.addEventListener("mousemove", function (e) {
    const now = Date.now();
    if (now - lastParticleTime > particleCooldown) {
        createParticle(e.pageX, e.pageY);
        lastParticleTime = now;
    }
});

function createParticle(x, y) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    document.body.appendChild(particle);

    // Set initial position
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    // Random size
    const size = Math.random() + 1; // Random size between 6px and 14px
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Random movement direction
    const angle = Math.random() * 2 * Math.PI; // Random angle (0 to 360 degrees in radians)
    const distance = Math.random() * 25 + 10; // Moves between 10px and 35px
    const xMove = distance * Math.cos(angle);
    const yMove = distance * Math.sin(angle);

    // Apply animation (slower, more random movement)
    particle.animate(
        [
            { transform: `translate(0, 0)`, opacity: 1 },
            { transform: `translate(${xMove}px, ${yMove}px)`, opacity: 0 }
        ],
        {
            duration: 1200 + Math.random() * 500, // 1.2s - 1.7s for slower fade-out
            easing: "ease-out"
        }
    );

    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
    }, 1100);
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
  populateUnlockedPoints();
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
            lineFill.setAttribute('stroke', 'rgba(253, 88, 88, 0.8)');
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