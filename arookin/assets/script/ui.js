
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