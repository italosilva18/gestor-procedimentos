document.addEventListener("DOMContentLoaded", function () {
    const formProcedimento = document.getElementById("formProcedimento");

    formProcedimento.addEventListener("submit", function (event) {
        event.preventDefault();

        const dados = {
            nome_paciente: document.getElementById("nome_paciente").value,
            registro_paciente: document.getElementById("registro_paciente").value,
            data: document.getElementById("data").value,
            procedimento: document.getElementById("procedimento_nome").value,
            tipo_anestesia: document.getElementById("tipo_anestesia_nome").value,
            inicio: document.getElementById("inicio").value,
            final: document.getElementById("final").value,
            profissional: document.getElementById("profissional_nome").value
        };

        enviarFormulario(dados);
    });
});
