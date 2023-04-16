const LOCAL_STORAGE_DONT_SHOW_HOW_TO_USE_KEY = "dontShowHowToUse";

const openNavButton = document.getElementById("#")
function openNav() {
    const nav = document.getElementById("left")
    setTimeout(function() {
        nav.style.display = "block"
    },10);
    
    const openButton = document.querySelector('[data-open-nav]')
    openButton.style.display = "none"
}

function closeNav() {
    const nav = document.getElementById("left")
    nav.style.display = "none"
    const openButton = document.querySelector('[data-open-nav]')
    openButton.style.display = "block"
} 

function closeShow() {
    useTab.style.display = "none";
    localStorage.setItem("dontShowHowToUse", true);
  }

const howToUse = document.getElementById("howToUse")
function showHowToUse() {
    // Check if the item exists in localStorage
    if (localStorage.getItem("dontShowHowToUse")) {
      return;
    }
  
    window.addEventListener("scroll", function () {
      if (window.scrollY > 5) {
        useTab.style.display = "block";
      }
    });
  
    // Remove the event listener after the first scroll
    window.removeEventListener("scroll", arguments.callee);
  }

