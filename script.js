function abrirMenu() {
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
}
function mudarAbasTiposMinhaArea() {
    var seletoresTipos = Array.from(document.getElementsByClassName('seletorArrasta'))
    var tipo = ''
    seletoresTipos.forEach(seletorTipos => {


        var botoes = Array.from(seletorTipos.children)

        botoes.forEach(botao => {
            botao.addEventListener("click", function () {
                botoes.forEach(botaoRemover => {
                    botaoRemover.classList.remove('ativo')
                })
                botao.classList.add('ativo')
                filtroTiposMinhaArea(botao, seletorTipos)
            })
        })
    })
}
function filtroTiposMinhaArea(botaoAtivo, seletorTipos) {
    var filtroConteudo = botaoAtivo.textContent.trim().toLocaleLowerCase()
    console.log(filtroConteudo)
    var abasGeral = Array.from(document.getElementsByClassName('Tipos'))

    if (seletorTipos.id == 'TiposUsuario') {
        abasClass = abasGeral[0]
    } else {
        abasClass = abasGeral[1]
    }
    var abas = Array.from(abasClass.children)

    abas.forEach(aba => {
        var classeAba = aba.classList.value.trim().toLocaleLowerCase()

        if (classeAba.includes(filtroConteudo)) {
            aba.style.display = 'block'
        } else {
            aba.style.display = 'none'
        }
    })
}
async function adicionarOngJson() {
    try {
        var response = await fetch('./data/ongs.json')
        if (!response.ok) {
            throw new Error("Erro ao obter os dados: " + response.status)
        }
        var data = await response.json()
        console.log(data)

        dados = data["ong"]

        for (var i = 0; i < dados.length; i++) {
            var ul = document.querySelector("#OngsPerfil > ." + dados[i].tipo + "> ul")
            console.log(ul)
            console.log("#OngsPerfil > ." + dados[i].tipo + "> ul")

            if (!ul) {
                console.error("Lista não encontrada para o tipo:", dados[i].tipo)
                continue
            }

            var li = document.createElement("li")
            li.classList.add("lista2Lados")

            var divPerfil = document.createElement("div")
            var divConteudo = document.createElement("div")
            var divBotao = document.createElement("div")

            divPerfil.classList.add("perfil")
            divConteudo.classList.add("perfilConteudo")
            divBotao.classList.add("botaoPequeno")

            var botao = document.createElement("button")
            botao.textContent = "Doar"
            divBotao.appendChild(botao)

            var img = document.createElement("img")
            img.src = dados[i].imagem
            img.alt = dados[i].altFoto
            divPerfil.appendChild(img)

            var h3 = document.createElement("h3")
            h3.textContent = dados[i].nome

            var divDataHora = document.createElement("div")
            divDataHora.classList.add("dataHora")
            var pCidade = document.createElement("p")
            pCidade.textContent = dados[i].cidade + " - " + dados[i].estado
            var pSeparador = document.createElement("p")
            pSeparador.textContent = "•"
            pSeparador.classList.add("separador")
            var pDistancia = document.createElement("p")
            pDistancia.textContent = dados[i].distancia
            divDataHora.appendChild(pCidade)
            divDataHora.appendChild(pSeparador)
            divDataHora.appendChild(pDistancia)

            var pCategoria = document.createElement("p")
            pCategoria.textContent = dados[i].categoria

            var pDescricao = document.createElement("p")
            pDescricao.textContent = dados[i].descricao

            divConteudo.appendChild(h3)
            divConteudo.appendChild(divDataHora)
            divConteudo.appendChild(pCategoria)
            divConteudo.appendChild(pDescricao)

            li.appendChild(divPerfil)
            li.appendChild(divConteudo)
            li.appendChild(divBotao)

            ul.appendChild(li)

        }
    } catch (err) {
        alert("Ocorreu um erro! " + err);
        console.error(err);
    }
}

abrirMenu();
mudarAbasTiposMinhaArea();
adicionarOngJson();
