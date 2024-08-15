/*jQuery.noConflict();
/*
/*var p = 0;
/*
/*function moveit() {
/*  p += 0.05;
/*
/*  var r = 100;
/*  var xcenter = jQuery(window).width() / 2; // Calculate the center of the window horizontally
/*  var ycenter = jQuery(window).height() / 2; // Calculate the center of the window vertically
/*
/*  var newLeft = Math.floor(xcenter + (r * Math.cos(p)));
/*  var newTop = Math.floor(ycenter + (r * Math.sin(p)));
/*  var newLeft1 = Math.floor(xcenter + -(r * Math.cos(p)));
/*  var newTop1 = Math.floor(ycenter + -(r * Math.sin(p)));
/*
/*  jQuery('#fireseed').animate({
/*    top: newTop,
/*    left: newLeft,
/*  }, 100, function() {
/*    moveit()
/*  });
/*  jQuery('#naboar').animate({
/*    top: newTop1,
/*    left: newLeft1,
/*  }, 100, function() {
/*    moveit();
/*  });
/*}
/*jQuery(document).ready(function() {
/*  moveit();
/*});*/

jQuery(document).ready(function() {
    var modal = document.getElementById("myModal");
    var ccIcons = jQuery(".ccicon"); // Select all elements with the ccicon class
    var span = document.getElementsByClassName("close")[0];
    var passwordInput = document.getElementById("passwordInput");

    // Define passwords and page URLs for each ccicon ID
    var ccIconData = {
        "fireseed": { password: "willow", pageURL: "yvette.html", truth: "<i>Surael ambrorian zelorid\nPhaladonos enalar elura\nLuthanor astinian pheliris...</i>" },
        "naboar": { password: "serenya", pageURL: "erevan.html", truth: "<i>Vaer'nazil uthua xairae...</i>" },
        "storm": {password: "zinrea", pageURL: "fedra.html", truth: "<i>Naroth traszaera\nAstrarai drazaroth\nYen'haleth elunan Ilitr...</i>"},
        "winged": {password: "eara", pageURL: "hesperia.html", truth:"<i>Naroth ignerior\nZarhelanar astraiad\nYoh-Phaleth elunan Zorionos...</i>"}
    };

    // Iterate over each ccicon element
    ccIcons.each(function() {
        // When the user clicks on a ccicon element, open the modal
        jQuery(this).click(function() {
            modal.style.display = "block";
            
            // Get the data associated with this ccicon
            var data = ccIconData[this.id];
            var truth = document.getElementById("truth");
            truth.innerHTML = data.truth;
            
            // Set the password and page URL in the modal input field
            jQuery(passwordInput).data('password', data.password);
            jQuery(passwordInput).data('pageURL', data.pageURL);
        });
    });

    // When the user clicks on <span> (x), close the modal
    jQuery(span).click(function() {
        modal.style.display = "none";
    });

    // When the user clicks anywhere outside of the modal, close it
    jQuery(window).click(function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    // When the user presses Enter in the password input field, check password
    jQuery(passwordInput).keypress(function(event) {
        if (event.keyCode === 13) {
            
            var enteredPassword = jQuery(this).val();
            var expectedPassword = jQuery(this).data('password');
            if (enteredPassword.toLowerCase() === expectedPassword) {
                var pageURL = jQuery(this).data('pageURL');
                window.location.href = pageURL;
            } else {
                alert("Incorrect password. Please try again.");
            }
            modal.style.display = "none"; // Close the modal
        }
    });
});


document.getElementById('orb').addEventListener('click', function() {
    console.log("Clicked on orb"); // Check if the event listener is being triggered
    var mirror = document.getElementById('mirror');
    mirror.classList.toggle('slide-in'); // Toggle the slide-out class
    console.log("Slide-out class toggled");
    var isSlideIn = mirror.classList.contains('slide-in');
    
    // If the mirror is currently sliding in, remove the class to reverse the animation
    if (isSlideIn) {
        // Apply the reverse animation directly via JavaScript
        mirror.style.animation = 'slide-in 3s ease forwards'; // Apply the slide-out animation
    } else {
        // If the mirror is not sliding in, apply the slide-in animation directly via JavaScript
        mirror.style.animation = 'slide-out 0.7s ease forwards'; // Apply the slide-in animation
    } // Check if the class is toggled
});



