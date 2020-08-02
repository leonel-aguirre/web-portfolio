import "./style.scss";
import ProjectCard from "./ProjectCard";
const ReactDOM = require("react-dom");
const React = require("react");
const d3 = require("d3");
const THREE = require("three");

let scene, camera, renderer, starGeo, stars;
let navBarContainer,
  navBar,
  navBarTab,
  navBarLIs,
  actualSection,
  navBarOffset,
  chartContainer;
let initialNavBarHeight;
let homeSection,
  aboutSection,
  technologiesSection,
  portfolioSection,
  contactSection;
let nameInput, emailInput, messageInput, mailFormButton;

let modal, modalDisposeButton;

let mobileNavBarShown = false;

let mobileWidth = window.innerWidth < 768;

window.onload = () => {
  navBarContainer = document.querySelector("#NavBarContainer");
  navBar = document.querySelector("#NavBar");
  navBarTab = document.querySelector("#NavBarTab");
  navBarLIs = Array.from(navBar.querySelector("ul").getElementsByTagName("li"));
  actualSection = -1;
  navBarOffset = document.querySelector("#NavBarOffset");
  initialNavBarHeight = navBarContainer.clientHeight;

  homeSection = document.querySelector("#Home");
  aboutSection = document.querySelector("#About");
  technologiesSection = document.querySelector("#Technologies");
  portfolioSection = document.querySelector("#Portfolio");
  contactSection = document.querySelector("#Contact");

  nameInput = document.querySelector("#NameInput");
  emailInput = document.querySelector("#EmailInput");
  messageInput = document.querySelector("#MessageInput");
  mailFormButton = document.querySelector("#MailFormButton");

  chartContainer = document.querySelector("#ChartContainer");

  modal = document.querySelector("#Modal");
  modalDisposeButton = document.querySelector("#ModalDisposeButton");

  init();
  addListeners();
  loadSVG();
  loadReactComponents();

  let initialNavBarOffset = navBarContainer.offsetTop;

  if (mobileWidth) {
    navBarContainer.classList.add("sticky");

    window.onscroll = fixY;
  } else {
    window.onscroll = () => {
      checkNavBar();
      fixY();

      if (window.pageYOffset >= initialNavBarOffset) {
        navBar.classList.add("sticky");
        navBarOffset.style.height = `${initialNavBarHeight}px`;
      } else {
        navBar.classList.remove("sticky");
        navBarOffset.style.height = "0px";
      }
    };
  }
};

function fixY() {
  for (let i = 0; i < document.getElementsByTagName("image").length; i++) {
    let halfHeight = document.querySelectorAll("image")[i].getBBox().height / 2;

    document.querySelectorAll("image")[i].setAttribute("y", -halfHeight);
  }
}

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.z = 1;
  camera.rotation.x = Math.PI / 2;

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(
    mobileWidth ? window.innerWidth : window.innerWidth - 17,
    window.innerHeight
  );
  homeSection.appendChild(renderer.domElement);

  starGeo = new THREE.Geometry();

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );

    star.velocity = 0;
    star.acceleration = 0.0002;

    starGeo.vertices.push(star);
  }

  let sprite = new THREE.TextureLoader().load(
    "https://firebasestorage.googleapis.com/v0/b/personal-web-a99ce.appspot.com/o/star.png?alt=media&token=3e3ef3c1-6cdb-42ff-82f7-5c518c913367"
  );
  let starMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 1,
    map: sprite,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
  animate();
}

