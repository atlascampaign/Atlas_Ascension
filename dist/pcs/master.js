// Show loading screen immediately
document.body.insertAdjacentHTML('afterbegin', `
  <div id="loading-screen">
    <div class="loading-content">
      <div class="loading-spinner"></div>
      <p>Rintraccio ricordi...</p>
    </div>
  </div>
`);

// Function to hide loading screen
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.remove();
    }, 500); // Match this with the CSS transition duration
  }
}

// Wait for all critical assets to load
window.addEventListener('load', function() {
  // Additional delay to ensure everything is ready (optional)
  setTimeout(hideLoadingScreen, 500);
});

// Fallback in case the load event doesn't fire
setTimeout(hideLoadingScreen, 10000); // 10 second timeout as last resort

let abilityData = {};
let character = document.querySelector('body').id; // Declare character globally
console.log(character)
let skillPoints = 0;

document.body.addEventListener('touchmove', (e) => {
  if (window.scrollY <= 0) e.preventDefault();
}, { passive: false });

// Update skill points display
function updateSkillPoints() {
  document.querySelector('.skillsleft h3').textContent = skillPoints;
}


// Load initial data from Supabase
async function initializeCharacterState() {
  const { data, error } = await client
    .from('points')
    .select('available, unlocked')
    .eq('player', character)
    .single();

  if (error) {
    console.error('Failed to fetch character state:', error.message);
    return;
  }

  console.log("Data:", data)
  // Set skill points
  skillPoints = data.available || 0;
  updateSkillPoints();

  // Unlock points in the UI based on loaded data
  const unlockedData = data.unlocked || {};
  document.querySelectorAll('.point').forEach(point => {
    const pointClass = [...point.classList].find(cls => /^p\d+$/.test(cls));
    if (pointClass && unlockedData[pointClass]) {
      point.classList.remove('locked');
      point.classList.add('clicked'); // Optional if already used

      // NEW: Trigger unlocking of dependent points
      unlockPointsFromMap(pointClass);
      stylePointElements();
    }
  });

  console.log("Character state initialized for:", character);
  drawLines(); // Ensure lines are drawn after initial state is loaded
}

document.addEventListener("DOMContentLoaded", function () {
  initializeCharacterState();

  // Optional: manually add points by clicking on the counter
//  document.querySelector('.skillsleft h3').addEventListener('click', function () {
//    skillPoints++;
//    updateSkillPoints();
//  });
});


const supabaseUrl = 'https://jiysxporffwzhmrrpatg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppeXN4cG9yZmZ3emhtcnJwYXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MzY3NjEsImV4cCI6MjA2MjIxMjc2MX0.wetVVcVsxQYC4l1hcASJUOL7pcfarDBo5MuXZTy1EuU';
const client = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
  await client.auth.getSession();
  await loadSkillPoints(); // 👈 Load from DB
  await loadUnlockedFromSupabase();
});

async function testFetchAll() {
  const { data, error } = await client
    .from('points')       // Replace with your table name
    .select('*');         // Select all columns

  if (error) {
    console.error('Fetch error:', error.message);
  } else {
    console.log('Data:', data);
  }
}

testFetchAll();

