
function iniciarCarrossel() {
    var carrosel = document.querySelector(".carrosel");
    var indicadores = Array.from(document.querySelectorAll(".indicador"));
    var slides = Array.from(document.querySelectorAll(".carrosel > li"));
    var btnAnterior = document.querySelector(".setaCarrosel.anterior");
    var btnProxima = document.querySelector(".setaCarrosel.proxima");

    if (!carrosel || indicadores.length === 0 || slides.length === 0) {
        return;
    }

    var indiceAtual = 0;

    function marcarIndicador(indice) {
        indiceAtual = indice;
        indicadores.forEach(function (bolinha, i) {
            if (i === indice) {
                bolinha.classList.add("ativo");
            } else {
                bolinha.classList.remove("ativo");
            }
        });
    }

    function irParaSlide(indice) {
        if (indice < 0) {
            indice = slides.length - 1;
        } else if (indice >= slides.length) {
            indice = 0;
        }

        var slideAlvo = slides[indice];
        if (!slideAlvo) {
            return;
        }

        carrosel.scrollTo({
            left: slideAlvo.offsetLeft,
            behavior: "smooth"
        });
        marcarIndicador(indice);
    }

    indicadores.forEach(function (indicador, indice) {
        indicador.addEventListener("click", function () {
            irParaSlide(indice);
        });
    });

    if (btnAnterior) {
        btnAnterior.addEventListener("click", function () {
            irParaSlide(indiceAtual - 1);
        });
    }

    if (btnProxima) {
        btnProxima.addEventListener("click", function () {
            irParaSlide(indiceAtual + 1);
        });
    }

    carrosel.addEventListener("scroll", function () {
        var larguraSlide = slides[0].offsetWidth;
        if (larguraSlide <= 0) {
            return;
        }
        var novoIndice = Math.round(carrosel.scrollLeft / larguraSlide);
        if (novoIndice >= 0 && novoIndice < indicadores.length) {
            marcarIndicador(novoIndice);
        }
    });
}

function iniciarBotoesHome() {
    var botoesSaibaMais = Array.from(document.querySelectorAll(".carrosel li button"));
    var modal = document.querySelector("#modalNoticia");
    var tituloModal = document.querySelector("#modalNoticiaTitulo");
    var textoModal = document.querySelector("#modalNoticiaTexto");
    var btnFecharModal = document.querySelector("#fecharModalNoticia");

    if (modal && tituloModal && textoModal && btnFecharModal) {
        botoesSaibaMais.forEach(function (botao) {
            botao.addEventListener("click", function () {
                var card = botao.closest("li");
                var titulo = card.querySelector("h2");
                var descricao = card.querySelector("p");

                tituloModal.textContent = titulo ? titulo.textContent : "Notícia";
                textoModal.textContent = descricao ? descricao.textContent : "";
                modal.classList.remove("oculto");
            });
        });

        btnFecharModal.addEventListener("click", function () {
            modal.classList.add("oculto");
        });

        modal.addEventListener("click", function (evento) {
            if (evento.target === modal) {
                modal.classList.add("oculto");
            }
        });
    }

    var botoesVerTodos = Array.from(document.querySelectorAll("main .verTodos"));
    botoesVerTodos.forEach(function (botao) {
        botao.addEventListener("click", function () {
            var secao = botao.closest("section");
            if (!secao) {
                return;
            }

            var extras = Array.from(secao.querySelectorAll(".itemExtra"));
            if (extras.length === 0) {
                return;
            }

            var estaFechado = extras[0].classList.contains("oculto");
            extras.forEach(function (item) {
                if (estaFechado) {
                    item.classList.remove("oculto");
                } else {
                    item.classList.add("oculto");
                }
            });

            botao.textContent = estaFechado ? "Ver menos" : "Ver todos";
        });
    });
}

iniciarCarrossel();
iniciarBotoesHome();
