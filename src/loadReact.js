import ProjectCard from "./ProjectCard";
const ReactDOM = require("react-dom");
const React = require("react");

export default function loadReact() {
  let cards = [];

  fetch("https://personal-web-a99ce.firebaseio.com/projects.json")
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++)
        cards.push(
          <ProjectCard
            key={i}
            title={data[i].title}
            description={data[i].description}
            projectURL={data[i].projectURL}
            githubURL={data[i].githubURL}
            image={data[i].imageURL}
            projectDate={data[i].projectDate}
          />
        );

      ReactDOM.render(
        <div id="CardsContainer">{cards}</div>,
        document.querySelector("#Cards")
      );

      let togglers = document.querySelectorAll(".description-toggler");
      let descriptions = document.querySelectorAll(".description");

      for (let i = 0; i < togglers.length; i++) {
        descriptions[i].style.height = descriptions[i].offsetHeight + "px";
        descriptions[i].classList.add("collapsed");

        togglers[i].addEventListener("click", () => {
          var desc = descriptions[i];

          if (desc.classList.contains("collapsed")) {
            desc.classList.remove("collapsed");
          } else {
            desc.classList.add("collapsed");
          }
        });
      }
    });
}
