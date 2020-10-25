import "./style.scss";
import loadThreeJS from "./loadThreeJS";
import loadD3 from "./loadD3";
import loadReact from "./loadReact";

let navBarContainer,
  navBar,
  navBarTab,
  navBarLIs,
  actualSection,
  navBarOffset,
  chartContainer;
let initialNavBarHeight;
let cVLink;
let homeSection, aboutSection, skillsSection, portfolioSection, contactSection;
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

  cVLink = document.querySelector("#CVLink");

  homeSection = document.querySelector("#Home");
  aboutSection = document.querySelector("#About");
  skillsSection = document.querySelector("#Skills");
  portfolioSection = document.querySelector("#Portfolio");
  contactSection = document.querySelector("#Contact");

  nameInput = document.querySelector("#NameInput");
  emailInput = document.querySelector("#EmailInput");
  messageInput = document.querySelector("#MessageInput");
  mailFormButton = document.querySelector("#MailFormButton");

  chartContainer = document.querySelector("#ChartContainer");

  modal = document.querySelector("#Modal");
  modalDisposeButton = document.querySelector("#ModalDisposeButton");

  // Sets cVLink href attribute.
  fetch("https://personal-web-a99ce.firebaseio.com/CVURL.json")
    .then((data) => data.json())
    .then((data) => {
      cVLink.setAttribute("href", data);
    });

  loadThreeJS(homeSection, mobileWidth);
  addListeners();
  loadD3(mobileWidth, chartContainer);
  loadReact();
  clipSeparators();

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

function clipSeparators() {
  let separatorsT1 = document.querySelectorAll(
    ".separator.separator-type-1 .spikes"
  );
  let separatorsT2 = document.querySelectorAll(
    ".separator.separator-type-2 .spikes"
  );

  for (let i = 0; i < separatorsT1.length; i++)
    separatorsT1[i].style.clipPath = generateSpikes(10, true);

  for (let i = 0; i < separatorsT2.length; i++)
    separatorsT2[i].style.clipPath = generateSpikes(10, false);

  function generateSpikes(nSpikes, toBottom) {
    let points = nSpikes * 2 + 1;
    let yIterator = false;
    let step = 100 / (points - 1);
    let x = 0;

    let clipPathValue = `polygon(0% ${toBottom ? 0 : 100}%`;
    x += step;

    for (let i = 0; i < points - 1; i++) {
      if (yIterator) {
        clipPathValue += `, ${x}% ${toBottom ? 0 : 100}%`;
      } else {
        clipPathValue += `, ${x}% ${toBottom ? 100 : 0}%`;
      }

      x += step;
      yIterator = !yIterator;
    }

    return clipPathValue + ")";
  }
}

const checkNavBar = () => {
  let actualY = window.pageYOffset;
  let selectedIndex;

  if (actualY >= homeSection.offsetTop && actualY < aboutSection.offsetTop) {
    selectedIndex = 0;
  } else if (
    actualY >= aboutSection.offsetTop - initialNavBarHeight &&
    actualY < skillsSection.offsetTop - initialNavBarHeight
  ) {
    selectedIndex = 1;
  } else if (
    actualY >= skillsSection.offsetTop - initialNavBarHeight &&
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
  modal.style.transition = "visibility 1s, opacity 1s";
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
      .then((res) => {})
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
