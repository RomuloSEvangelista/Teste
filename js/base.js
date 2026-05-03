const API_URL = "https://69f60881a72f01a951b91cd8.mockapi.io/cards";

// ==========================================
// --- LÓGICA DE REGISTRO ---
// ==========================================
const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('regNome').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('confirmPassword').value;

        if (password !== confirm) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Erro ao acessar servidor");
            
            const todosUsuarios = await res.json();
            const usuarioExiste = todosUsuarios.find(u => u["e-mail"] === email || u["email"] === email);

            if (usuarioExiste) {
                alert("Este e-mail já está cadastrado!");
                return;
            }

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
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Erro ao acessar servidor");
            
            const users = await res.json();

            const usuarioEncontrado = users.find(u => 
                (u["e-mail"] === email || u["email"] === email) && u.senha === password
            );

            if (usuarioEncontrado) {
                alert(`Login realizado com sucesso! Bem-vindo, ${usuarioEncontrado.nome || 'Lenda'}!`);

                localStorage.removeItem('usuarioLogado');
                localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));

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
// --- LÓGICA DE EDITAR E EXCLUIR ---
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    const editForm = document.getElementById('editForm');

    if (editForm) {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

        if (!usuarioLogado) {
            alert("Você precisa estar logado!");
            window.location.href = "../login/login.html";
            return;
        }

        document.getElementById('editNome').value = usuarioLogado.nome || '';
        document.getElementById('editEmail').value = usuarioLogado['e-mail'] || usuarioLogado.email || '';

        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const novoNome  = document.getElementById('editNome').value.trim();
            const novoEmail = document.getElementById('editEmail').value.trim();
            const novaSenha = document.getElementById('editSenha').value;

            const dadosAtualizados = {
                nome: novoNome,
                "e-mail": novoEmail,
            };

            if (novaSenha) {
                dadosAtualizados.senha = novaSenha;
            }

            try {
                const res = await fetch(`${API_URL}/${usuarioLogado.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosAtualizados)
                });

                if (!res.ok) throw new Error("Erro ao atualizar");

                const usuarioAtualizado = await res.json();
                localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));

                alert("Dados atualizados com sucesso!");

            } catch (error) {
                console.error("Erro ao editar:", error);
                alert("Erro ao atualizar os dados. Tente novamente.");
            }
        });
    }

    // ==========================================
    // --- LÓGICA DE EXCLUIR CONTA ---
    // ==========================================
    const btnExcluir = document.getElementById('btnExcluirConta');

    if (btnExcluir) {
        btnExcluir.addEventListener('click', async () => {

            const confirmou = confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.");
            if (!confirmou) return;

            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

            if (!usuarioLogado) {
                alert("Nenhum usuário logado.");
                return;
            }

            try {
                const res = await fetch(`${API_URL}/${usuarioLogado.id}`, {
                    method: 'DELETE'
                });

                if (!res.ok) throw new Error("Erro ao excluir");

                localStorage.removeItem('usuarioLogado');
                alert("Conta excluída com sucesso. Até mais!");
                window.location.href = "../login/login.html";

            } catch (error) {
                console.error("Erro ao excluir conta:", error);
                alert("Erro ao excluir a conta. Tente novamente.");
            }
        });
    }

});

// ==========================================
// --- LOGOUT ---
// ==========================================
function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = "login/login.html";
}