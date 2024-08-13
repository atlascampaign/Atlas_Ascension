const ascension = {"hesperia" : "Astromanzia",
    "fedra" : "Primofulmine",
    "erevan" : "Campione del Fato",
    "narkran" : "Sentinella dell'Equilibrio",
    "yvette" : "Driade Iridescente"}

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