document.addEventListener("DOMContentLoaded", function () {
    const tabela = document.getElementById("profissionaisTable");
    const nomeInput = document.getElementById("nomeProfissional");
    const crmInput = document.getElementById("crmProfissional");
    const salvarBtn = document.getElementById("salvarProfissional");

    const editModal = new bootstrap.Modal(document.getElementById("editModal"));
    const editNomeInput = document.getElementById("editNomeProfissional");
    const editCrmInput = document.getElementById("editCrmProfissional");
    const editIdInput = document.getElementById("editProfissionalId");
    const atualizarBtn = document.getElementById("atualizarProfissional");

    // Carregar profissionais
    async function carregarProfissionais() {
        const resposta = await fetch("/api/profissionais/");
        const dados = await resposta.json();

        tabela.innerHTML = "";
        dados.forEach(item => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.crm}</td>
                <td class="text-end">
                    <button class="btn btn-warning btn-sm me-2" onclick="editarProfissional(${item.id}, '${item.nome}', '${item.crm}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="excluirProfissional(${item.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </td>
            `;
            tabela.appendChild(linha);
        });
    }

    // Adicionar profissional
    salvarBtn.addEventListener("click", async function () {
        const nome = nomeInput.value.trim();
        const crm = crmInput.value.trim();
        if (!nome || !crm) return alert("Preencha todos os campos!");

        await fetch("/api/profissionais/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, crm })
        });

        nomeInput.value = "";
        crmInput.value = "";
        bootstrap.Modal.getInstance(document.getElementById("addModal")).hide();
        carregarProfissionais();
    });

    // Editar profissional
    window.editarProfissional = function (id, nome, crm) {
        editIdInput.value = id;
        editNomeInput.value = nome;
        editCrmInput.value = crm;
        editModal.show();
    };

    atualizarBtn.addEventListener("click", async function () {
        const id = editIdInput.value;
        const nome = editNomeInput.value.trim();
        const crm = editCrmInput.value.trim();

        await fetch(`/api/profissionais/${id}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, crm })
        });

        editModal.hide();
        carregarProfissionais();
    });

    // Excluir profissional
    window.excluirProfissional = async function (id) {
        if (!confirm("Deseja excluir este profissional?")) return;
        await fetch(`/api/profissionais/${id}/`, { method: "DELETE" });
        carregarProfissionais();
    };

    carregarProfissionais();
});
