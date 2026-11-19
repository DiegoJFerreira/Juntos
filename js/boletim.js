

function iniciarFiltroBoletim() {
    var seletorOng = document.querySelector("#boletim .seletorCaixa");
    var boletins = Array.from(document.querySelectorAll(".caixaBoletim"));
    var avisoVazio = document.querySelector("#semBoletins");
    var btnVerMais = document.querySelector("#verMaisBoletim");
    var mostrandoTodos = false;

    if (!seletorOng || boletins.length === 0) {
        return;
    }

    function atualizarListaBoletins() {
        var ongEscolhida = seletorOng.value;
        var visiveis = 0;

        boletins.forEach(function (card) {
            var ongCard = card.dataset.ong || "";
            var ehExtra = card.classList.contains("itemExtra");

            if (ongEscolhida === "Todas") {
                if (!ehExtra || mostrandoTodos) {
                    card.classList.remove("oculto");
                    visiveis++;
                } else {
                    card.classList.add("oculto");
                }
            } else {
                if (ongCard === ongEscolhida) {
                    card.classList.remove("oculto");
                    visiveis++;
                } else {
                    card.classList.add("oculto");
                }
            }
        });

        if (btnVerMais) {
            if (ongEscolhida === "Todas") {
                btnVerMais.classList.remove("oculto");
                btnVerMais.textContent = mostrandoTodos ? "Ver menos" : "Ver mais boletins";
            } else {
                btnVerMais.classList.add("oculto");
            }
        }

        if (avisoVazio) {
            if (visiveis === 0) {
                avisoVazio.classList.remove("oculto");
            } else {
                avisoVazio.classList.add("oculto");
            }
        }
    }

    seletorOng.addEventListener("change", atualizarListaBoletins);

    if (btnVerMais) {
        btnVerMais.addEventListener("click", function () {
            mostrandoTodos = !mostrandoTodos;
            atualizarListaBoletins();
        });
    }

    atualizarListaBoletins();
}

function iniciarAcoesBoletim() {
    var botoesCurtir = Array.from(document.querySelectorAll(".btnCurtir"));
    var botoesCompartilhar = Array.from(document.querySelectorAll(".btnCompartilhar"));
    var botoesDownload = Array.from(document.querySelectorAll(".btnDownload"));

    botoesCurtir.forEach(function (botao) {
        botao.addEventListener("click", function () {
            var icone = botao.querySelector("i");
            var texto = botao.querySelector("p");
            var curtido = botao.classList.toggle("curtido");

            if (icone) {
                if (curtido) {
                    icone.classList.remove("far");
                    icone.classList.add("fas");
                } else {
                    icone.classList.remove("fas");
                    icone.classList.add("far");
                }
            }

            if (texto) {
                texto.textContent = curtido ? "Curtido" : "Curtir";
            }
        });
    });

    botoesCompartilhar.forEach(function (botao) {
        botao.addEventListener("click", function () {
            var card = botao.closest(".caixaBoletim");
            var titulo = card ? card.querySelector("h4").textContent : "Boletim Juntos";

            if (navigator.share) {
                navigator.share({
                    title: titulo + " - Juntos",
                    text: "Confira o relatório de impacto de " + titulo,
                    url: window.location.href
                }).catch(function () {
                    mostrarAviso("Link pronto para compartilhar!");
                });
            } else if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href).then(function () {
                    mostrarAviso("Link do boletim copiado!");
                });
            } else {
                mostrarAviso("Compartilhando: " + titulo);
            }
        });
    });

    botoesDownload.forEach(function (botao) {
        botao.addEventListener("click", function () {
            var card = botao.closest(".caixaBoletim");
            var imagem = card ? card.querySelector(".imagem-vertical") : null;
            if (!imagem) {
                return;
            }

            var link = document.createElement("a");
            link.href = imagem.getAttribute("src");
            link.download = "boletim-juntos.jpg";
            document.body.appendChild(link);
            link.click();
            link.remove();

            mostrarAviso("Download do boletim iniciado!");
        });
    });
}

iniciarFiltroBoletim();
iniciarAcoesBoletim();
