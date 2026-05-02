const API_URL = "https://69f60881a72f01a951b91cd8.mockapi.io/cards";

// ==========================================
// --- LÓGICA DE REGISTRO ---
// ==========================================
const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 1. Captura de dados
        const nome = document.getElementById('regNome').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('confirmPassword').value;

        // 2. Validação de senha
        if (password !== confirm) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            // 3. Verificação de e-mail duplicado na API
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Erro ao acessar servidor");
            
            const todosUsuarios = await res.json();
            const usuarioExiste = todosUsuarios.find(u => u["e-mail"] === email || u["email"] === email);

            if (usuarioExiste) {
                alert("Este e-mail já está cadastrado!");
                return;
            }

            // 4. Criação do novo usuário (POST)
            const saveRes = await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    "nome": nome,
                    "e-mail": email, 
                    "senha": password 
                })
            });

            if (saveRes.ok) {
                alert(`Olá ${nome}, sua conta foi criada com sucesso! Redirecionando para o login...`);
                window.location.href = "login.html";
            }

        } catch (error) {
            console.error("Erro no registro:", error);
            alert("Erro ao conectar com o servidor.");
        }
    });
}

// ==========================================
// --- LÓGICA DE LOGIN ---
// ==========================================
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            // 1. Busca usuários
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Erro ao acessar servidor");
            
            const users = await res.json();

            // 2. Validação de credenciais
            const usuarioEncontrado = users.find(u => 
                (u["e-mail"] === email || u["email"] === email) && u.senha === password
            );

            if (usuarioEncontrado) {
                alert(`Login realizado com sucesso! Bem-vindo, ${usuarioEncontrado.nome || 'Lenda'}!`);

                // 3. Persistência da sessão
                localStorage.removeItem('usuarioLogado'); // Limpa sessões antigas
                localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));

                // 4. Redirecionamento (sobe um nível para a raiz)
                window.location.href = "../index.html";
            } else {
                alert("E-mail ou senha incorretos!");
            }

        } catch (error) {
            console.error("Erro no login:", error);
            alert("Erro ao processar login. Verifique sua conexão.");
        }
    });
}

// ==========================================
// --- FUNÇÃO DE LOGOUT (OPCIONAL) ---
// ==========================================
function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = "login/login.html";
}