function animate() {
  starGeo.vertices.forEach((p) => {
    p.velocity += p.acceleration;
    p.y -= p.velocity;

    if (p.y < -200) {
      p.y = 200;
      p.velocity = 0;
    }
  });

  starGeo.verticesNeedUpdate = true;
  stars.rotation.y += 0.002;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function loadSVG() {
  let height = mobileWidth ? 300 : 500;

  let bubbleWidth = mobileWidth
    ? chartContainer.offsetWidth
    : chartContainer.offsetWidth * 0.4;
  let barWidth = mobileWidth
    ? chartContainer.offsetWidth
    : chartContainer.offsetWidth * 0.6;

  fetch("https://personal-web-a99ce.firebaseio.com/technologies.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      /////////////////

      const originalOpacity = 0.4;
      const hoverOpacity = 0.8;

      const pack = (data) =>
        d3.pack().size([bubbleWidth, height]).padding(5)(
          d3.hierarchy({ children: data }).sum((d) => d.value)
        );

      const root = pack(data);

      const bubbleChart = d3
        .select("#BubbleChart")
        .append("svg")
        .attr("viewBox", [0, 0, bubbleWidth, height])
        .attr("width", bubbleWidth)
        .attr("height", height);

      const leaf = bubbleChart
        .selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`);

      leaf
        .append("circle")
        .attr("r", (d) => d.r)
        .attr("originalR", (d) => d.r)
        .attr("fill-opacity", originalOpacity)
        .attr("fill", (d) => d.data.color)
        .attr("id", (d, i) => `circle${i}`)
        .on("mouseover", function (d, i) {
          mouseOverSVG(d, i);
        })
        .on("mouseout", function (d, i) {
          mouseOutSVG(d, i);
        });

      leaf
        .append("image")
        .attr("href", (d) => d.data.img)
        .attr("x", (d) => -(d.r / 2))
        .attr("width", (d) => d.r)
        .on("mouseover", function (d, i) {
          mouseOverSVG(d, i);
        })
        .on("mouseout", function (d, i) {
          mouseOutSVG(d, i);
        });

      /////////////////

      const barChart = d3
        .select("#BarChart")
        .append("svg")
        .attr("viewBox", [0, 0, barWidth, height])
        .attr("width", barWidth)
        .attr("height", height);

      let margin;
      let xScale, yScale;
      let xAxis, yAxis;

      if (mobileWidth) {
        margin = { top: 20, right: 20, bottom: 75, left: 65 };
      } else {
        margin = { top: 50, right: 50, bottom: 25, left: 75 };
      }

      let innerWidth = barWidth - margin.left - margin.right;
      let innerHeight = height - margin.top - margin.bottom;

      if (mobileWidth) {
        yScale = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.value)])
          .range([innerHeight, 0]);

        xScale = d3
          .scaleBand()
          .domain(data.map((d) => d.name))
          .range([0, innerWidth])
          .padding(0.2);
      } else {
        xScale = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.value)])
          .range([0, innerWidth]);

        yScale = d3
          .scaleBand()
          .domain(data.map((d) => d.name))
          .range([0, innerHeight])
          .padding(0.2);
      }

      const mouseOverSVG = (d, i) => {
        let circle = d3.select(`#circle${i}`);
        let rect = d3.select(`#rect${i}`);

        circle
          .transition()
          .attr("r", circle.attr("originalR") + 3)
          .attr("fill-opacity", hoverOpacity);

        if (mobileWidth) {
          rect
            .transition()
            .attr("x", (d) => xScale(d.name) - 3)
            .attr("width", xScale.bandwidth() + 6)
            .attr("fill-opacity", hoverOpacity);
        } else {
          rect
            .transition()
            .attr("y", (d) => yScale(d.name) - 3)
            .attr("height", yScale.bandwidth() + 6)
            .attr("fill-opacity", hoverOpacity);
        }
      };

      const mouseOutSVG = (d, i) => {
        let circle = d3.select(`#circle${i}`);
        let rect = d3.select(`#rect${i}`);

        circle
          .transition()
          .attr("r", circle.attr("originalR"))
          .attr("fill-opacity", originalOpacity);

        if (mobileWidth) {
          rect
            .transition()
            .attr("x", (d) => xScale(d.name))
            .attr("width", xScale.bandwidth())
            .attr("fill-opacity", originalOpacity);
        } else {
          rect
            .transition()
            .attr("y", (d) => yScale(d.name))
            .attr("height", yScale.bandwidth())
            .attr("fill-opacity", originalOpacity);
        }
      };

      yAxis = d3.axisLeft(yScale);
      xAxis = d3.axisBottom(xScale);

      if (mobileWidth) {
        yAxis.tickFormat((d) => d + "%");
      } else {
        xAxis.tickFormat((d) => d + "%");
      }

      let g = barChart
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .attr("color", "#fff");

      let yGroup = g
        .append("g")
        .call(yAxis)
        .style("font-size", 15)
        .attr("font-family", "Oxygen");

      let xGroup = g
        .append("g")
        .call(xAxis)
        .attr("transform", `translate(0, ${innerHeight})`)
        .style("font-size", 15)
        .attr("font-family", "Oxygen");

      if (mobileWidth) {
        xGroup
          .selectAll("text")
          .attr("transform", "rotate(90), translate(10, -15)")
          .style("text-anchor", "start");
      }

      if (mobileWidth) {
        g.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", (d) => xScale(d.name))
          .attr("y", (d) => yScale(d.value))
          .attr("width", xScale.bandwidth())
          .attr("height", (d) => innerHeight - yScale(d.value))
          .attr("fill", (d) => d.color)
          .attr("fill-opacity", originalOpacity)
          .attr("id", (d, i) => `rect${i}`)
          .on("mouseover", function (d, i) {
            mouseOverSVG(d, i);
          })
          .on("mouseout", function (d, i) {
            mouseOutSVG(d, i);
          });
      } else {
        g.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("y", (d) => yScale(d.name))
          .attr("height", yScale.bandwidth())
          .attr("width", (d) => xScale(d.value))
          .attr("fill", (d) => d.color)
          .attr("fill-opacity", originalOpacity)
          .attr("id", (d, i) => `rect${i}`)
          .on("mouseover", function (d, i) {
            mouseOverSVG(d, i);
          })
          .on("mouseout", function (d, i) {
            mouseOutSVG(d, i);
          });
      }
    });
}

