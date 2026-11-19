


function abrirMenu() {
    var btnAbrir = document.querySelector(".abrirMenu");
    var btnFechar = document.querySelector(".fecharMenu");
    var menu = document.querySelector("#menu");

    if (!btnAbrir || !btnFechar || !menu) {
        return;
    }

    btnAbrir.addEventListener("click", function () {
        menu.classList.remove("menuClose");
        menu.classList.add("menuOpen");
        btnAbrir.setAttribute("aria-expanded", "true");
    });

    btnFechar.addEventListener("click", function () {
        menu.classList.remove("menuOpen");
        menu.classList.add("menuClose");
        btnAbrir.setAttribute("aria-expanded", "false");
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && menu.classList.contains("menuOpen")) {
            menu.classList.remove("menuOpen");
            menu.classList.add("menuClose");
            btnAbrir.setAttribute("aria-expanded", "false");
        }
    });
}

function aplicarTema(modoEscuro) {
    var corpo = document.body;
    var botaoTema = document.querySelector("#tema");
    var logoHeader = document.querySelector("header .logo img");

    if (modoEscuro) {
        corpo.classList.remove("claro");
        corpo.classList.add("escuro");
    } else {
        corpo.classList.remove("escuro");
        corpo.classList.add("claro");
    }

    if (logoHeader) {
        logoHeader.src = modoEscuro ? "src/logoBranca.png" : "src/logoPreta.png";
    }

    if (botaoTema) {
        atualizarIconeTema(botaoTema, modoEscuro);
    }
}

function iniciarTema() {
    var botaoTema = document.querySelector("#tema");
    var temaSalvo = localStorage.getItem("temaJuntos");
    var iniciarEscuro = temaSalvo === "escuro";

    aplicarTema(iniciarEscuro);

    if (!botaoTema) {
        return;
    }

    botaoTema.addEventListener("click", function () {
        var modoEscuro = !document.body.classList.contains("escuro");
        localStorage.setItem("temaJuntos", modoEscuro ? "escuro" : "claro");
        aplicarTema(modoEscuro);
    });
}

function atualizarIconeTema(botaoTema, modoEscuro) {
    var icone = botaoTema.querySelector("i");
    if (!icone) {
        return;
    }

    if (modoEscuro) {
        icone.classList.remove("fa-sun");
        icone.classList.add("fa-moon");
        botaoTema.setAttribute("aria-label", "Mudar para tema claro");
    } else {
        icone.classList.remove("fa-moon");
        icone.classList.add("fa-sun");
        botaoTema.setAttribute("aria-label", "Mudar para tema escuro");
    }
}

function mostrarAviso(texto) {
    var aviso = document.querySelector("#avisoFlutuante");

    if (!aviso) {
        aviso = document.createElement("div");
        aviso.id = "avisoFlutuante";
        aviso.className = "avisoFlutuante oculto";
        document.body.appendChild(aviso);
    }

    aviso.textContent = texto;
    aviso.classList.remove("oculto");

    clearTimeout(aviso.temporizador);
    aviso.temporizador = setTimeout(function () {
        aviso.classList.add("oculto");
    }, 3000);
}

abrirMenu();
iniciarTema();
