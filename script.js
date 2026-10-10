const abrirMenu = document.querySelector(".abrirMenu");
const fecharMenu = document.querySelector(".fecharMenu");
const menu = document.querySelector("#menu");

abrirMenu.addEventListener("click", function () {
    menu.classList.remove("menuClose");
    menu.classList.add("menuOpen");

    abrirMenu.setAttribute("aria-expanded", "true");
});

fecharMenu.addEventListener("click", function () {
    menu.classList.remove("menuOpen");
    menu.classList.add("menuClose");

    abrirMenu.setAttribute("aria-expanded", "false");
});