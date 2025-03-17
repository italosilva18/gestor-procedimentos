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

    let procedimentosData = [];

    async function carregarProcedimentos() {
        try {
            const response = await fetch("/api/procedimentos/");
            procedimentosData = await response.json();
            renderizarTabela(procedimentosData);
        } catch (error) {
            alert("Erro ao carregar procedimentos");
        }
    }

    function renderizarTabela(data) {
        procedimentosTable.innerHTML = "";
        data.forEach(proc => {
            const duracao = calcularDuracao(proc.inicio, proc.final);
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${proc.nome_paciente}</td>
                <td>${proc.registro_paciente}</td>
                <td>${proc.procedimento?.nome || ""}</td>
                <td>${proc.tipo_anestesia?.nome || ""}</td>
                <td>${formatarData(proc.data)}</td>
                <td>${formatarHora(proc.inicio)} - ${formatarHora(proc.final)}</td>
                <td>${duracao}</td>
                <td>${proc.profissional?.nome || ""}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-warning me-2" onclick="editarProcedimento(${proc.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="excluirProcedimento(${proc.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            procedimentosTable.appendChild(tr);
        });
    }

    function calcularDuracao(inicioStr, finalStr) {
        const [hInicio, mInicio] = inicioStr.split(":").map(Number);
        const [hFinal, mFinal] = finalStr.split(":").map(Number);

        let inicio = new Date(0, 0, 0, hInicio, mInicio);
        let final = new Date(0, 0, 0, hFinal, mFinal);

        if (final <= inicio) {
            final.setDate(final.getDate() + 1);
        }

        let diffMs = final - inicio;
        let diffH = Math.floor(diffMs / (1000 * 60 * 60));
        let diffM = Math.floor((diffMs / (1000 * 60)) % 60);

        return `${diffH.toString().padStart(2, '0')}:${diffM.toString().padStart(2, '0')}:00`;
    }

    function formatarData(dataStr) {
        const data = new Date(dataStr);
        return data.toLocaleDateString("pt-BR");
    }

    function formatarHora(horaStr) {
        return horaStr.substring(0, 5);
    }

    window.editarProcedimento = function (id) {
        const procedimento = procedimentosData.find(p => p.id === id);
        if (!procedimento) return;

        procedimentoIdInput.value = id;
        editNomePaciente.value = procedimento.nome_paciente;
        editRegistroPaciente.value = procedimento.registro_paciente;
        editData.value = procedimento.data;
        editProcedimento.value = procedimento.procedimento?.nome || "";
        editTipoAnestesia.value = procedimento.tipo_anestesia?.nome || "";
        editInicio.value = formatarHora(procedimento.inicio);
        editFinal.value = formatarHora(procedimento.final);
        editProfissional.value = procedimento.profissional?.nome || "";

        editModal.show();
    };

    window.excluirProcedimento = async function (id) {
        if (!confirm("Deseja realmente excluir?")) return;
        try {
            const response = await fetch(`/api/procedimentos/${id}/`, {
                method: "DELETE",
                headers: getHeaders()
            });
            if (response.ok) {
                procedimentosData = procedimentosData.filter(p => p.id !== id);
                renderizarTabela(procedimentosData);
                alert("Excluído com sucesso!");
            }
        } catch (err) {
            alert("Erro ao excluir.");
        }
    };

    saveChangesBtn.addEventListener("click", async function () {
        const id = procedimentoIdInput.value;
        const dadosEditados = {
            nome_paciente: editNomePaciente.value,
            registro_paciente: editRegistroPaciente.value,
            data: editData.value,
            procedimento_nome: editProcedimento.value,
            tipo_anestesia_nome: editTipoAnestesia.value,
            inicio: editInicio.value + ":00",
            final: editFinal.value + ":00",
            profissional_nome: editProfissional.value
        };

        try {
            const response = await fetch(`/api/procedimentos/${id}/`, {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(dadosEditados)
            });
            if (response.ok) {
                alert("Procedimento atualizado com sucesso!");
                carregarProcedimentos();
                editModal.hide();
            }
        } catch (err) {
            alert("Erro ao atualizar.");
        }
    });

    filtrarBtn.addEventListener("click", () => {
        const inicio = dataInicio.value;
        const fim = dataFim.value;
        const filtrados = procedimentosData.filter(proc => {
            const dataProc = new Date(proc.data);
            return (!inicio || dataProc >= new Date(inicio)) &&
                   (!fim || dataProc <= new Date(fim));
        });
        renderizarTabela(filtrados);
    });

    exportarPdfBtn.addEventListener("click", () => window.print());

    function getHeaders() {
        return {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        };
    }

    function getCSRFToken() {
        let cookie = document.cookie.split("; ").find(row => row.startsWith("csrftoken="));
        return cookie ? cookie.split("=")[1] : "";
    }

    carregarProcedimentos();
});