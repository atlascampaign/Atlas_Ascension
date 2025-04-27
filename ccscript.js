jQuery(document).ready(function() {
    var ccIcons = jQuery(".ccicon"); // Select all elements with the ccicon class

    // Define page URLs for each ccicon ID
    var ccIconData = {
        "fireseed": { pageURL: "./dist/yvette.html" },
        "naboar": { pageURL: "./dist/erevan.html" },
        "storm": { pageURL: "./dist/fedra.html" },
        "winged": { pageURL: "./dist/hesperia.html" },
        "balance": { pageURL: "./dist/narkran.html"}
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
