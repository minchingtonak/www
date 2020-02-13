function resume() {
  function make_title(name) {
    const section = $("<section>", {
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
    const section_frag = $(document.createDocumentFragment());
    section_frag.append(make_title(category_name));
    category.forEach(entry => {
      const entry_section = $("<section>", {
        class: "entry"
      });
      Object.keys(entry).forEach(property => {
        if (property == "desc") {
          const ul = $("<ul>", {
            class: "desc"
          });
          entry[property].forEach(bullet => {
            ul.append(
              $("<li>", {
                html: handle_links(bullet)
              })
            );
          });
          entry_section.append(ul);
        } else {
          const p = $("<p>", {
            class: "e-" + property,
            html: handle_links(entry[property])
          });
          entry_section.append(p);
        }
      });
      section_frag[0].firstChild.append(entry_section[0]);
    });
    return section_frag;
  }

  function make_skills(skills, skills_name) {
    const section_frag = $(document.createDocumentFragment());
    section_frag.append(make_title(skills_name));
    const ul = $("<ul>", {
      class: "desc"
    });
    const entry_section = $("<section>", {
      class: "entry"
    });
    Object.keys(skills).forEach(type => {
      ul.append(
        $("<li>", {
          html:
            $("<h2>", {
              text: type + ":"
            })[0].outerHTML + skills[type]
        })
      );
    });
    entry_section.append(ul);
    section_frag[0].firstChild.append(entry_section[0]);
    return section_frag;
  }

  function make_navbar_item(name, icon) {
    const p_name = name.toLowerCase();
    const a = $("<a>", {
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

  function make_all_navbar_items(resume_data) {
    const frag = $(document.createDocumentFragment());
    Object.keys(resume_data).forEach(key => {
      frag.append(make_navbar_item(key, resume_data[key]["icon"]));
    });

    $("#navbar-container").append(frag);
    return resume_data;
  }

  function make_all_sections(resume_data) {
    const keys = Object.keys(resume_data),
      frag = $(document.createDocumentFragment());
    const skills = keys.pop();
    keys.forEach(section => {
      frag.append(make_section(resume_data[section]["entries"], section));
    });
    frag.append(make_skills(resume_data[skills]["entries"], skills));
    $("#main-content").append(frag);
    return resume_data;
  }

  function build_resume() {
    fetch(
      "https://gist.githubusercontent.com/minchingtonak/c83ff547dfa762624edf900691ad3bc5/raw"
    )
      .then(response => {
        return response.json();
      })
      .then(make_all_navbar_items)
      .then(make_all_sections)
      .then(after_build)
      .catch(error => {
        console.error(error);
      });
  }

  build_resume();
}

window.onload = resume();
