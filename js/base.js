// 1. BANCO DE DADOS
const cardsData = [
    { id: 1, name: "Prof. Raphael", price: 80.00, type: "Logica de Programação", img: "Raphael.png", desc: "Loop Infinito de Conhecimento." },
    { id: 2, name: "Prof. Romulo", price: 65.00, type: "Banco de Dados", img: "Romulo.png", desc: "Habilidade: Aprende enquanto ensina." },
    { id: 3, name: "Ivy", price: 3.00, type: "Alunos", img: "ivy.png", desc: "Comunicação rápida e eficiente." },
    { id: 4, name: "Prof. Breno", price: 70.00, type: "POO", img: "breno.png", desc: "Mago POO. Encapsula erros." },
    { id: 5, name: "Prof. Menegueli", price: 85.00, type: "Front End", img: "menegueli.png", desc: "Mestre das interfaces." }
];

// 2. FUNÇÕES DE SESSÃO E NAVEGAÇÃO
window.logoutSerratec = function() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = "./login/login.html";
};

// 3. GESTÃO DO CARRINHO (COMPRA TEMPORÁRIA)
window.addToCart = function(id) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cardsData.find(p => p.id === id);
    if (product) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
        alert(`${product.name} adicionado ao deck!`);
    }
};

window.updateCartCounter = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const counter = document.getElementById('cart-count');
    if (counter) counter.innerText = cart.length;
};

// 4. LÓGICA DE COMPRA (TRANSFERE PARA A COLEÇÃO PERMANENTE DO USUÁRIO)
window.finalizarCompra = function() {
    const usuarioAtivo = localStorage.getItem('usuarioLogado');
    const carrinho = JSON.parse(localStorage.getItem('cart')) || [];

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio! Adicione cartas antes de finalizar.");
        return;
    }

    // Identifica a "pasta" única do usuário logado
    const chaveColecao = `deck_${usuarioAtivo}`;
    
    // Pega o que ele já possui e junta com o novo
    const colecaoAtual = JSON.parse(localStorage.getItem(chaveColecao)) || [];
    const novaColecao = [...colecaoAtual, ...carrinho];
    
    // Salva na coleção definitiva e limpa o carrinho
    localStorage.setItem(chaveColecao, JSON.stringify(novaColecao));
    localStorage.removeItem('cart');
    
    alert("Compra realizada com sucesso! Verifique sua coleção.");
    window.location.href = "../colecao/colecao.html";
};

// 5. RENDERIZAÇÃO E FILTROS
function renderCards(lista) {
    const container = document.getElementById('card-container');
    if (!container) return;
    container.innerHTML = "";

    lista.forEach(card => {
        container.innerHTML += `
            <div class="col d-flex justify-content-center">
                <div class="card h-100 card-item bg-dark text-white shadow">
                    <img src="img/${card.img}" class="card-img-top" alt="${card.name}"
                         onerror="this.src='https://via.placeholder.com/300x320?text=Sem+Foto'">
                    <div class="card-body text-center d-flex flex-column">
                        <h5 class="card-title fw-bold text-warning">${card.name}</h5>
                        <p class="small text-muted mb-2" style="font-size: 0.8rem;">${card.type}</p>
                        <p class="card-text small fst-italic mb-3" style="flex-grow: 1;">"${card.desc}"</p>
                        <p class="fw-bold fs-5 mb-2">R$ ${card.price.toFixed(2).replace('.', ',')}</p>
                        <button onclick="addToCart(${card.id})" class="btn btn-warning btn-sm fw-bold text-dark">
                            Adicionar ao Deck
                        </button>
                    </div>
                </div>
            </div>`;
    });
}

function filtrar() {
    const busca = document.getElementById('searchInput')?.value.toLowerCase() || "";
    const tipo = document.getElementById('filterType')?.value || "all";
    const filtrados = cardsData.filter(c => 
        (tipo === 'all' || c.type === tipo) && c.name.toLowerCase().includes(busca)
    );
    renderCards(filtrados);
}

// 6. INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    // 1. Verifica em qual página estamos
    const path = window.location.pathname;
    const paginaAtual = path.split("/").pop();

    // 2. Proteção de Rota: Só redireciona se NÃO for o index ou o login
    // Permitimos que o usuário veja o index.html sem estar logado
    if (!localStorage.getItem('usuarioLogado')) {
        if (paginaAtual !== "index.html" && paginaAtual !== "./login/login.html" && paginaAtual !== "") {
            window.location.href = "./login/login.html";
            return; 
        }
    }

    // 3. Só tenta renderizar cartas se o container existir (evita erro no index)
    if (document.getElementById('card-container')) {
        renderCards(cardsData);
    }
    
    updateCartCounter();
});