document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const csrftoken = getCSRFToken();  // Pegando o CSRF Token dos cookies

    const response = await fetch("/api/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken  // ✅ Adicionando CSRF Token no cabeçalho
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        alert("Login realizado com sucesso!");
        window.location.href = "/crud/";  // ✅ Redireciona para CRUD após login
    } else {
        alert("Erro no login! Verifique suas credenciais.");
    }
});

// Função para obter o CSRF Token do cookie
function getCSRFToken() {
    let cookie = document.cookie.split("; ").find(row => row.startsWith("csrftoken="));
    return cookie ? cookie.split("=")[1] : "";
}
