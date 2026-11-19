

function iniciarSelecaoPerfil() {
    var botoesPerfil = Array.from(document.querySelectorAll("body#login .listaScroll > button"));
    var campoPerfil = document.querySelector("#perfil");
    var labelNome = document.querySelector("#labelNome");

    if (botoesPerfil.length === 0) {
        return;
    }

    var perfilSalvo = localStorage.getItem("perfilUsuarioJuntos");
    if (perfilSalvo) {
        botoesPerfil.forEach(function (botao) {
            if (botao.dataset.perfil === perfilSalvo) {
                selecionarBotaoPerfil(botao, botoesPerfil, campoPerfil, labelNome);
            }
        });
    }

    botoesPerfil.forEach(function (botao) {
        botao.addEventListener("click", function () {
            selecionarBotaoPerfil(botao, botoesPerfil, campoPerfil, labelNome);
        });
    });
}

function selecionarBotaoPerfil(botaoAtivo, todosBotoes, campoPerfil, labelNome) {
    todosBotoes.forEach(function (b) {
        b.classList.remove("selecionado");
    });
    botaoAtivo.classList.add("selecionado");

    var perfil = botaoAtivo.dataset.perfil || "voluntario";
    localStorage.setItem("perfilUsuarioJuntos", perfil);

    if (campoPerfil) {
        campoPerfil.value = perfil;
    }

    if (labelNome && botaoAtivo.dataset.nome) {
        labelNome.textContent = botaoAtivo.dataset.nome;
    }
}

function iniciarFormularioLogin() {
    var formLogin = document.querySelector("#formLogin");
    var erroLogin = document.querySelector("#erroLogin");

    if (!formLogin) {
        return;
    }

    formLogin.addEventListener("submit", function (evento) {
        evento.preventDefault();

        var email = document.querySelector("#email").value.trim();
        var senha = document.querySelector("#senha").value.trim();
        var perfilSelecionado = document.querySelector("body#login .listaScroll > button.selecionado");

        if (!perfilSelecionado) {
            exibirErroFormulario(erroLogin, "Escolha um perfil (Doador, Voluntário ou ONG) antes de entrar.");
            return;
        }

        if (email === "" || email.indexOf("@") === -1) {
            exibirErroFormulario(erroLogin, "Digite um e-mail válido.");
            return;
        }

        if (senha.length < 4) {
            exibirErroFormulario(erroLogin, "A senha deve ter pelo menos 4 caracteres.");
            return;
        }

        localStorage.setItem("emailUsuarioJuntos", email);
        window.location.href = "minhaArea.html";
    });
}

function iniciarFormularioCadastro() {
    var formCadastro = document.querySelector("#formCadastro");
    var erroCadastro = document.querySelector("#erroCadastro");

    if (!formCadastro) {
        return;
    }

    formCadastro.addEventListener("submit", function (evento) {
        evento.preventDefault();

        var nome = document.querySelector("#nome").value.trim();
        var email = document.querySelector("#email").value.trim();
        var senha = document.querySelector("#senha").value.trim();
        var confirmarSenha = document.querySelector("#confirmarSenha").value.trim();
        var perfilSelecionado = document.querySelector("body#login .listaScroll > button.selecionado");

        if (!perfilSelecionado) {
            exibirErroFormulario(erroCadastro, "Selecione o tipo de perfil para continuar.");
            return;
        }

        if (nome.length < 3) {
            exibirErroFormulario(erroCadastro, "Digite seu nome completo ou nome da organização.");
            return;
        }

        if (email === "" || email.indexOf("@") === -1) {
            exibirErroFormulario(erroCadastro, "Digite um e-mail válido.");
            return;
        }

        if (senha.length < 4) {
            exibirErroFormulario(erroCadastro, "A senha deve ter pelo menos 4 caracteres.");
            return;
        }

        if (senha !== confirmarSenha) {
            exibirErroFormulario(erroCadastro, "As senhas não conferem.");
            return;
        }

        localStorage.setItem("nomeUsuarioJuntos", nome);
        localStorage.setItem("emailUsuarioJuntos", email);
        window.location.href = "minhaArea.html";
    });
}

function exibirErroFormulario(elementoErro, mensagem) {
    if (!elementoErro) {
        return;
    }
    elementoErro.textContent = mensagem;
    elementoErro.classList.remove("oculto");
}

iniciarSelecaoPerfil();
iniciarFormularioLogin();
iniciarFormularioCadastro();
