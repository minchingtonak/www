function init_navbar() {
  // Configure accessibility tag state based on device type
  is_mobile()
    ? $(".navbar-item").attr("aria-hidden", "true")
    : $(".navbar-item").attr("aria-hidden", "false");

  // Don't keep focus on navbar items after click
  $("a.navbar-item", "#navbar").mouseup(function() {
    $(this).blur();
  });

  function toggle_mobile_navbar() {
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
  }
  $("#burger").click(toggle_mobile_navbar);

  // subtract navbar hieght from scroll targets before scrolling
  $('a.navbar-item[href^="#"]', "#navbar").click(function() {
    // Not an arrow function because need access to a's this, not init_navbar's
    // e.preventDefault()
    is_mobile() ? toggle_mobile_navbar() : void 0;
    scroll_after_delay($(this).attr("href"), (is_mobile() ? 250 : 50)); // 'fast' animation duration + 50 on mobile
    return false;
  });

  let state = get_device_state();
  let prev_state = state;
  $(window).resize(_ => {
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

function scroll_after_delay(dest, delay) {
  wait(delay).then(_ => {
    const d = $(dest).parent();
    // center section if it fits within the screen, else scroll to the top of it
    // +50 px of leeway to prevent ugly scroll position when heights are very close
    const t =
      $(window).height() - $("#navbar").height() <= d.outerHeight(true) + 50
        ? d.offset().top - $("#navbar").height()
        : d.offset().top + d.outerHeight(true) * 0.5 - $(window).height() * 0.5;
    $("html,body").scrollTop(t);
  });
}

function wait(msec) {
  return new Promise(resolve => {
    setTimeout(_ => {
      resolve();
    }, msec);
  });
}
