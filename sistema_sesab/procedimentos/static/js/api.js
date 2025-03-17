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
        body: JSON.stringify(dados)
    });

    if (resposta.ok) {
        // ✅ Exibe alerta de sucesso
        const alerta = document.getElementById("alertaSucesso");
        alerta.classList.remove("d-none");
        alerta.scrollIntoView({ behavior: "smooth" });

        // Limpa os campos do formulário
        e.target.reset();
    } else {
        alert("Erro ao cadastrar procedimento!");
    }
});
