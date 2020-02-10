const DARK_MODE_COLOR = "#2d2d2d";
const LIGHT_MODE_COLOR = "#ffffff";

const MOBILE_WIDTH = 1006; // experimental threshold based on testing

function get_device_state() {
  return $(window).width() <= MOBILE_WIDTH ? "mobile" : "desktop";
}

function is_mobile() {
  return $(window).width() <= MOBILE_WIDTH;
}

function toggle_dark_mode() {
  var theme = $(
    "meta[name=theme-color],meta[name=apple-mobile-web-app-status-bar-style]"
  );
  $("meta[name=theme-color]").attr("content") != LIGHT_MODE_COLOR
    ? theme.attr("content", LIGHT_MODE_COLOR)
    : theme.attr("content", DARK_MODE_COLOR);
  $("#navbar,#burger,#main-content")
    .children()
    .toggleClass("dark-theme");
  $("#main-content,#navbar").toggleClass("dark-theme");
  $(".e-date", ".entry").toggleClass("dark-theme");
  $("html,body").toggleClass("dark-html");
}

function after_build() {
  var html_body = $(".html-body");

  // Dark mode transitions on all relevant elements
  $("html,body,#navbar,#navbar-container,#burger,#main-content").addClass(
    "transition"
  );
  $("#navbar, #main-content")
    .children()
    .addClass("transition");

  // Toggle dark mode
  $("#dark-toggle").click(toggle_dark_mode);

  var hour = new Date().getHours();
  if (hour <= 9 || hour >= 18) toggle_dark_mode();

  // position: sticky doesn't work after 1 screen's worth of height if html,body height is 100%
  // to fix, start at 100% then immediately freeze the title page height and unset the height of html,body
  $("#title-container").css("height", $("#navbar").offset().top);
  html_body.css("height", "unset");

  // Resize the title page if the window size changes
  let state = get_device_state();
  let prev_height = $(window).height();
  $(window).resize(_ => {
    prev_state = state;
    state = get_device_state();

    // Fix height of title page on window vertical resize
    if ($(window).height() != prev_height) {
      html_body.css("height", "100%");
      $("#title-container")
        .css("height", "100%")
        .css("height", $("#navbar").offset().top);
      html_body.css("height", "unset");
      prev_height = $(window).height();
    }
  });

  init_navbar();
}
