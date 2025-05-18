// Função para capturar o token CSRF do cookie
function getCSRFToken() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('csrftoken=')) {
            return cookie.substring('csrftoken='.length, cookie.length);
        }
    }
    return '';
}

document.getElementById("formProcedimento").addEventListener("submit", async function (e) {
    e.preventDefault();

    const dados = {
        nome_paciente: document.getElementById("nome_paciente").value,
        registro_paciente: document.getElementById("registro_paciente").value,
        data: document.getElementById("data").value,
        procedimento_nome: document.getElementById("procedimento_nome").value,
        tipo_anestesia_nome: document.getElementById("tipo_anestesia_nome").value,
        inicio: document.getElementById("inicio").value,
        final: document.getElementById("final").value,
        profissional_nome: document.getElementById("profissional_nome").value
    };

    const resposta = await fetch("/api/procedimentos/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        },
        // Se precisar enviar cookies de sessão (caso a view exija autenticação),
        // descomente a linha abaixo:
        // credentials: "include",
        body: JSON.stringify(dados)
    });

    if (resposta.ok) {
        const alerta = document.getElementById("alertaSucesso");
        alerta.classList.remove("d-none");
        alerta.scrollIntoView({ behavior: "smooth" });
        e.target.reset();
    } else {
        alert("Erro ao cadastrar procedimento!");
    }
});
