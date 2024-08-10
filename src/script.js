const config = {
  target: $(".point"),
  line: $(".line"),
  delay: 40 // enter zero for live resizing
};

const drawBetweenObjects = {
  makeLine: function (line, div1, div2) {
    var className = div1.attr("id") + div2.attr("id");
    if (className.includes("undefined") !== true) {
      var x1 = div1.offset().left + div1.width() / 2;
      var y1 = div1.offset().top + div1.height() / 2;
      var x2 = div2.offset().left + div2.width() / 2;
      var y2 = div2.offset().top + div2.height() / 2;
      $(line)
        .clone()
        .addClass("firedUp")
        .addClass(className)
        .removeClass("original")
        .insertAfter(line);
      $("." + className)
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2);
    } else {
      console.error("undefined object");
    }
  },
  findLines: function (search) {
    $(".firedUp").remove();
    $(search).each(function (index, el) {
      if (search.eq(index + 1).length) {
        drawBetweenObjects.makeLine(config.line, $(this), search.eq(index + 1));
      }
    });
  },
  init: function () {
    drawBetweenObjects.findLines(config.target);
    var resizeId;
    $(window).resize(function () {
      clearTimeout(resizeId);
      if (config.delay !== 0) {
        resizeId = setTimeout(doneResizing, config.delay);
      } else {
        drawBetweenObjects.findLines(config.target);
      }
    });
    function doneResizing() {
      drawBetweenObjects.findLines(config.target);
    }
  }
};

drawBetweenObjects.init();