const characterLineStyles = {
  narkran: {
    fill: 'rgba(253, 88, 88, 0.8)',     // reddish
    border: 'rgba(22, 22, 22, 0.8)',
    clickedBorderWidth: 6,
    clickedFillWidth: 4,
    defaultFill: 'rgba(6, 71, 99, 0.8)',
    defaultWidth: 1,
    defaultOpacity: 0.3
  },
  hesperia: {
    fill: 'rgb(255, 196, 1)',
    border: 'rgba(22, 22, 22, 0.8)',
    clickedBorderWidth: 6,
    clickedFillWidth: 4,
    defaultFill: 'rgba(6, 71, 99, 0.8)',
    defaultWidth: 1,
    defaultOpacity: 0.3
  },
  yvette: {
    fill: 'rgb(212, 62, 62)',
    border: 'rgba(22, 22, 22, 0.8)',
    clickedBorderWidth: 6,
    clickedFillWidth: 4,
    defaultFill: 'rgba(6, 71, 99, 0.8)',
    defaultWidth: 1,
    defaultOpacity: 0.3
  },
  fedra: {
    fill: 'rgb(112, 195, 201)',
    border: 'rgba(22, 22, 22, 0.8)',
    clickedBorderWidth: 6,
    clickedFillWidth: 4,
    defaultFill: 'rgba(6, 71, 99, 0.8)',
    defaultWidth: 1,
    defaultOpacity: 0.3
  },
  erevan: {
    fill: 'rgb(51, 141, 66)',
    border: 'rgba(22, 22, 22, 0.8)',
    clickedBorderWidth: 6,
    clickedFillWidth: 4,
    defaultFill: 'rgba(6, 71, 99, 0.8)',
    defaultWidth: 1,
    defaultOpacity: 0.3
  },
  raziel: {
    fill: 'rgb(228, 228, 228)',
    border: 'rgba(22, 22, 22, 0.8)',
    clickedBorderWidth: 6,
    clickedFillWidth: 4,
    defaultFill: 'rgba(6, 71, 99, 0.8)',
    defaultWidth: 1,
    defaultOpacity: 0.3
  }
}


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
      point.style.backgroundImage = `url('../images/${character}/bg_${pointId}.png')`;
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
            background-image: url("../images/${character}/bg_${pointId}.png");
            background-size: cover;
            background-position: center;
            opacity: 0.5;
            z-index: 0;
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
    const response = await fetch(`../utils/${character}.json`);
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

const ascension = {
  "hesperia": "Astromanzia",
  "fedra": "Primofulmine",
  "erevan": "Circolo della Vanità",
  "narkran": "Sentinella dell'Equilibrio",
  "yvette": "Driade Iridescente",
  "raziel": "Sacerdote Cinereo"
}

