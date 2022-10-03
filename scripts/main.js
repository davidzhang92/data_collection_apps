// Switching Image function
const myImage = document.querySelector("img");

myImage.onclick = () => {
  const mySrc = myImage.getAttribute("src");
  if (mySrc === "images/firefox_logo.png") {
    myImage.setAttribute("src", "images/firefox_logo_2.png");
  } else {
    myImage.setAttribute("src", "images/firefox_logo.png");
  }
};
let myButton = document.querySelector("button");
let myHeading = document.querySelector("h1");

// Personalized welcome message code
// function setUserName() {
//     const myName = prompt("Please enter your name.");
//     if (!myName) {
//       setUserName();
//     } else {
//       localStorage.setItem("name", myName);
//       myHeading.textContent = `Mozilla is cool, ${myName}`;
//     }
//   }
  

// if (!localStorage.getItem("name")) {
//     setUserName();
// } else {
// const storedName = localStorage.getItem("name");
// myHeading.textContent = `Mozilla is cool, ${storedName}`;
// }

// myButton.onclick = () => {
// setUserName();
//   };
  
  