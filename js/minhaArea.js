

var listaOngsCarregadas = [];
var ongParaDoacaoAtual = null;
var ongSelecionadaMapaId = null;
var filtroMapaAtual = "todas";

function normalizarTexto(texto) {
    return (texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function formatarReais(valor) {
    var numero = Number(valor) || 0;
    return "R$ " + numero.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function obterDoacoesExtrasPorOng() {
    try {
        return JSON.parse(localStorage.getItem("doacoesPorOngJuntos")) || {};
    } catch (e) {
        return {};
    }
}

function obterDoacoesUsuarioSalvas() {
    try {
        return JSON.parse(localStorage.getItem("doacoesUsuarioJuntos")) || [];
    } catch (e) {
        return [];
    }
}

function obterTotalDoadoOng(ong) {
    var extras = obterDoacoesExtrasPorOng();
    var extra = Number(extras[ong.nome]) || 0;
    return (Number(ong.totalDoado) || 0) + extra;
}

function iniciarAbasMinhaArea() {
    var seletores = Array.from(document.getElementsByClassName("seletorArrasta"));

    if (seletores.length === 0) {
        return;
    }

    var perfilSalvo = localStorage.getItem("perfilUsuarioJuntos");
    var seletorUsuario = document.querySelector("#TiposUsuario");

    if (perfilSalvo && seletorUsuario) {
        var botoesUsuario = Array.from(seletorUsuario.children);
        botoesUsuario.forEach(function (botao) {
            var textoBotao = normalizarTexto(botao.textContent);
            if (textoBotao === normalizarTexto(perfilSalvo)) {
                botoesUsuario.forEach(function (b) {
                    b.classList.remove("ativo");
                });
                botao.classList.add("ativo");
            }
        });
    }

    seletores.forEach(function (seletor) {
        var botoes = Array.from(seletor.children);

        botoes.forEach(function (botao) {
            botao.addEventListener("click", function () {
                botoes.forEach(function (b) {
                    b.classList.remove("ativo");
                });
                botao.classList.add("ativo");
                aplicarFiltroAbas(botao, seletor);
            });
        });

        var botaoAtivo = seletor.querySelector(".ativo") || botoes[0];
        if (botaoAtivo) {
            aplicarFiltroAbas(botaoAtivo, seletor);
        }
    });
}

function aplicarFiltroAbas(botaoAtivo, seletor) {
    var filtroConteudo = normalizarTexto(botaoAtivo.textContent).replace(/\s+/g, "");
    var gruposAbas = Array.from(document.getElementsByClassName("Tipos"));
    var containerAbas = seletor.id === "TiposUsuario" ? gruposAbas[0] : gruposAbas[1];

    if (!containerAbas) {
        return;
    }

    var abas = Array.from(containerAbas.children);
    abas.forEach(function (aba) {
        var classeAba = normalizarTexto(aba.className).replace(/\s+/g, "");
        if (classeAba.indexOf(filtroConteudo) !== -1) {
            aba.classList.remove("oculto");
        } else {
            aba.classList.add("oculto");
        }
    });
}

function iniciarBotoesVerTodas() {
    var botoesVerTodas = Array.from(document.querySelectorAll("#minhaArea .textoBotao .verTodos"));

    botoesVerTodas.forEach(function (botao) {
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

            botao.textContent = estaFechado ? "Ver menos" : "Ver todas";
        });
    });
}

function iniciarEstoqueOng() {
    var itensEstoque = Array.from(document.querySelectorAll(".itemEstoque"));
    if (itensEstoque.length === 0) {
        return;
    }

    var estoqueSalvo = {};
    try {
        estoqueSalvo = JSON.parse(localStorage.getItem("estoqueOngJuntos")) || {};
    } catch (e) {
        estoqueSalvo = {};
    }

    function atualizarCardEstoque(card, novaQtd) {
        var max = parseInt(card.dataset.max, 10) || 50;
        if (novaQtd < 0) {
            novaQtd = 0;
        }
        card.dataset.qtd = String(novaQtd);

        var textoQtd = card.querySelector(".qtdEstoque");
        if (textoQtd) {
            textoQtd.textContent = novaQtd + (novaQtd === 1 ? " item" : " itens");
        }

        var porcentagem = Math.min(100, Math.round((novaQtd / max) * 100));
        var nivelArredondado = Math.round(porcentagem / 10) * 10;

        var barra = card.querySelector(".barraPreenchida");
        if (barra) {
            for (var n = 0; n <= 100; n += 10) {
                barra.classList.remove("nivel-" + n);
            }
            barra.classList.add("nivel-" + nivelArredondado);

            if (porcentagem <= 25) {
                barra.classList.add("estoqueBaixo");
            } else {
                barra.classList.remove("estoqueBaixo");
            }
        }

        var alerta = card.querySelector(".alertaEstoque");
        if (alerta) {
            if (porcentagem <= 25) {
                alerta.classList.remove("oculto");
            } else {
                alerta.classList.add("oculto");
            }
        }

        var id = card.dataset.estoqueId;
        if (id) {
            estoqueSalvo[id] = novaQtd;
            localStorage.setItem("estoqueOngJuntos", JSON.stringify(estoqueSalvo));
        }
    }

    itensEstoque.forEach(function (card) {
        var id = card.dataset.estoqueId;
        var qtdInicial = parseInt(card.dataset.qtd, 10) || 0;
        if (id && typeof estoqueSalvo[id] === "number") {
            qtdInicial = estoqueSalvo[id];
        }

        atualizarCardEstoque(card, qtdInicial);

        var botoes = Array.from(card.querySelectorAll(".btnEstoque"));
        botoes.forEach(function (btn) {
            btn.addEventListener("click", function () {
                var atual = parseInt(card.dataset.qtd, 10) || 0;
                var acao = btn.dataset.acao;
                var passo = 5;

                if (acao === "aumentar") {
                    atualizarCardEstoque(card, atual + passo);
                } else {
                    atualizarCardEstoque(card, Math.max(0, atual - passo));
                }
            });
        });
    });
}

async function carregarOngsJson() {
    try {
        var resposta = await fetch("./data/ongs.json");
        if (!resposta.ok) {
            throw new Error("Erro ao obter os dados: " + resposta.status);
        }

        var dadosJson = await resposta.json();
        listaOngsCarregadas = dadosJson.ong || [];

        preencherFiltroCategorias(listaOngsCarregadas);
        renderizarOngs(listaOngsCarregadas);
        iniciarMapaOngs();
    } catch (erro) {
        console.error(erro);
        mostrarAviso("Não foi possível carregar a lista de ONGs.");
    }
}

function preencherFiltroCategorias(ongs) {
    var selectCategoria = document.querySelector("#filtroCategoria");
    if (!selectCategoria) {
        return;
    }

    var categorias = [];
    ongs.forEach(function (ong) {
        if (categorias.indexOf(ong.categoria) === -1) {
            categorias.push(ong.categoria);
        }
    });

    categorias.sort();
    categorias.forEach(function (categoria) {
        var option = document.createElement("option");
        option.value = categoria;
        option.textContent = categoria;
        selectCategoria.appendChild(option);
    });
}

function criarCardOng(ong) {
    var li = document.createElement("li");
    li.classList.add("lista2Lados");

    var divPerfil = document.createElement("div");
    divPerfil.classList.add("perfil");

    var img = document.createElement("img");
    img.classList.add("fotoPerfil");
    img.src = ong.foto || "src/logoPreta.png";
    img.alt = ong.altFoto || ("Logo de " + ong.nome);
    img.addEventListener("error", function () {
        img.src = "src/logoPreta.png";
    });
    divPerfil.appendChild(img);

    var divConteudo = document.createElement("div");
    divConteudo.classList.add("perfilConteudo");

    var h3 = document.createElement("h3");
    h3.textContent = ong.nome;

    var divDataHora = document.createElement("div");
    divDataHora.classList.add("dataHora");

    var pCidade = document.createElement("p");
    pCidade.textContent = ong.cidade + " - " + ong.estado;

    var pSeparador = document.createElement("p");
    pSeparador.textContent = "•";
    pSeparador.classList.add("separador");

    var pDistancia = document.createElement("p");
    pDistancia.textContent = ong.distanciaKm + " km";

    divDataHora.appendChild(pCidade);
    divDataHora.appendChild(pSeparador);
    divDataHora.appendChild(pDistancia);

    var pCategoria = document.createElement("p");
    pCategoria.classList.add("status");
    pCategoria.textContent = ong.categoria;

    var pDescricao = document.createElement("p");
    pDescricao.textContent = ong.descricao;

    var pDoado = document.createElement("p");
    pDoado.classList.add("valorDoadoOng");
    pDoado.dataset.ongNome = ong.nome;
    pDoado.textContent = "Total doado: " + formatarReais(obterTotalDoadoOng(ong));

    divConteudo.appendChild(h3);
    divConteudo.appendChild(divDataHora);
    divConteudo.appendChild(pCategoria);
    divConteudo.appendChild(pDescricao);
    divConteudo.appendChild(pDoado);

    var divBotao = document.createElement("div");
    divBotao.classList.add("botaoPequeno");

    var botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = "Doar";
    botao.addEventListener("click", function () {
        abrirModalDoacao(ong.nome);
    });
    divBotao.appendChild(botao);

    li.appendChild(divPerfil);
    li.appendChild(divConteudo);
    li.appendChild(divBotao);

    return li;
}

function renderizarOngs(ongs) {
    var ulDestaque = document.querySelector("#OngsPerfil > .EmDestaque > ul");
    var ulProximas = document.querySelector("#OngsPerfil > .MaisPróximas > ul");
    var avisoVazio = document.querySelector("#semResultadosOng");

    if (!ulDestaque || !ulProximas) {
        return;
    }

    ulDestaque.innerHTML = "";

    var cardsAntigos = Array.from(ulProximas.querySelectorAll('li[data-json="true"]'));
    cardsAntigos.forEach(function (card) {
        card.remove();
    });

    var totalExibidas = 0;

    ongs.forEach(function (ong) {
        var tipoLimpo = (ong.tipo || "").replace(/\s+/g, "");
        var card = criarCardOng(ong);
        card.setAttribute("data-json", "true");

        if (tipoLimpo === "EmDestaque") {
            ulDestaque.appendChild(card);
            totalExibidas++;
        } else if (tipoLimpo === "MaisPróximas") {
            ulProximas.appendChild(card);
            totalExibidas++;
        }
    });

    var botoesFixos = Array.from(ulProximas.querySelectorAll("li:not([data-json='true']) button"));
    botoesFixos.forEach(function (botao) {
        if (botao.dataset.vinculado === "true") {
            return;
        }
        botao.dataset.vinculado = "true";
        botao.addEventListener("click", function () {
            var card = botao.closest("li");
            var titulo = card ? card.querySelector("h3") : null;
            abrirModalDoacao(titulo ? titulo.textContent : "ONG");
        });
    });

    if (avisoVazio) {
        if (totalExibidas === 0) {
            avisoVazio.classList.remove("oculto");
        } else {
            avisoVazio.classList.add("oculto");
        }
    }
}

function iniciarMapaOngs() {
    var containerPinos = document.querySelector("#pinosMapa");
    var botoesFiltroMapa = Array.from(document.querySelectorAll(".btnMapaFiltro"));
    var btnDoarMapa = document.querySelector("#btnDoarMapa");

    if (!containerPinos) {
        return;
    }

    botoesFiltroMapa.forEach(function (botao) {
        if (botao.dataset.vinculado === "true") {
            return;
        }
        botao.dataset.vinculado = "true";
        botao.addEventListener("click", function () {
            botoesFiltroMapa.forEach(function (b) {
                b.classList.remove("ativo");
            });
            botao.classList.add("ativo");
            filtroMapaAtual = botao.dataset.filtro || "todas";
            renderizarPinosMapa();
        });
    });

    if (btnDoarMapa && btnDoarMapa.dataset.vinculado !== "true") {
        btnDoarMapa.dataset.vinculado = "true";
        btnDoarMapa.addEventListener("click", function () {
            var nome = btnDoarMapa.dataset.ongNome;
            if (nome) {
                abrirModalDoacao(nome);
            }
        });
    }

    renderizarPinosMapa();
}

function renderizarPinosMapa() {
    var containerPinos = document.querySelector("#pinosMapa");
    var resumoMapa = document.querySelector("#resumoMapaDoado");
    var detalheCard = document.querySelector("#detalheOngMapa");

    if (!containerPinos) {
        return;
    }

    var ongsNoMapa = listaOngsCarregadas.filter(function (ong) {
        if (!ong.pinoMapa) {
            return false;
        }
        var tipoLimpo = (ong.tipo || "").replace(/\s+/g, "");
        if (filtroMapaAtual === "proximas") {
            return tipoLimpo === "MaisPróximas";
        }
        if (filtroMapaAtual === "destaque") {
            return tipoLimpo === "EmDestaque";
        }
        return true;
    });

    containerPinos.innerHTML = "";

    var somaMapa = 0;
    ongsNoMapa.forEach(function (ong) {
        somaMapa += obterTotalDoadoOng(ong);
    });

    if (resumoMapa) {
        resumoMapa.textContent = "Total doado no mapa: " + formatarReais(somaMapa);
    }

    if (ongsNoMapa.length === 0) {
        if (detalheCard) {
            detalheCard.classList.add("oculto");
        }
        return;
    }

    var existeSelecionada = ongsNoMapa.some(function (o) {
        return o.id === ongSelecionadaMapaId;
    });
    if (!existeSelecionada) {
        ongSelecionadaMapaId = ongsNoMapa[0].id;
    }

    ongsNoMapa.forEach(function (ong) {
        var btnPino = document.createElement("button");
        btnPino.type = "button";
        btnPino.className = "pinoMapa " + ong.pinoMapa;
        if (ong.id === ongSelecionadaMapaId) {
            btnPino.classList.add("ativo");
        }
        btnPino.setAttribute("aria-label", ong.nome + " - " + formatarReais(obterTotalDoadoOng(ong)));

        var icone = document.createElement("i");
        icone.className = "fa-solid fa-location-dot";

        var texto = document.createElement("span");
        texto.textContent = ong.nome;

        btnPino.appendChild(icone);
        btnPino.appendChild(texto);

        btnPino.addEventListener("click", function () {
            ongSelecionadaMapaId = ong.id;
            renderizarPinosMapa();
        });

        containerPinos.appendChild(btnPino);

        if (ong.id === ongSelecionadaMapaId) {
            atualizarDetalheMapa(ong);
        }
    });
}

function atualizarDetalheMapa(ong) {
    var detalheCard = document.querySelector("#detalheOngMapa");
    var foto = document.querySelector("#mapaOngFoto");
    var nome = document.querySelector("#mapaOngNome");
    var cidade = document.querySelector("#mapaOngCidade");
    var distancia = document.querySelector("#mapaOngDistancia");
    var categoria = document.querySelector("#mapaOngCategoria");
    var doado = document.querySelector("#mapaOngDoado");
    var btnDoar = document.querySelector("#btnDoarMapa");

    if (!detalheCard) {
        return;
    }

    detalheCard.classList.remove("oculto");
    if (foto) {
        foto.src = ong.foto || "src/logoPreta.png";
        foto.alt = ong.altFoto || ong.nome;
    }
    if (nome) {
        nome.textContent = ong.nome;
    }
    if (cidade) {
        cidade.textContent = ong.cidade + " - " + ong.estado;
    }
    if (distancia) {
        distancia.textContent = ong.distanciaKm + " km";
    }
    if (categoria) {
        categoria.textContent = ong.categoria;
    }
    if (doado) {
        doado.textContent = "Total já doado para esta ONG: " + formatarReais(obterTotalDoadoOng(ong));
    }
    if (btnDoar) {
        btnDoar.dataset.ongNome = ong.nome;
    }
}

function iniciarBuscaEFiltros() {
    var campoBusca = document.querySelector("#pesquisa input");
    var botaoFiltro = document.querySelector(".botaoFiltro");
    var painelFiltros = document.querySelector("#painelFiltros");
    var selectCategoria = document.querySelector("#filtroCategoria");
    var selectOrdenacao = document.querySelector("#ordenarOngs");

    if (botaoFiltro && painelFiltros) {
        botaoFiltro.addEventListener("click", function () {
            painelFiltros.classList.toggle("oculto");
        });
    }

    function filtrarEOrdenar() {
        var termo = normalizarTexto(campoBusca ? campoBusca.value : "");
        var categoria = selectCategoria ? selectCategoria.value : "Todas";
        var ordem = selectOrdenacao ? selectOrdenacao.value : "padrao";

        var filtradas = listaOngsCarregadas.filter(function (ong) {
            var textoOng = normalizarTexto(
                ong.nome + " " + ong.cidade + " " + ong.estado + " " + ong.categoria + " " + ong.descricao
            );
            var bateTexto = termo === "" || textoOng.indexOf(termo) !== -1;
            var bateCategoria = categoria === "Todas" || ong.categoria === categoria;
            return bateTexto && bateCategoria;
        });

        if (ordem === "distancia") {
            filtradas.sort(function (a, b) {
                return a.distanciaKm - b.distanciaKm;
            });
        } else if (ordem === "nome") {
            filtradas.sort(function (a, b) {
                return a.nome.localeCompare(b.nome);
            });
        }

        renderizarOngs(filtradas);
    }

    if (campoBusca) {
        campoBusca.addEventListener("input", filtrarEOrdenar);
    }
    if (selectCategoria) {
        selectCategoria.addEventListener("change", filtrarEOrdenar);
    }
    if (selectOrdenacao) {
        selectOrdenacao.addEventListener("change", filtrarEOrdenar);
    }
}

function iniciarAcoesVoluntario() {
    var botoesVoluntario = Array.from(document.querySelectorAll(".Voluntário .botaoPequeno button"));

    botoesVoluntario.forEach(function (botao) {
        botao.addEventListener("click", function () {
            var textoAtual = botao.textContent.trim();

            if (textoAtual === "Confirmar Presença") {
                botao.textContent = "Presença Confirmada";
                botao.classList.add("confirmado");
                mostrarAviso("Presença confirmada na ação!");
            } else if (textoAtual === "Presença Confirmada") {
                botao.textContent = "Confirmar Presença";
                botao.classList.remove("confirmado");
            } else if (textoAtual === "Quero Participar") {
                botao.textContent = "Inscrição Realizada";
                botao.classList.add("confirmado");
                mostrarAviso("Você se inscreveu como voluntário!");
            } else {
                botao.textContent = "Quero Participar";
                botao.classList.remove("confirmado");
            }
        });
    });
}

function abrirModalDoacao(nomeOng) {
    var modal = document.querySelector("#modalDoacao");
    var tituloOng = document.querySelector("#modalDoacaoOng");
    var inputValor = document.querySelector("#valorDoacao");

    if (!modal || !tituloOng) {
        return;
    }

    ongParaDoacaoAtual = nomeOng;
    tituloOng.textContent = "Doar para " + nomeOng;
    if (inputValor) {
        inputValor.value = "50";
    }
    modal.classList.remove("oculto");
}

function iniciarModalDoacao() {
    var modal = document.querySelector("#modalDoacao");
    var btnFechar = document.querySelector("#fecharModalDoacao");
    var btnCancelar = document.querySelector("#cancelarDoacao");
    var formDoacao = document.querySelector("#formDoacao");

    if (!modal || !formDoacao) {
        return;
    }

    function fechar() {
        modal.classList.add("oculto");
    }

    if (btnFechar) {
        btnFechar.addEventListener("click", fechar);
    }
    if (btnCancelar) {
        btnCancelar.addEventListener("click", fechar);
    }
    modal.addEventListener("click", function (evento) {
        if (evento.target === modal) {
            fechar();
        }
    });

    formDoacao.addEventListener("submit", function (evento) {
        evento.preventDefault();

        var inputValor = document.querySelector("#valorDoacao");
        var valorNumerico = parseFloat(inputValor ? inputValor.value : "0");

        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            mostrarAviso("Informe um valor de doação válido.");
            return;
        }

        registrarNovaDoacao(ongParaDoacaoAtual || "ONG Parceira", valorNumerico);
        fechar();
        mostrarAviso("Doação de " + formatarReais(valorNumerico) + " registrada!");
    });
}

