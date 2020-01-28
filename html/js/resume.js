const MOBILE_WIDTH = 1006; // experimental threshold based on testing
const DARK_MODE_COLOR = "#2d2d2d";
const LIGHT_MODE_COLOR = "#ffffff";

function get_device_state() {
  return $(window).width() <= MOBILE_WIDTH ? "mobile" : "desktop";
}

function is_mobile() {
  return $(window).width() <= MOBILE_WIDTH;
}

function handle_link(text) {
  var regex = /\[[^\]]+?\][\s]*\([^\s\)]+?[\s]+?'[\s\S]+?'\)/g;
  var matches = [];
  while ((match = regex.exec(text))) matches.push(match);

  if (matches.length) {
    for (i = 0; i < matches.length; i++) {
      var mid = /\]\s*\(/g.exec(matches[i][0]);
      var end = /\s*['"]/g.exec(matches[i][0].substr(mid.index + mid.length));

      text = text.replace(
        matches[i][0],
        $("<a>", {
          text: matches[i][0].substring(1, mid.index),
          href: matches[i][0].substring(
            mid.index + mid[0].length,
            end.index + mid.index + 1
          ),
          title: matches[i][0].substring(
            end.index + mid.index + end[0].length + 1,
            matches[i][0].length - 2
          ),
          target: "_blank"
        })[0].outerHTML
      );
    }
  }
  return text;
}

function make_title(name) {
  var section = $("<section>", {
    class: "container"
  });
  section.append(
    $("<h1>", {
      id: name.toLowerCase().replace(/[^0-9a-z]/gi, ""),
      class: "category",
      text: name.toUpperCase()
    })
  );
  section.append(
    $("<hr>", {
      class: "dim"
    })
  );
  return section;
}

function make_section(category, category_name) {
  var section_frag = $(document.createDocumentFragment());
  section_frag.append(make_title(category_name));
  for (entry in category) {
    var entry_section = $("<section>", {
      class: "entry"
    });
    for (property in category[entry]) {
      if (property == "desc") {
        var ul = $("<ul>", {
          class: "desc"
        });
        for (bullet in category[entry][property]) {
          ul.append(
            $("<li>", {
              html: handle_link(category[entry][property][bullet])
            })
          );
        }
        entry_section.append(ul);
      } else {
        var p = $("<p>", {
          class: "e-" + property,
          html: handle_link(category[entry][property])
        });
        entry_section.append(p);
      }
    }
    section_frag[0].firstChild.append(entry_section[0]);
  }
  return section_frag;
}

function make_skills(skills, skills_name) {
  var section_frag = $(document.createDocumentFragment());
  section_frag.append(make_title(skills_name));
  var ul = $("<ul>", {
    class: "desc"
  });
  var entry_section = $("<section>", {
    class: "entry"
  });
  for (type in skills) {
    ul.append(
      $("<li>", {
        html:
          $("<h2>", {
            text: type + ":"
          })[0].outerHTML + skills[type]
      })
    );
  }
  entry_section.append(ul);
  section_frag[0].firstChild.append(entry_section[0]);
  return section_frag;
}

function make_navbar_item(name, icon) {
  var p_name = name.toLowerCase();
  var a = $("<a>", {
    class: "navbar-item",
    href: "#" + p_name.replace(/[^0-9a-z]/gi, ""),
    role: "button",
    title: "Go to the " + p_name + " section."
  });
  a.append(
    $("<p>", {
      html: name
    })
  );
  a.append(
    $("<i>", {
      class: icon + " nav-icon"
    })
  );
  return a;
}

function make_all_navbar_items(resume) {
  var keys = Object.keys(resume),
    frag = $(document.createDocumentFragment());
  for (var i = 0; i < keys.length; i++)
    frag.append(make_navbar_item(keys[i], resume[keys[i]]["icon"]));
  $("#navbar-container").append(frag);
}

function make_all_sections(resume) {
  var keys = Object.keys(resume),
    frag = $(document.createDocumentFragment());
  for (var i = 0; i < keys.length - 1; i++)
    frag.append(make_section(resume[keys[i]]["entries"], keys[i]));
  frag.append(
    make_skills(resume[keys[keys.length - 1]]["entries"], keys[keys.length - 1])
  );
  $("#main-content").append(frag);
}

function generate() {
  $.getJSON(
    "https://gist.githubusercontent.com/minchingtonak/c83ff547dfa762624edf900691ad3bc5/raw",
    function(resume) {
      make_all_navbar_items(resume);
      make_all_sections(resume);
      after_generate();
    }
  );
}

// Seems jank -> find a better way later?
async function scrollAfterDelay(dest, delay) {
  var x = await (function(dest, N) {
    return new Promise(resolve => {
      setTimeout(() => {
        var d = $(dest).parent();
        // center section if it fits within the screen, else scroll to the top of it
        // +50 px of leeway to prevent ugly scroll position when heights are very close
        var t =
          $(window).height() - $("#navbar").height() <= d.outerHeight(true) + 50
            ? d.offset().top - $("#navbar").height()
            : d.offset().top +
              d.outerHeight(true) * 0.5 -
              $(window).height() * 0.5;
        $("html,body").scrollTop(t);
        resolve(dest);
      }, N);
    });
  })(dest, delay);
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

function after_generate() {
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
  var state = get_device_state();
  var prev_state = state;
  var prev_height = $(window).height();
  $(window).resize(function() {
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

$(generate);
