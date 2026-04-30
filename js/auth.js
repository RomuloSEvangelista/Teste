/**
 * 1. LÓGICA DE LOGIN (VALIDA ADM E CLIENTES)
 */
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const emailDigitado = document.getElementById('email').value.trim().toLowerCase();
    const senhaDigitada = document.getElementById('password').value.trim();

    // Credenciais do Administrador
    const admUser = "admin@admin.com";
    const admPass = "serratec2026";

    // Busca clientes no LocalStorage
    const usuariosCadastrados = JSON.parse(localStorage.getItem('usuarios')) || [];
    const clienteValido = usuariosCadastrados.find(user => user.email === emailDigitado && user.password === senhaDigitada);

    if (emailDigitado === admUser && senhaDigitada === admPass) {
        // Fluxo ADM
        localStorage.setItem('usuarioLogado', 'true');
        localStorage.setItem('perfil', 'admin'); // Define o nível de acesso
        alert("Bem-vindo, Administrador!");
        window.location.href = "index.html"; 
    } 
    else if (clienteValido) {
        // Fluxo Cliente Cadastrado
        localStorage.setItem('usuarioLogado', 'true');
        localStorage.setItem('perfil', 'cliente'); // Define o nível de acesso
        alert("Login realizado com sucesso!");
        window.location.href = "index.html";
    } 
    else {
        alert("Erro: E-mail ou senha inválidos.");
    }
});

/**
 * 2. LÓGICA DE CADASTRO (UNIFICADA)
 */
const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('regEmail').value.trim().toLowerCase();
        const password = document.getElementById('regPassword').value.trim();

        // 1. Recupera usuários existentes
        const usuariosCadastrados = JSON.parse(localStorage.getItem('usuarios')) || [];

        // 2. Validações
        const emailJaExiste = usuariosCadastrados.some(user => user.email === email);
        const ehAdmin = (email === "admin@admin.com");

        if (emailJaExiste || ehAdmin) {
            alert("Este e-mail já está em uso ou é reservado ao sistema!");
            return;
        }

        // 3. Salva o novo cliente
        usuariosCadastrados.push({ email: email, password: password });
        localStorage.setItem('usuarios', JSON.stringify(usuariosCadastrados));

        alert("Conta criada com sucesso! Você já pode entrar.");
        registerForm.reset();
    });
}