function carregarDoacoesSalvas() {
    var doacoesSalvas = obterDoacoesUsuarioSalvas();
    var listaDoacoes = document.querySelector("#listaMinhasDoacoes");

    if (listaDoacoes && doacoesSalvas.length > 0) {
        doacoesSalvas.forEach(function (item) {
            var li = criarItemDoacaoLista(item.nomeOng, item.data, item.valor);
            listaDoacoes.prepend(li);
        });
    }

    recalcularResumoDoacoes();
}

function criarItemDoacaoLista(nomeOng, dataTexto, valor) {
    var li = document.createElement("li");
    li.classList.add("lista2Lados");
    li.innerHTML =
        '<div class="perfil"><img class="fotoPerfil" src="src/Doação de alimentos.jpg" alt="Doação realizada"></div>' +
        '<div class="perfilConteudo"><h3>' + nomeOng + '</h3><p>' + dataTexto + '</p><p class="valorItemDoacao">' +
        formatarReais(valor) + '</p></div>' +
        '<div class="botaoPequeno"><p>Concluída</p></div>';
    return li;
}

function recalcularResumoDoacoes() {
    var listaDoacoes = document.querySelector("#listaMinhasDoacoes");
    var totalDoadoEl = document.querySelector("#totalDoadoValor");
    var totalTransacoesEl = document.querySelector("#totalTransacoesValor");

    if (!listaDoacoes) {
        return;
    }

    var itens = Array.from(listaDoacoes.querySelectorAll("li"));
    var soma = 0;

    itens.forEach(function (li) {
        var paragrafos = Array.from(li.querySelectorAll(".perfilConteudo p"));
        paragrafos.forEach(function (p) {
            var texto = p.textContent.trim();
            if (texto.indexOf("R$") === 0) {
                var num = parseFloat(texto.replace("R$", "").replace(/\./g, "").replace(",", ".").trim());
                if (!isNaN(num)) {
                    soma += num;
                }
            }
        });
    });

    if (totalDoadoEl) {
        totalDoadoEl.textContent = formatarReais(soma);
    }
    if (totalTransacoesEl) {
        totalTransacoesEl.textContent = String(itens.length);
    }
}

