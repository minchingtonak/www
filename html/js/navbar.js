function init_navbar() {
  // Configure accessibility tag state based on device type
  is_mobile()
    ? $(".navbar-item").attr("aria-hidden", "true")
    : $(".navbar-item").attr("aria-hidden", "false");

  // Don't keep focus on navbar items after click
  $("a.navbar-item", "#navbar").mouseup(function() {
    $(this).blur();
  });

  var toggle_mobile_navbar = function() {
    if (typeof toggle_mobile_navbar.show == "undefined")
      toggle_mobile_navbar.show = false;
    // Also seems jank -> find a better way later?
    if (toggle_mobile_navbar.show) {
      $("#navbar-container")
        .css("display", "flex")
        .animate(
          {
            height: "toggle"
          },
          "fast"
        );
      $("#navbar-burger")
        .removeClass("is-active bg-color-grey")
        .attr("aria-expanded", "false");
      $(".navbar-item", "#navbar").attr("aria-hidden", "true");
    } else {
      $("#navbar-container")
        .css("display", "flex")
        .hide()
        .animate(
          {
            height: "toggle"
          },
          "fast"
        );
      $("#navbar-burger")
        .addClass("is-active bg-color-grey")
        .attr("aria-expanded", "true");
      $(".navbar-item", "#navbar").attr("aria-hidden", "false");
    }
    toggle_mobile_navbar.show = !toggle_mobile_navbar.show;
  };
  $("#burger").click(toggle_mobile_navbar);

  // subtract navbar hieght from scroll targets before scrolling
  $('a.navbar-item[href^="#"]', "#navbar").click(function(e) {
    // e.preventDefault()
    is_mobile() ? toggle_mobile_navbar() : void 0;
    scrollAfterDelay($(this).attr("href"), 250); // 'fast' animation duration + 50ms
    return false;
  });

  var state = get_device_state();
  var prev_state = state;
  var prev_height = $(window).height();
  $(window).resize(function() {
    prev_state = state;
    state = get_device_state();

    // When switching between mobile and desktop, hide/show navbar buttons accordingly
    if (!is_mobile()) $("#navbar-container").show();
    else if (
      state == "mobile" &&
      prev_state == "desktop" &&
      $("#navbar-container").css("display") != "none"
    )
      $("#navbar-container").css("display", "none");
  });
}
