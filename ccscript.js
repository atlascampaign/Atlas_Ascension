jQuery(document).ready(function() {
    var ccIcons = jQuery(".ccicon"); // Select all elements with the ccicon class

    // Define page URLs for each ccicon ID
    var ccIconData = {
        "fireseed": { pageURL: "./dist/pcs/yvette.html" },
        "naboar": { pageURL: "./dist/pcs/erevan.html" },
        "storm": { pageURL: "./dist/pcs/fedra.html" },
        "winged": { pageURL: "./dist/pcs/hesperia.html" },
        "balance": { pageURL: "./dist/pcs/narkran.html"}
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
