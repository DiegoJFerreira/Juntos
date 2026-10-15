
const botaoModo = document.getElementById("tema");
botaoModo.addEventListener('click', function () {
    if (document.body.classList.contains('claro')) {
        a
        document.body.classList.remove('claro');
        document.body.classList.add('escuro');
    } else {
        document.body.classList.remove('escuro');
        document.body.classList.add('claro');
    }
})

