const ascension = {"hesperia" : "Astromanzia",
    "fedra" : "Primofulmine",
    "erevan" : "Campione del Fato",
    "narkran" : "Sentinella dell'Equilibrio",
    "yvette" : "Driade Iridescente"}

const memories = {"hesperia" : ["Azor'halun","Teulos Avair","Kalvas Astraiel"]}

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

const pc = document.querySelector('body').id;
const desc = ascension[pc];

document.querySelector('.skillsleft h1').textContent = desc

const container = document.getElementById('container');

const forgetDiv = document.createElement('div');
forgetDiv.className = 'forget';

const span = document.createElement('span');
span.textContent = 'Oblio';

const img = document.createElement('img');
img.src = 'images/oblivion.png';

forgetDiv.appendChild(span);
forgetDiv.appendChild(img);

container.appendChild(forgetDiv);

document.querySelector('.forget').addEventListener('click', function() {
    localStorage.removeItem('unlockedData');
    console.log("Local storage cleared.");
    location.reload();
  });



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