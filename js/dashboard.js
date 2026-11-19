
async function iniciarDashboard() {
    var seletorPeriodo = document.querySelector("#dashboard .seletorCaixa");
    if (!seletorPeriodo) {
        return;
    }

    try {
        var resposta = await fetch("./data/dashboard.json");
        if (!resposta.ok) {
            throw new Error("Erro ao carregar dados do dashboard.");
        }

        var dados = await resposta.json();
        seletorPeriodo.value = "Junho";
        atualizarResumoDashboard(dados.periodos["Junho"]);

        seletorPeriodo.addEventListener("change", function () {
            var mesSelecionado = seletorPeriodo.value;
            var resumoMes = dados.periodos[mesSelecionado];
            if (resumoMes) {
                atualizarResumoDashboard(resumoMes);
            }
        });
    } catch (erro) {
        console.error(erro);
    }
}

function atualizarResumoDashboard(resumo) {
    if (!resumo) {
        return;
    }

    var kpiDoacoes = document.querySelector("#kpiDoacoes");
    var kpiEventos = document.querySelector("#kpiEventos");
    var kpiVoluntarios = document.querySelector("#kpiVoluntarios");
    var kpiBeneficiadas = document.querySelector("#kpiBeneficiadas");

    if (kpiDoacoes) {
        kpiDoacoes.textContent = resumo.doacoes;
    }
    if (kpiEventos) {
        kpiEventos.textContent = resumo.eventos;
    }
    if (kpiVoluntarios) {
        kpiVoluntarios.textContent = resumo.voluntarios;
    }
    if (kpiBeneficiadas) {
        kpiBeneficiadas.textContent = resumo.beneficiadas;
    }
}

iniciarDashboard();
