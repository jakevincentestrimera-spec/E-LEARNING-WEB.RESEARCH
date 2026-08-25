const menu = document.getElementById("menu");
const overlay = document.getElementById("overlay");

document.getElementById("menuToggle").onclick = () => {
    menu.classList.add("show");
    overlay.classList.add("show");
}

document.getElementById("closeMenu").onclick = () => {
    menu.classList.remove("show");
    overlay.classList.remove("show");
}

overlay.onclick = () => {
    menu.classList.remove("show");
    overlay.classList.remove("show");
}