document.addEventListener("DOMContentLoaded", function () {
  // Initialize the skill points available
  skillPoints = parseInt(document.querySelector('.skillsleft h3').textContent);

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

// Set the ascension description in the UI
const desc = ascension[character];
document.querySelector('.skillsleft h1').textContent = desc;

// TODO: CHANGE THIS PART TO A FUNCTION THAT ALLOWS TO USE POWER WORDS TO GAIN TALENT POINTS --------------------------------------------------------------------------------------
inputBox.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    const typedValue = event.target.value.trim(); // Trim input
    if (!typedValue) return;

    // Step 1: Fetch the matching word for the current character (character)
    const { data: truthEntry, error: fetchError } = await client
      .from('truth')
      .select('id, used')
      .eq('player', character)
      .eq('word', typedValue)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching word from truth table:', fetchError.message);
      return;
    }

    if (!truthEntry) {
      console.log("Memory not found.");
      return;
    }

    if (truthEntry.used) {
      console.log("Memory already recovered — no points awarded.");
      return;
    }

    // Step 2: Mark the word as used
    const { error: updateError } = await client
      .from('truth')
      .update({ used: true })
      .eq('id', truthEntry.id);

    if (updateError) {
      console.error("Failed to mark memory as used:", updateError.message);
      return;
    }

    // Step 3: Increment skill points in 'points' table
    const { error: incrementError } = await client
      .rpc('increment_available_points', { player_name: character });

    if (incrementError) {
      console.error("Failed to increment available points:", incrementError.message);
      return;
    }

    // Step 4: Update local state/UI
    skillPoints++;
    updateSkillPoints();
    inputBox.value = '';

    console.log(`Recovered memory: ${typedValue}. Skill points now: ${skillPoints}`);
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
a.href = '../../index.html';

const backImg = document.createElement('img');
backImg.src = '../images/ccorb.png';

a.appendChild(backImg);

const forgetDiv = document.createElement('div');
forgetDiv.className = 'forget';

const span = document.createElement('span');
span.textContent = 'Oblio';

const img = document.createElement('img');
img.src = '../images/oblivion.png';

forgetDiv.appendChild(span);
forgetDiv.appendChild(img);

baclinkDiv.appendChild(a);

container.appendChild(forgetDiv);
container.appendChild(baclinkDiv);

document.querySelector('.forget').addEventListener('click', async function () {
  // Clear local/session storage
  localStorage.removeItem('unlockedData');
  sessionStorage.removeItem('memories');
  console.log("Local storage cleared.");

  // Fetch current unlocked state for this character
  const { data, error: fetchError } = await client
    .from('points')
    .select('unlocked')
    .eq('player', character)
    .single();

  if (fetchError) {
    console.error('Error fetching current unlocked state:', fetchError.message);
    return;
  }

  const currentUnlocked = data.unlocked || {};
  const resetUnlocked = Object.fromEntries(
    Object.keys(currentUnlocked).map(key => [key, false])
  );

  // Update the unlocked field with all false
  const { error: updateError } = await client
    .from('points')
    .update({ unlocked: resetUnlocked })
    .eq('player', character);

  if (updateError) {
    console.error('Failed to reset unlocked state:', updateError.message);
  } else {
    console.log('Unlocked state reset in database.');
  }

  location.reload();
});


const audio = new Audio('../audio/unlock-point.mp3');
const points = document.querySelectorAll('.point');

// Load skill points from client ---------------------------------------------------------------------------------------------------------------------------------------

async function loadUnlockedFromSupabase() {
  const { data, error } = await client
    .from('points')
    .select('unlocked')
    .eq('player', character)   // Filter by the current player
    .single();

  if (error) {
    console.error('Error fetching unlocked points:', error.message);
    return;
  }

// Assuming 'data.unlocked' is the JSONB object with point states
  const unlockedData = data.unlocked;

  // Iterate over all points and "click" the ones that are unlocked
  document.querySelectorAll('.point').forEach(point => {
    const pointClass = [...point.classList].find(cls => /^p\d+$/.test(cls)); // Find class matching "pX"
    if (pointClass && unlockedData[pointClass]) {
      if (unlockedData[pointClass] === true) {
        point.classList.remove('locked');
        point.classList.add('clicked'); // Simulate a click for styling
        // Note: We don't call unlockPointsFromMap here because it will be called
        // in initializeCharacterState after the initial load.
      } else {
        point.classList.add('locked');
      }
    }
  });
}


// Instead of requiring a user ID, fetch a default/shared row
async function loadSkillPoints() {
  const { data, error } = await client
    .from('points')
    .select('available')
    .eq('player', character)
    .single();

  if (error) {
    console.error("Error fetching skill points:", error.message);
    return;
  }

  skillPoints = data.available;
  updateSkillPoints();
}

async function decrementSkillPoints() {
  const { data, error } = await client
    .from('points')
    .update({ available: available-1 })
    .eq('player', character);

  if (error) {
    console.error("Error updating skill points:", error.message);
  }
}

points.forEach(point => {
  point.addEventListener('click', async function () {
    if (!this.classList.contains('locked')) {
      // Check if the point has already been clicked BEFORE trying to spend a point
      if (this.classList.contains('clicked')) {
        console.log("This point has already been clicked before.");
        return; // Exit if already clicked
      }

      // Check if skill points are available
      if (skillPoints > 0) {
        if (!audio.paused) {
          audio.pause();
          audio.currentTime = 0.1;
        }
        console.log("master audio played");
        audio.play();

        // Call the RPC function to decrement points in the database
        const { error: rpcError } = await client.rpc('decrement_available_points', {
          player_name: character // Ensure 'character' variable is correctly scoped and has the player's name
        });

        if (rpcError) {
          console.error("Failed to decrement skill points in DB via RPC:", rpcError.message);
          // Optional: alert the user or provide UI feedback about the error
          // Do NOT proceed to decrement local skillPoints or update UI as if spent
        } else {
          // RPC call was successful, now update local state and UI
          skillPoints--; // Decrement local skillPoints variable
          updateSkillPoints(); // Update the UI to reflect the new skillPoints count

          this.classList.add('clicked', 'bordered', 'flash');
          setTimeout(() => {
            this.classList.remove('flash');
          }, 500);

          const clickedPointClass = [...this.classList].find(cls => /^p\d+$/.test(cls));
          if (clickedPointClass) {
            unlockPointsFromMap(clickedPointClass);
          }
          populateUnlockedPoints(); // Consider if this needs to be called or if UI updates cover it
          stylePointElements();   // Consider if this needs to be called

          var pointsClicked = document.querySelectorAll('.point.clicked').length;
          if (pointsClicked >= 8) {
            unlockPoint('p13'); // Ensure unlockPoint logic is sound
          }

          console.log("Points clicked count:", pointsClicked);
          drawLines();

          // Update the unlocked JSONB in the database for this point
          if (clickedPointClass) {
            await updateUnlockedPointInDatabase(clickedPointClass, true);
          }
          console.log(`Skill point spent. ${skillPoints} remaining. Point ${clickedPointClass || ''} unlocked.`);
        }
      } else {
        console.log("No skill points available.");
      }
    } else {
      console.log("This point is locked and cannot be clicked.");
    }
  });
});

// Function to update the unlocked points in the database
async function updateUnlockedPointInDatabase(pointClass, unlockedStatus) {
  // Retrieve the current unlocked JSONB data from the database
  const { data, error } = await client
    .from('points')
    .select('unlocked')
    .eq('player', character)   // Filter by the current player
    .single();

  if (error) {
    console.error('Error fetching unlocked points:', error.message);
    return;
  }

  // Assuming the 'unlocked' field is a JSONB object and we're modifying it
  const unlockedData = data.unlocked || {};

  // Set the point's status to true (unlocked)
  unlockedData[pointClass] = true;

  // Update the JSONB column in the database
  const { updateError } = await client
    .from('points')
    .update({ unlocked: unlockedData })
    .eq('player', character);   // Ensure you're updating the correct player's data

  if (updateError) {
    console.error('Error updating unlocked points:', updateError.message);
  } else {
    console.log(`Point ${pointClass} updated to unlocked.`);
  }
}

let lastParticleTime = 0; // Tracks the last time a particle was created
const particleCooldown = 25; // Time in milliseconds between particles

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
  const style = characterLineStyles[character] || characterLineStyles['hesperia']; // default fallback
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
            lineFill.setAttribute('stroke', style.fill);
            lineFill.setAttribute('stroke-width', style.clickedFillWidth);
            lineBorder.setAttribute('stroke-width', style.clickedBorderWidth);
          } else {
            lineFill.setAttribute('stroke', style.defaultFill);
            lineFill.setAttribute('stroke-width', style.defaultWidth);
            lineFill.setAttribute('opacity', style.defaultOpacity);
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

// 1. Create and style the PDF button
function createPdfButton() {
  const pdfBtn = document.createElement('button');
  pdfBtn.id = 'generatePdfBtn';
  pdfBtn.className = 'pdf-button';
  pdfBtn.textContent = 'Export Abilities to PDF';
  
  // Position at bottom right (adjust as needed)
  pdfBtn.style.position = 'fixed';
  pdfBtn.style.bottom = '20px';
  pdfBtn.style.right = '20px';
  pdfBtn.style.padding = '10px 20px';
  pdfBtn.style.backgroundColor = '#4a4e56';
  pdfBtn.style.color = 'blanchedalmond';
  pdfBtn.style.border = '1px solid #f1eeac';
  pdfBtn.style.borderRadius = '5px';
  pdfBtn.style.fontFamily = '"Jacques Francois", serif';
  pdfBtn.style.cursor = 'pointer';
  pdfBtn.style.zIndex = '100';
  pdfBtn.style.transition = 'all 0.3s ease';
  
  // Hover effect
  pdfBtn.addEventListener('mouseenter', () => {
    pdfBtn.style.backgroundColor = '#5a5e66';
    pdfBtn.style.transform = 'scale(1.05)';
  });
  pdfBtn.addEventListener('mouseleave', () => {
    pdfBtn.style.backgroundColor = '#4a4e56';
    pdfBtn.style.transform = 'scale(1)';
  });
  
  // Add to container (or document.body)
  document.getElementById('container').appendChild(pdfBtn);
  
  // Add click handler
  pdfBtn.addEventListener('click', generateAbilitiesPDF);
}

// 2. PDF Generation Function
function generateAbilitiesPDF() {
  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 30;

    // Function to clean and normalize text
    const cleanText = (html) => {
      const div = document.createElement('div');
      div.innerHTML = html;
      let text = div.textContent || div.innerText || '';
      text = text.replace(/"/g, '');
      return text;
    };

    // Get unlocked abilities
    const unlockedAbilities = [];
    document.querySelectorAll('.point.clicked').forEach(point => {
      const pointClass = [...point.classList].find(cls => /^p\d+$/.test(cls));
      if (pointClass && abilityData[pointClass]) {
        unlockedAbilities.push({
          ...abilityData[pointClass],
          abilita: cleanText(abilityData[pointClass].abilita),
          quote: cleanText(abilityData[pointClass].quote)
        });
      }
    });

    // PDF Styling
    const titleFont = "Jacques Francois";
    const bodyFont = "EB Garamond";
    const titleColor = "#4a4e56";
    const textColor = "#333333";
    const accentColor = "#8b7355";

    // Cover Page
    pdf.setFont(titleFont);
    pdf.setTextColor(titleColor);
    pdf.setFontSize(28);
    pdf.text(character.charAt(0).toUpperCase() + character.slice(1), 105, 50, { align: 'center' });
    pdf.setFontSize(16);
    pdf.text(ascension[character], 105, 60, { align: 'center' });

    let yPosition = 90;

    // Add abilities as a single flow
    unlockedAbilities.forEach((ability, index) => {
      const pageWidth = pdf.internal.pageSize.getWidth() - 2 * margin;

      // Ability Title
      pdf.setFont(titleFont);
      pdf.setTextColor(titleColor);
      pdf.setFontSize(16);
      const titleLines = pdf.splitTextToSize(ability.titolo, pageWidth);
      titleLines.forEach(line => {
        if (yPosition + 7 > pageHeight - 30) { // Check before adding each line
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 7;
      });
      yPosition += 5; // Space after title

      // Ability Description
      pdf.setFont(bodyFont);
      pdf.setTextColor(textColor);
      pdf.setFontSize(11);
      const descLines = ability.abilita.split('\n');
      descLines.forEach(line => {
        if (line.trim() === '') return;
        const splitLines = pdf.splitTextToSize(line, pageWidth);
        splitLines.forEach(splitLine => {
          if (yPosition + 6 > pageHeight - 30) { // Check before adding each line
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(splitLine, margin, yPosition);
          yPosition += 6;
        });
      });
      yPosition += 10; // Space after description

      // Quote
      pdf.setFont(bodyFont, 'italic');
      pdf.setTextColor(accentColor);
      pdf.setFontSize(10);
      const quoteText = `"${ability.quote}"`;
      const quoteLines = pdf.splitTextToSize(quoteText, pageWidth);
      quoteLines.forEach(line => {
        if (yPosition + 6 > pageHeight - 30) { // Check before adding each line
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 6;
      });
      yPosition += 15; // Space after quote

      // Divider
      if (index < unlockedAbilities.length - 1) {
        if (yPosition + 1 > pageHeight - 30) { // Check before adding divider
          pdf.addPage();
          yPosition = margin;
        }
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPosition, pageWidth + margin, yPosition);
        yPosition += 15;
      }
    });

    // Watermark
    pdf.setFontSize(10);
    pdf.setTextColor(200, 200, 200);
    pdf.text("Generato dal tuo DM che ti vuole tanto bene.", 105, pageHeight - 15, { align: 'center' });

    // Save PDF
    pdf.save(`${character}_abilita_sbloccate.pdf`);

  } catch (error) {
    console.error("Errore nella generazione del PDF:", error);
    alert("Si è verificato un errore durante la generazione del PDF. Riprova.");
  }
}

// 3. Initialize the button when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  createPdfButton();
  
  // Load jsPDF in advance (optional)
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  document.head.appendChild(script);
});