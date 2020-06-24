import "./style.scss";
const THREE = require("three");

let scene, camera, renderer, starGeo, stars;
let navBarContainer, navBar, navBarTab, navBarLIs, actualSection;
let homeSection, aboutSection, portfolioSection, contactSection;
let mobileNavBarShown = false;

let mobileWidth = window.innerWidth < 768;

window.onload = () => {
  navBarContainer = document.querySelector("#NavBarContainer");
  navBar = document.querySelector("#NavBar");
  navBarTab = document.querySelector("#NavBarTab");
  navBarLIs = Array.from(navBar.querySelector("ul").getElementsByTagName("li"));
  actualSection = -1;

  homeSection = document.querySelector("#Home");
  aboutSection = document.querySelector("#About");
  portfolioSection = document.querySelector("#Portfolio");
  contactSection = document.querySelector("#Contact");

  init();
  addListeners();

  let initialNavBarOffset = navBar.offsetTop;

  if (mobileWidth) {
    navBarContainer.classList.add("sticky");
  } else {
    window.onscroll = () => {
      checkNavBar();

      if (window.pageYOffset >= initialNavBarOffset) {
        navBar.classList.add("sticky");
      } else {
        navBar.classList.remove("sticky");
      }
    };
  }
};

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

  let sprite = new THREE.TextureLoader().load("../assets/star.png");
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

const checkNavBar = () => {
  let actualY = window.pageYOffset;
  let selectedIndex;

  if (actualY >= homeSection.offsetTop && actualY < aboutSection.offsetTop) {
    selectedIndex = 0;
  } else if (
    actualY >= aboutSection.offsetTop &&
    actualY < portfolioSection.offsetTop
  ) {
    selectedIndex = 1;
  } else if (
    actualY >= portfolioSection.offsetTop &&
    actualY < contactSection.offsetTop
  ) {
    selectedIndex = 2;
  } else if (actualY >= contactSection.offsetTop) {
    selectedIndex = 3;
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
};

const toggleMobileNavBar = () => {
  if (!mobileNavBarShown) {
    mobileNavBarShown = true;
    navBarContainer.classList.remove("navbar-hidden");
    navBarTab.getElementsByTagName("svg")[0].classList.add("rotate180");
  } else {
    mobileNavBarShown = false;
    navBarContainer.classList.add("navbar-hidden");
    navBarTab.getElementsByTagName("svg")[0].classList.remove("rotate180");
  }
};