function registrarNovaDoacao(nomeOng, valor) {
    var listaDoacoes = document.querySelector("#listaMinhasDoacoes");
    var hoje = new Date();
    var dataFormatada =
        String(hoje.getDate()).padStart(2, "0") + "/" +
        String(hoje.getMonth() + 1).padStart(2, "0") + "/" +
        hoje.getFullYear();

    // Salva histórico do usuário
    var doacoesUsuario = obterDoacoesUsuarioSalvas();
    doacoesUsuario.push({ nomeOng: nomeOng, data: dataFormatada, valor: valor });
    localStorage.setItem("doacoesUsuarioJuntos", JSON.stringify(doacoesUsuario));

    // Salva total acumulado por ONG
    var extrasPorOng = obterDoacoesExtrasPorOng();
    extrasPorOng[nomeOng] = (Number(extrasPorOng[nomeOng]) || 0) + valor;
    localStorage.setItem("doacoesPorOngJuntos", JSON.stringify(extrasPorOng));

    if (listaDoacoes) {
        listaDoacoes.prepend(criarItemDoacaoLista(nomeOng, dataFormatada, valor));
    }

    recalcularResumoDoacoes();

    // Atualiza o valor exibido nos cards das ONGs e no mapa
    var labelsOng = Array.from(document.querySelectorAll(".valorDoadoOng[data-ong-nome]"));
    labelsOng.forEach(function (el) {
        if (el.dataset.ongNome === nomeOng) {
            var ongEncontrada = listaOngsCarregadas.find(function (o) {
                return o.nome === nomeOng;
            });
            if (ongEncontrada) {
                el.textContent = "Total doado: " + formatarReais(obterTotalDoadoOng(ongEncontrada));
            }
        }
    });

    renderizarPinosMapa();
}

iniciarAbasMinhaArea();
iniciarBotoesVerTodas();
iniciarEstoqueOng();
carregarDoacoesSalvas();
carregarOngsJson();
iniciarBuscaEFiltros();
iniciarAcoesVoluntario();
iniciarModalDoacao();
