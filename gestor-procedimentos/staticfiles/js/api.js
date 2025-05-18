document.addEventListener("DOMContentLoaded", function () {
    const formProcedimento = document.getElementById("formProcedimento");

    formProcedimento.addEventListener("submit", async function (event) {
        event.preventDefault();

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

        try {
            const response = await fetch("/api/procedimentos/", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken() // Se necessário
                },
                body: JSON.stringify(dados)
            });

            if (!response.ok) throw new Error("Erro ao cadastrar procedimento");

            alert("Procedimento cadastrado com sucesso!");
            formProcedimento.reset();
        } catch (error) {
            console.error("Erro ao cadastrar procedimento:", error);
            alert("Erro ao cadastrar procedimento. Verifique os dados e tente novamente.");
        }
    });

    function getCSRFToken() {
        let cookie = document.cookie.split("; ").find(row => row.startsWith("csrftoken="));
        return cookie ? cookie.split("=")[1] : "";
    }
});
