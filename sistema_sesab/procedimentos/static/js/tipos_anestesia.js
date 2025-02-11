document.addEventListener("DOMContentLoaded", function () {
    const tabela = document.getElementById("anestesiaTable");
    const nomeInput = document.getElementById("nomeAnestesia");
    const salvarBtn = document.getElementById("salvarAnestesia");

    async function carregarTipos() {
        const resposta = await fetch("/api/tipos_anestesia/");
        const dados = await resposta.json();

        tabela.innerHTML = "";
        dados.forEach(item => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${item.nome}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="excluirTipo(${item.id})">Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });
    }

    salvarBtn.addEventListener("click", async function () {
        const nome = nomeInput.value;
        if (!nome) return alert("Preencha o nome!");

        await fetch("/api/tipos_anestesia/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome })
        });

        nomeInput.value = "";
        carregarTipos();
    });

    window.excluirTipo = async function (id) {
        if (!confirm("Deseja excluir este tipo?")) return;

        await fetch(`/api/tipos_anestesia/${id}/`, { method: "DELETE" });
        carregarTipos();
    };

    carregarTipos();
});
