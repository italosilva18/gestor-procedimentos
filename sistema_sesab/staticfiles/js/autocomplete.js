document.addEventListener("DOMContentLoaded", function () {
    /**
     * Função genérica para criar um campo de autocomplete.
     * @param {string} inputId - ID do input de texto.
     * @param {string} apiEndpoint - Endpoint da API para buscar os dados.
     */
    function setupAutocomplete(inputId, apiEndpoint) {
        const inputField = document.getElementById(inputId);
        const suggestionsContainer = document.createElement("div");
        suggestionsContainer.classList.add("autocomplete-suggestions");
        inputField.parentNode.appendChild(suggestionsContainer);

        inputField.addEventListener("input", async function () {
            const query = this.value.trim();

            if (query.length < 2) {
                suggestionsContainer.innerHTML = "";
                return;
            }

            try {
                const response = await fetch(`${apiEndpoint}?search=${query}`);
                if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

                const data = await response.json();
                suggestionsContainer.innerHTML = "";

                data.forEach(item => {
                    const suggestionItem = document.createElement("div");
                    suggestionItem.classList.add("autocomplete-item");
                    suggestionItem.textContent = item.nome; // Nome do item vindo da API
                    suggestionItem.onclick = function () {
                        inputField.value = item.nome;
                        suggestionsContainer.innerHTML = "";
                    };
                    suggestionsContainer.appendChild(suggestionItem);
                });

            } catch (error) {
                console.error("Erro ao buscar dados para autocomplete:", error);
            }
        });

        // Esconde sugestões ao clicar fora do campo
        document.addEventListener("click", function (e) {
            if (!inputField.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                suggestionsContainer.innerHTML = "";
            }
        });
    }

    // Ativar o autocomplete nos campos necessários
    setupAutocomplete("profissional_nome", "/api/profissionais/");
    setupAutocomplete("tipo_anestesia_nome", "/api/tipos_anestesia/");
    setupAutocomplete("procedimento_nome", "/api/tipos_procedimento/");
});
