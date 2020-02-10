function make_blurb(blurb_data) {
  const to_fill = $("#blurb-container");
  blurb_data["content"].forEach(paragraph => {
    to_fill.append(
      $("<p>", {
        class: "intro-blurb",
        html: paragraph
      })
    );
  });
}

function build_blurb() {
  fetch(
    "https://gist.githubusercontent.com/minchingtonak/736ab803ba2681637abe34f3f8e14e94/raw"
  )
    .then(response => {
      return response.json();
    })
    .then(make_blurb)
    .then(after_build)
    .catch(error => {
      console.error(error);
    });
}

window.onload = build_blurb();
