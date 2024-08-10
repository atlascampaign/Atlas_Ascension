
/*
 * center it
 */
// Function to draw lines between specified points
// Function to draw lines between specified points
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
          lineBorder.setAttribute('stroke-width', '6'); // Set the border width
          svg.appendChild(lineBorder);

          // Create a line element for the fill
          const lineFill = document.createElementNS("http://www.w3.org/2000/svg", "line");
          lineFill.setAttribute('x1', x1);
          lineFill.setAttribute('y1', y1);
          lineFill.setAttribute('x2', x2);
          lineFill.setAttribute('y2', y2);

          if (connectedPoint.classList.contains('clicked') && point.classList.contains('clicked')) {
            lineFill.setAttribute('stroke', 'rgb(253, 88, 88)');
            lineFill.setAttribute('stroke-width', '4');
          }
          else {
            lineFill.setAttribute('stroke', 'rgba(6, 71, 99, 0.8)');
            lineFill.setAttribute('stroke-width', '3');
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
// Select all card elements
var cards = document.querySelectorAll('.card');

// Load the SVG file
/*fetch('plainborder.svg')
  .then(response => response.text())
  .then(svgData => {
    // For each card element
    cards.forEach(card => {
      // Create a new SVG element
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      // Set the inner HTML of the SVG element to the loaded SVG data
      svg.innerHTML = svgData;
      // Set SVG attributes
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      // Append the SVG element to the card
      card.insertBefore(svg, card.firstChild);
    });
  });*/

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

document.addEventListener("DOMContentLoaded", function() {
  // Initialize the skill points available
  let skillPoints = document.querySelector('.skillsleft span').textContent;

  // Function to update the display of skill points
  function updateSkillPoints() {
      document.querySelector('.skillsleft span').textContent = skillPoints;
  }

  // Function to unlock a specific point
// Function to unlock a specific point
function unlockPoint(pointClass) {
  const point = document.querySelector(`.${pointClass}`);
  if (point) {
      point.classList.remove('locked');

      // Redraw lines after unlocking the point
      drawLines();
  }
}

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

                // Unlock specific point if another point is clicked
                if (this.classList.contains('p1')) {
                  unlockPoint('p2');
                }

                if (this.classList.contains('p6')) {
                  unlockPoint('p4');
                  unlockPoint('p7');
                }

                if (this.classList.contains('p4')) {
                  unlockPoint('p8');
                  unlockPoint('p10');
                }

                if (this.classList.contains('p8')) {
                  unlockPoint('p19');
                  unlockPoint('p20');
                }

                if ((this.classList.contains('p5')) || (this.classList.contains('p3'))) {
                  unlockPoint('p6');
                }

                if (this.classList.contains('p10')) {
                  unlockPoint('p16');
                  unlockPoint('p12');
                }

                if (this.classList.contains('p7')) {
                unlockPoint('p9')
                unlockPoint('p11');
                }

                if (this.classList.contains('p11')) {
                  unlockPoint('p14');
                  unlockPoint('p15');
                } 

                if (this.classList.contains('p2')) {
                    unlockPoint('p3');
                    unlockPoint('p5');
                }

                if (this.classList.contains('p9')) {
                  unlockPoint('p18');
                  unlockPoint('p17');
                } 

                if (this.classList.contains('p14')) {
                  unlockPoint('p15');
                }

                if (this.classList.contains('p15')) {
                  unlockPoint('p13');
                }
                
                var pointsClicked = document.querySelectorAll('.point.clicked').length;
                
                if (pointsClicked >= 8) {
                    unlockPoint('p13')
                }
                                
                console.log(pointsClicked)

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
})})