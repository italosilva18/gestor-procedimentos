document.addEventListener("DOMContentLoaded", function () {
    const tabela = document.getElementById("profissionaisTable");
    const nomeInput = document.getElementById("nomeProfissional");
    const crmInput = document.getElementById("crmProfissional");
    const salvarBtn = document.getElementById("salvarProfissional");

    async function carregarProfissionais() {
        const resposta = await fetch("/api/profissionais/");
        const dados = await resposta.json();

        tabela.innerHTML = "";
        dados.forEach(item => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.crm}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="excluirProfissional(${item.id})">Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });
    }

    salvarBtn.addEventListener("click", async function () {
        const nome = nomeInput.value;
        const crm = crmInput.value;
        if (!nome || !crm) return alert("Preencha todos os campos!");

        await fetch("/api/profissionais/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, crm })
        });

        nomeInput.value = "";
        crmInput.value = "";
        carregarProfissionais();
    });

    window.excluirProfissional = async function (id) {
        if (!confirm("Deseja excluir este profissional?")) return;

        await fetch(`/api/profissionais/${id}/`, { method: "DELETE" });
        carregarProfissionais();
    };

    carregarProfissionais();
});
