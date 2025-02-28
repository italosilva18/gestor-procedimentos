document.addEventListener("DOMContentLoaded", function () {
    const procedimentosTable = document.getElementById("procedimentosTable");
    const editModal = new bootstrap.Modal(document.getElementById("editModal"));
    const procedimentoIdInput = document.getElementById("procedimentoId");
    const editNomePaciente = document.getElementById("editNomePaciente");
    const editRegistroPaciente = document.getElementById("editRegistroPaciente");
    const editData = document.getElementById("editData");
    const editProcedimento = document.getElementById("editProcedimento");
    const editTipoAnestesia = document.getElementById("editTipoAnestesia");
    const editInicio = document.getElementById("editInicio");
    const editFinal = document.getElementById("editFinal");
    const editProfissional = document.getElementById("editProfissional");
    const saveChangesBtn = document.getElementById("saveChangesBtn");
    const filtrarBtn = document.getElementById("filtrarBtn");
    const dataInicio = document.getElementById("dataInicio");
    const dataFim = document.getElementById("dataFim");
    const exportarPdfBtn = document.getElementById("exportarPdfBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    // ✅ Obter o nome de usuário da página
    const userLogged = document.getElementById("userLogged");
    const username = userLogged.querySelector("b").textContent;

    // 🔹 Logout
    logoutBtn.addEventListener("click", function () {
        // Chama a view de logout para encerrar a sessão
        fetch('/logout/')
            .then(() => {
                // Redireciona para a página inicial após o logout
                window.location.href = '/';
            })
            .catch(error => {
                console.error('Erro ao fazer logout:', error);
                // Redireciona para a página inicial mesmo se houver um erro no logout
                window.location.href = '/';
            });
    });

    // ✅ Filtrar procedimentos por data
    filtrarBtn.addEventListener("click", function () {
        const filtroDataInicio = dataInicio.value;  // Extract the value from the input field
        const filtroDataFim = dataFim.value;    // Extract the value from the input field
        carregarProcedimentos(filtroDataInicio, filtroDataFim);
    });

    // ✅ Carregar procedimentos
    async function carregarProcedimentos(filtroDataInicio = "", filtroDataFim = "") {
        try {
            let url = "/api/procedimentos/";
            // Append the date filters if they exist
            if (filtroDataInicio && filtroDataFim) {
                url += `?data_inicio=${filtroDataInicio}&data_fim=${filtroDataFim}`;
            }
            const response = await fetch(url);
            const data = await response.json();

            procedimentosTable.innerHTML = "";
            data.forEach(proc => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${proc.nome_paciente}</td>
                    <td>${proc.registro_paciente}</td>
                    <td>${proc.procedimento?.nome || ""}</td>
                    <td>${proc.tipo_anestesia?.nome || ""}</td>
                    <td>${formatarData(proc.data)}</td>
                    <td>${formatarHora(proc.inicio)}</td>
                    <td>${formatarHora(proc.final)}</td>
                    <td>${proc.profissional?.nome || ""}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editarProcedimento(${proc.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="excluirProcedimento(${proc.id})">Excluir</button>
                    </td>
                `;
                procedimentosTable.appendChild(tr);
            });

        } catch (error) {
            console.error("Erro ao carregar procedimentos:", error);
            alert("Não foi possível carregar os procedimentos.");
        }
    }

    // ✅ Excluir procedimento
    window.excluirProcedimento = async function (id) {
        if (!confirm("Tem certeza que deseja excluir este procedimento?")) return;
        try {
            const response = await fetch(`/api/procedimentos/${id}/`, {
                method: "DELETE",
                headers: {
                    "X-CSRFToken": getCSRFToken() // Incluir o token CSRF
                }
            });
            if (response.ok) {
                alert("Procedimento excluído com sucesso!");
                carregarProcedimentos();
            } else {
                alert("Erro ao excluir procedimento.");
            }
        } catch (error) {
            console.error("Erro ao excluir procedimento:", error);
            alert("Não foi possível excluir o procedimento.");
        }
    };

    // ✅ Editar procedimento
    window.editarProcedimento = function (id) {
        procedimentoIdInput.value = id;
        const row = [...procedimentosTable.querySelectorAll("tr")].find(tr =>
            tr.querySelector("button").getAttribute("onclick")?.includes(`(${id})`)
        );
        if (!row) return;

        const cells = row.querySelectorAll("td");
        editNomePaciente.value = cells[0].textContent.trim();
        editRegistroPaciente.value = cells[1].textContent.trim();
        editProcedimento.value = cells[2].textContent.trim();
        editTipoAnestesia.value = cells[3].textContent.trim();
        editData.value = converterDataParaYYYYMMDD(cells[4].textContent.trim());
        editInicio.value = cells[5].textContent.trim();
        editFinal.value = cells[6].textContent.trim();
        editProfissional.value = cells[7].textContent.trim();

        editModal.show();
    };

    // ✅ Salvar alterações no procedimento editado
    saveChangesBtn.addEventListener("click", async function () {
        const id = procedimentoIdInput.value;
        const dadosEditados = {
            nome_paciente: editNomePaciente.value,
            registro_paciente: editRegistroPaciente.value,
            data: editData.value,
            procedimento_nome: editProcedimento.value,
            tipo_anestesia_nome: editTipoAnestesia.value,
            inicio: editInicio.value,
            final: editFinal.value,
            profissional_nome: editProfissional.value
        };

        try {
            const response = await fetch(`/api/procedimentos/${id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken() // Incluir o token CSRF
                },
                body: JSON.stringify(dadosEditados)
            });
            if (response.ok) {
                alert("Procedimento atualizado com sucesso!");
                editModal.hide();
                carregarProcedimentos();
            } else {
                alert("Erro ao atualizar procedimento.");
            }
        } catch (error) {
            console.error("Erro ao salvar mudanças:", error);
            alert("Não foi possível atualizar o procedimento.");
        }
    });

    // ✅ Converter data para YYYY-MM-DD
    function converterDataParaYYYYMMDD(dataBR) {
        const [dia, mes, ano] = dataBR.split("/");
        if (!dia || !mes || !ano) return "";
        return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
    }

    // ✅ Formatar data e hora
    function formatarData(dataStr) {
        if (!dataStr) return "";
        const data = new Date(dataStr);
        return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    }

    function formatarHora(horaStr) {
        if (!horaStr) return "";
        const [hora, minuto] = horaStr.split(":");
        return `${hora}:${minuto}`;
    }

    // ✅ Exportar para PDF
    exportarPdfBtn.addEventListener("click", function () {
        window.print();
    });

    // ✅ Carregar lista ao abrir a página
    carregarProcedimentos();
});

// ✅ Função para obter o token CSRF
function getCSRFToken() {
    let cookie = document.cookie.split("; ").find(row => row.startsWith("csrftoken="));
    return cookie ? cookie.split("=")[1] : "";
}


