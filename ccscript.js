// Show loading screen immediately
document.body.insertAdjacentHTML('afterbegin', `
  <div id="loading-screen">
    <div class="loading-content">
      <div class="loading-spinner"></div>
      <p>Caricamento...</p>
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

jQuery(document).ready(function() {
    var ccIcons = jQuery(".ccicon"); // Select all elements with the ccicon class

    // Define page URLs for each ccicon ID
    var ccIconData = {
        "fireseed": { pageURL: "./dist/pcs/yvette.html" },
        "naboar": { pageURL: "./dist/pcs/erevan.html" },
        "storm": { pageURL: "./dist/pcs/fedra.html" },
        "winged": { pageURL: "./dist/pcs/hesperia.html" },
        "balance": { pageURL: "./dist/pcs/narkran.html"},
        "cinder": { pageURL: "./dist/pcs/raziel.html"}
    };

    // Iterate over each ccicon element
    ccIcons.each(function() {
        jQuery(this).click(function() {
            var data = ccIconData[this.id];
            if (data && data.pageURL) {
                window.location.href = data.pageURL;
            }
        });
    });
});

