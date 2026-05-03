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
// --- LÓGICA DE EDITAR PERFIL ---
// ==========================================
const editForm = document.getElementById('editForm');

if (editForm) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado) {
        alert("Você precisa estar logado!");
        window.location.href = "../login/login.html";
    } else {
        document.getElementById('editNome').value = usuarioLogado.nome || '';
        document.getElementById('editEmail').value = usuarioLogado['e-mail'] || usuarioLogado.email || '';
    }

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



// ========================= teste===========
async function comprarEAbrirPacote() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const API_USUARIOS = "https://69f60881a72f01a951b91cd8.mockapi.io/usuarios";
    const API_CARDS = "https://69f60881a72f01a951b91cd8.mockapi.io/cards";

    if (!usuarioLogado) return alert("Faça login para comprar pacotes!");

    try {
        // 1. Pegar todos os IDs de cartas disponíveis no sistema
        const resCards = await fetch(API_CARDS);
        const todasAsCartas = await resCards.json();
        
        // 2. Sortear 3 IDs aleatórios
        const novosIdsSorteados = [];
        for (let i = 0; i < 3; i++) {
            const index = Math.floor(Math.random() * todasAsCartas.length);
            novosIdsSorteados.push(todasAsCartas[index].id);
        }

        // 3. Mesclar com a coleção atual do usuário (evitando perder o que ele já tinha)
        // Se usuarioLogado.colecao não existir, começamos com um array vazio
        const colecaoAtual = usuarioLogado.colecao || [];
        const colecaoAtualizada = [...colecaoAtual, ...novosIdsSorteados];

        // 4. Atualizar o MockAPI do Usuário (Método PUT)
        const resUpdate = await fetch(`${API_USUARIOS}/${usuarioLogado.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...usuarioLogado,
                colecao: colecaoAtualizada
            })
        });

        if (resUpdate.ok) {
            const usuarioServidor = await resUpdate.json();
            // Atualiza o localStorage para a sessão refletir a nova coleção
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioServidor));
            
            alert(`Sucesso! Você ganhou as cartas com IDs: ${novosIdsSorteados.join(', ')}`);
            exibirNovasCartas(novosIdsSorteados, todasAsCartas);
        }

    } catch (error) {
        console.error("Erro na transação:", error);
    }
}

// Função auxiliar para mostrar visualmente o que ele ganhou
function exibirNovasCartas(idsGanhos, listaCompleta) {
    const areaResultado = document.getElementById('resultadoSorteio');
    areaResultado.innerHTML = '<h2 class="hero-title w-100 text-center">Cartas Adquiridas:</h2>';

    idsGanhos.forEach(id => {
        const dadosCarta = listaCompleta.find(c => c.id === id);
        areaResultado.innerHTML += `
            <div class="col-md-3 text-center mb-4">
                <img src="${dadosCarta.imagem}" class="img-fluid border border-warning rounded shadow-lg">
                <p class="mt-2 text-warning fw-bold">${dadosCarta.nome}</p>
            </div>
        `;
    });
}

// ==========================================
// --- LOGOUT ---
// ==========================================
function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = "login/login.html";
}