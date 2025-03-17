document.addEventListener("DOMContentLoaded", function () {
    const procedimentoInput = document.getElementById("procedimento_nome");
    const sugestoesProcedimento = document.getElementById("sugestoesProcedimento");

    const profissionalInput = document.getElementById("profissional_nome");
    const sugestoesProfissional = document.getElementById("sugestoesProfissional");

    const tipoAnestesiaInput = document.getElementById("tipo_anestesia_nome");
    const sugestoesAnestesia = document.getElementById("sugestoesAnestesia");

    /**
     * ✅ Função para buscar Procedimentos da API (Filtra por Nome e CID)
     */
    async function carregarProcedimentos(query) {
        try {
            const response = await fetch("/api/tipos_procedimentos/");
            if (!response.ok) throw new Error("Erro ao buscar procedimentos");

            const data = await response.json();
            sugestoesProcedimento.innerHTML = "";

            data.forEach(procedimento => {
                const nome = procedimento.nome.toLowerCase();
                const cid = procedimento.cid.toLowerCase();

                if (nome.includes(query.toLowerCase()) || cid.includes(query.toLowerCase())) {
                    let div = criarItemSugestao(`${procedimento.nome} - ${procedimento.cid}`, procedimento.nome, sugestoesProcedimento, procedimentoInput);
                    sugestoesProcedimento.appendChild(div);
                }
            });

        } catch (error) {
            console.error("Erro ao carregar procedimentos:", error);
        }
    }

    /**
     * ✅ Função para buscar Profissionais da API (Filtra por Nome e CRM)
     */
    async function carregarProfissionais(query) {
        try {
            const response = await fetch("/api/profissionais/");
            if (!response.ok) throw new Error("Erro ao buscar profissionais");

            const data = await response.json();
            sugestoesProfissional.innerHTML = "";

            data.forEach(profissional => {
                const nome = profissional.nome.toLowerCase();
                const crm = profissional.crm.toLowerCase();

                if (nome.includes(query.toLowerCase()) || crm.includes(query.toLowerCase())) {
                    let div = criarItemSugestao(`${profissional.nome} - ${profissional.crm}`, profissional.nome, sugestoesProfissional, profissionalInput);
                    sugestoesProfissional.appendChild(div);
                }
            });

        } catch (error) {
            console.error("Erro ao carregar profissionais:", error);
        }
    }

    /**
     * ✅ Função para buscar Tipos de Anestesia da API
     */
    async function carregarAnestesias(query) {
        try {
            const response = await fetch("/api/tipos_anestesia/");
            if (!response.ok) throw new Error("Erro ao buscar anestesias");

            const data = await response.json();
            sugestoesAnestesia.innerHTML = "";

            data.forEach(anestesia => {
                if (anestesia.nome.toLowerCase().includes(query.toLowerCase())) {
                    let div = criarItemSugestao(anestesia.nome, anestesia.nome, sugestoesAnestesia, tipoAnestesiaInput);
                    sugestoesAnestesia.appendChild(div);
                }
            });

        } catch (error) {
            console.error("Erro ao carregar anestesias:", error);
        }
    }

    /**
     * ✅ Função para criar um item de sugestão
     * Exibe Nome - CRM (para profissionais) e Nome - CID (para procedimentos)
     */
    function criarItemSugestao(textoExibido, valorSelecionado, container, inputField) {
        let div = document.createElement("div");
        div.classList.add("list-group-item", "list-group-item-action");
        div.textContent = textoExibido;
        div.onclick = function () {
            inputField.value = valorSelecionado;
            container.innerHTML = "";
        };
        return div;
    }

    /**
     * ✅ Captura digitação e ativa autocomplete
     */
    procedimentoInput.addEventListener("input", function () {
        if (this.value.length > 1) {
            carregarProcedimentos(this.value);
        } else {
            sugestoesProcedimento.innerHTML = "";
        }
    });

    profissionalInput.addEventListener("input", function () {
        if (this.value.length > 1) {
            carregarProfissionais(this.value);
        } else {
            sugestoesProfissional.innerHTML = "";
        }
    });

    tipoAnestesiaInput.addEventListener("input", function () {
        if (this.value.length > 1) {
            carregarAnestesias(this.value);
        } else {
            sugestoesAnestesia.innerHTML = "";
        }
    });

    /**
     * ✅ Fecha a lista de sugestões ao clicar fora
     */
    document.addEventListener("click", function (e) {
        if (!procedimentoInput.contains(e.target)) sugestoesProcedimento.innerHTML = "";
        if (!profissionalInput.contains(e.target)) sugestoesProfissional.innerHTML = "";
        if (!tipoAnestesiaInput.contains(e.target)) sugestoesAnestesia.innerHTML = "";
    });
});
