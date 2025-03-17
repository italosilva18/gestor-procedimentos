document.addEventListener("DOMContentLoaded", function () {
    const tabela = document.getElementById("procedimentosTable");
    const nomeInput = document.getElementById("nomeProcedimento");
    const cidInput = document.getElementById("cidProcedimento");
    const form = document.getElementById("formProcedimento");

    let editandoId = null;

    // ✅ Função para carregar os tipos de procedimentos
    async function carregarTipos() {
        try {
            const resposta = await fetch("/api/tipos_procedimentos/");
            const dados = await resposta.json();

            tabela.innerHTML = "";
            dados.forEach(item => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${item.nome}</td>
                    <td>${item.cid}</td>
                    <td class="text-end pe-4">
                        <button class="btn btn-warning btn-sm me-2" onclick="editarTipo(${item.id}, '${item.nome}', '${item.cid}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="excluirTipo(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tabela.appendChild(linha);
            });
        } catch (error) {
            console.error("Erro ao carregar os tipos de procedimento:", error);
            alert("Não foi possível carregar os tipos de procedimentos.");
        }
    }

    // ✅ Função para adicionar ou editar um tipo de procedimento
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const nome = nomeInput.value.trim();
        const cid = cidInput.value.trim();

        if (!nome || !cid) return alert("Por favor, preencha todos os campos!");

        try {
            const url = editandoId ? `/api/tipos_procedimentos/${editandoId}/` : "/api/tipos_procedimentos/";
            const method = editandoId ? "PUT" : "POST";

            const resposta = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken()
                },
                body: JSON.stringify({ nome, cid })
            });

            if (resposta.ok) {
                alert(editandoId ? "Tipo de procedimento atualizado com sucesso!" : "Tipo de procedimento adicionado com sucesso!");
                nomeInput.value = "";
                cidInput.value = "";
                editandoId = null;
                carregarTipos();
            } else {
                alert("Erro ao salvar o tipo de procedimento.");
            }
        } catch (error) {
            console.error("Erro ao salvar tipo de procedimento:", error);
        }
    });

    // ✅ Função para iniciar edição
    window.editarTipo = function (id, nome, cid) {
        editandoId = id;
        nomeInput.value = nome;
        cidInput.value = cid;
        nomeInput.focus();
    };

    // ✅ Função para excluir um tipo de procedimento
    window.excluirTipo = async function (id) {
        if (!confirm("Tem certeza que deseja excluir este tipo de procedimento?")) return;

        try {
            const resposta = await fetch(`/api/tipos_procedimentos/${id}/`, {
                method: "DELETE",
                headers: {
                    "X-CSRFToken": getCSRFToken()
                }
            });

            if (resposta.ok) {
                alert("Tipo de procedimento excluído com sucesso!");
                carregarTipos();
            } else {
                alert("Erro ao excluir o tipo de procedimento.");
            }
        } catch (error) {
            console.error("Erro ao excluir tipo de procedimento:", error);
        }
    };

    // ✅ Função para pegar o token CSRF
    function getCSRFToken() {
        let cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
        return cookie ? cookie.split('=')[1] : '';
    }

    // 🔥 Carregar os tipos de procedimento ao carregar a página
    carregarTipos();
});