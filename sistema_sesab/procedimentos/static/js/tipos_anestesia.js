document.addEventListener("DOMContentLoaded", function () {
    const tabela = document.getElementById("anestesiaTable");
    const nomeInput = document.getElementById("nomeAnestesia");
    const form = document.getElementById("formAnestesia");
    const salvarBtn = document.getElementById("salvarAnestesia");

    let editandoId = null;

    async function carregarAnestesias() {
        try {
            const resposta = await fetch("/api/tipos_anestesia/");
            const dados = await resposta.json();

            tabela.innerHTML = "";
            dados.forEach(item => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${item.nome}</td>
                    <td class="text-end pe-4">
                        <button class="btn btn-warning btn-sm me-2" onclick="editarAnestesia(${item.id}, '${item.nome}')">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="excluirAnestesia(${item.id})">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </td>
                `;
                tabela.appendChild(linha);
            });
        } catch (error) {
            console.error("Erro ao carregar anestesias:", error);
            alert("Não foi possível carregar os tipos de anestesia.");
        }
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const nome = nomeInput.value.trim();

        if (!nome) return alert("Por favor, preencha o nome!");

        try {
            const url = editandoId ? `/api/tipos_anestesia/${editandoId}/` : "/api/tipos_anestesia/";
            const method = editandoId ? "PUT" : "POST";

            const resposta = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken()
                },
                body: JSON.stringify({ nome })
            });

            if (resposta.ok) {
                alert(editandoId ? "Anestesia atualizada com sucesso!" : "Anestesia cadastrada com sucesso!");
                nomeInput.value = "";
                editandoId = null;
                salvarBtn.innerHTML = '<i class="fa fa-plus"></i> Cadastrar Anestesia';
                carregarAnestesias();
            } else {
                alert("Erro ao salvar anestesia.");
            }
        } catch (error) {
            console.error("Erro ao salvar anestesia:", error);
        }
    });

    window.editarAnestesia = function (id, nome) {
        editandoId = id;
        nomeInput.value = nome;
        nomeInput.focus();
        salvarBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';
    };

    window.excluirAnestesia = async function (id) {
        if (!confirm("Tem certeza que deseja excluir este tipo de anestesia?")) return;

        try {
            const resposta = await fetch(`/api/tipos_anestesia/${id}/`, {
                method: "DELETE",
                headers: {
                    "X-CSRFToken": getCSRFToken()
                }
            });

            if (resposta.ok) {
                alert("Tipo de anestesia excluído com sucesso!");
                carregarAnestesias();
            } else {
                alert("Erro ao excluir tipo de anestesia.");
            }
        } catch (error) {
            console.error("Erro ao excluir tipo de anestesia:", error);
        }
    };

    function getCSRFToken() {
        let cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
        return cookie ? cookie.split('=')[1] : '';
    }

    carregarAnestesias();
});