function loadReactComponents() {
  let cards = [];

  fetch("https://personal-web-a99ce.firebaseio.com/projects.json")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      for (let i = 0; i < data.length; i++)
        cards.push(
          <ProjectCard
            key={i}
            title={data[i].title}
            description={data[i].description}
            projectURL={data[i].projectURL}
            image={data[i].imageURL}
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

const checkNavBar = () => {
  let actualY = window.pageYOffset;
  let selectedIndex;

  if (actualY >= homeSection.offsetTop && actualY < aboutSection.offsetTop) {
    selectedIndex = 0;
  } else if (
    actualY >= aboutSection.offsetTop - initialNavBarHeight &&
    actualY < technologiesSection.offsetTop - initialNavBarHeight
  ) {
    selectedIndex = 1;
  } else if (
    actualY >= technologiesSection.offsetTop - initialNavBarHeight &&
    actualY < portfolioSection.offsetTop - initialNavBarHeight
  ) {
    selectedIndex = 2;
  } else if (
    actualY >= portfolioSection.offsetTop - initialNavBarHeight &&
    actualY < contactSection.offsetTop - initialNavBarHeight
  ) {
    selectedIndex = 3;
  } else if (actualY >= contactSection.offsetTop - initialNavBarHeight) {
    selectedIndex = 4;
  }

  if (selectedIndex != actualSection) updateNavBar(selectedIndex);

  function updateNavBar(indexToHighlight) {
    navBarLIs.forEach((e, i) => {
      if (i == indexToHighlight) {
        e.querySelector("a").classList.add("nav-selected");
      } else {
        e.querySelector("a").classList.remove("nav-selected");
      }
    });
  }
};

const addListeners = () => {
  navBarTab.addEventListener("click", toggleMobileNavBar);
  mailFormButton.addEventListener("click", sendMail);
  modalDisposeButton.addEventListener("click", hideModal);
};

function hideModal() {
  modal.classList.add("modal-hidden");
}

function showModal() {
  modal.classList.remove("modal-hidden");
}

function sendMail() {
  if (
    nameInput.value.length > 0 &&
    emailInput.value.length > 0 &&
    messageInput.value.length > 0
  ) {
    let body = {
      from: "Web Portfolio Mailer <noisyapple41@gmail.com>",
      dest: "leonel.aguirre77@gmail.com",
      subject: "Message from Web Portfolio",
      html: `
      <h2>Hey! <span style="color: #ea486e">${nameInput.value}</span> &lt;${emailInput.value}&gt; whats to contact you:</h2>
      <pre style="font-size: 15px">${messageInput.value}</pre>
      `,
    };

    fetch(
      "https://us-central1-personal-web-a99ce.cloudfunctions.net/sendMail",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => console.log(res))
      .catch((error) => console.error("Error:", error))
      .then((response) => console.log("Success:", response));

    clearForm();
    showModal();
  }
}

function clearForm() {
  nameInput.value = "";
  emailInput.value = "";
  messageInput.value = "";
}

const toggleMobileNavBar = () => {
  if (!mobileNavBarShown) {
    mobileNavBarShown = true;
    navBarContainer.classList.remove("navbar-hidden");
    navBarTab.getElementsByTagName("i")[0].classList.add("rotate180");
  } else {
    mobileNavBarShown = false;
    navBarContainer.classList.add("navbar-hidden");
    navBarTab.getElementsByTagName("i")[0].classList.remove("rotate180");
  }
};
