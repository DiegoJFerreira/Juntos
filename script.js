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

        if(seletorTipos.id == 'TiposUsuario'){
            abasClass = abasGeral[0]
        }else{
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
    try{
        var response = await fetch(ongs.json)
        if(!response.ok){
            throw new Error("Erro ao obter os dados: " + response.status)
        }
        var data = await response.json()
        console.log(data)

        dados = data["ong"]
        var section = document.querySelector

        for(var i = 0; i < dados.length; i++){

        }
    }catch{
        
    }
}

abrirMenu();
mudarAbasTiposMinhaArea()
