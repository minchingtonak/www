const DARK_MODE_COLOR = '#2d2d2d';
const LIGHT_MODE_COLOR = '#ffffff';

const MOBILE_WIDTH = 1006; // experimental threshold based on testing

function get_device_state() {
  return $(window).width() <= MOBILE_WIDTH ? 'mobile' : 'desktop';
}

function is_mobile() {
  return $(window).width() <= MOBILE_WIDTH;
}

function handle_links(text) {
  const link_pattern = /\[[^\]]+?\][\s]*\([^\s\)]+?[\s]+?'[\s\S]+?'\)/g;
  const matches = [];
  while ((match = link_pattern.exec(text))) matches.push(match);

  if (matches.length) {
    matches.forEach((match) => {
      const mid = /\]\s*\(/g.exec(match[0]);
      const end = /\s*['"]/g.exec(match[0].substr(mid.index + mid.length));

      text = text.replace(
        match[0],
        $('<a>', {
          text: match[0].substring(1, mid.index),
          href: match[0].substring(
            mid.index + mid[0].length,
            end.index + mid.index + 1,
          ),
          title: match[0].substring(
            end.index + mid.index + end[0].length + 1,
            match[0].length - 2,
          ),
          target: '_blank',
        })[0].outerHTML,
      );
    });
  }
  return text;
}

function toggle_dark_mode() {
  var theme = $(
    'meta[name=theme-color],meta[name=apple-mobile-web-app-status-bar-style]',
  );
  $('meta[name=theme-color]').attr('content') != LIGHT_MODE_COLOR
    ? theme.attr('content', LIGHT_MODE_COLOR)
    : theme.attr('content', DARK_MODE_COLOR);
  $('#navbar,#burger,#main-content').children().toggleClass('dark-theme');
  $('#main-content,#navbar').toggleClass('dark-theme');
  $('.e-date', '.entry').toggleClass('dark-theme');
  $('html,body').toggleClass('dark-html');
}

function after_build() {
  var html_body = $('.html-body');

  // Dark mode transitions on all relevant elements
  $('html,body,#navbar,#navbar-container,#burger,#main-content').addClass(
    'transition',
  );
  $('#navbar, #main-content').children().addClass('transition');

  // Toggle dark mode
  $('#dark-toggle').click(() => {
    toggle_dark_mode();
    localStorage.setItem(
      'theme',
      localStorage.getItem('theme') === 'dark' ? 'light' : 'dark',
    );
    console.log(localStorage.getItem('theme'));
  });

  console.log(localStorage.getItem('theme'));
  if (localStorage.getItem('theme') === 'dark') toggle_dark_mode();

  // position: sticky doesn't work after 1 screen's worth of height if html,body height is 100%
  // to fix, start at 100% then immediately freeze the title page height and unset the height of html,body
  $('#title-container').css('height', $('#navbar').offset().top);
  html_body.css('height', 'unset');

  // Resize the title page if the window size changes
  let state = get_device_state();
  let prev_height = $(window).height();
  $(window).resize((_) => {
    prev_state = state;
    state = get_device_state();

    // Fix height of title page on window vertical resize
    if ($(window).height() != prev_height) {
      html_body.css('height', '100%');
      $('#title-container')
        .css('height', '100%')
        .css('height', $('#navbar').offset().top);
      html_body.css('height', 'unset');
      prev_height = $(window).height();
    }
  });

  init_navbar();
}
