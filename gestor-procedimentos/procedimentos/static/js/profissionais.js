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

    // Função para obter o token CSRF dos cookies
    function getCSRFToken() {
        let cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
        return cookie ? cookie.split('=')[1] : '';
    }

    // Carregar profissionais
    async function carregarProfissionais() {
        try {
            const resposta = await fetch("/api/profissionais/");
            if (!resposta.ok) {
                throw new Error(`Erro ao carregar profissionais: ${resposta.status}`);
            }
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
        } catch (error) {
            console.error(error);
            alert("Não foi possível carregar os profissionais.");
        }
    }

    // Adicionar profissional
    salvarBtn.addEventListener("click", async function () {
        const nome = nomeInput.value.trim();
        const crm = crmInput.value.trim();
        if (!nome || !crm) return alert("Preencha todos os campos!");

        try {
            const resposta = await fetch("/api/profissionais/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken(), // Inclui o token CSRF no cabeçalho
                },
                body: JSON.stringify({ nome, crm })
            });

            if (!resposta.ok) {
                throw new Error(`Erro ao adicionar profissional: ${resposta.status}`);
            }

            nomeInput.value = "";
            crmInput.value = "";
            bootstrap.Modal.getInstance(document.getElementById("addModal")).hide();
            carregarProfissionais();
        } catch (error) {
            console.error(error);
            alert("Erro ao adicionar profissional.");
        }
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

        try {
            const resposta = await fetch(`/api/profissionais/${id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken(), // Inclui o token CSRF no cabeçalho
                },
                body: JSON.stringify({ nome, crm })
            });

            if (!resposta.ok) {
                throw new Error(`Erro ao atualizar profissional: ${resposta.status}`);
            }

            editModal.hide();
            carregarProfissionais();
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar profissional.");
        }
    });

    // Excluir profissional
    window.excluirProfissional = async function (id) {
        if (!confirm("Deseja excluir este profissional?")) return;

        try {
            const resposta = await fetch(`/api/profissionais/${id}/`, {
                method: "DELETE",
                headers: {
                    "X-CSRFToken": getCSRFToken(), // Inclui o token CSRF no cabeçalho
                }
            });

            if (!resposta.ok) {
                throw new Error(`Erro ao excluir profissional: ${resposta.status}`);
            }

            carregarProfissionais();
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir profissional.");
        }
    };

    carregarProfissionais();
});