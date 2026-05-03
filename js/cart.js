/**
 * js/cart.js - Lógica do Carrinho de Cards
 */

// ==========================================
// --- ADICIONAR AO CARRINHO ---
// ==========================================
function addToCart(cardId) {
    const card = cartasDisponiveis.find(c => c.id === cardId);
    if (!card) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const jaExiste = cart.find(c => c.id === cardId);
    if (jaExiste) {
        alert(`"${card.name}" já está no seu deck!`);
        return;
    }

    cart.push(card);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    alert(`"${card.name}" adicionado ao deck!`);
}

// ==========================================
// --- ATUALIZAR CONTADOR DA NAVBAR ---
// ==========================================
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const counter = document.getElementById('cart-count');
    if (counter) counter.innerText = cart.length;
}

// ==========================================
// --- RENDERIZAR CARRINHO ---
// ==========================================
function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items-container');
    const totalItemsElem = document.getElementById('total-items');
    const cartTotalElem = document.getElementById('cart-total');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="alert alert-dark text-center border-secondary">
                Seu deck está vazio. <a href="colecao/catalogo.html" class="text-warning">Vá buscar novas cartas!</a>
            </div>`;
        if (totalItemsElem) totalItemsElem.innerText = "0";
        if (cartTotalElem) cartTotalElem.innerText = "R$ 0,00";
        return;
    }

    container.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        container.innerHTML += `
            <div class="card bg-black border-secondary p-3 shadow-sm mb-2">
                <div class="row align-items-center">
                    <div class="col-3 col-md-2">
                    <img src="${(item.img || '').replace('../', '')}" class="img-fluid rounded" alt="${item.nome || item.name}"
                            onerror="this.src='https://placehold.co/100?text=Card'">
                    </div>
                    <div class="col-6 col-md-7">
                        <h5 class="mb-0 text-warning">${item.name}</h5>
                        <small class="text-white-50">${item.type}</small>
                    </div>
                    <div class="col-3 col-md-3 text-end">
                        <p class="fw-bold mb-1">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">Remover</button>
                    </div>
                </div>
            </div>`;
    });

    if (totalItemsElem) totalItemsElem.innerText = cart.length;
    if (cartTotalElem) cartTotalElem.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// ==========================================
// --- REMOVER ITEM ---
// ==========================================
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCounter();
}

// ==========================================
// --- LIMPAR CARRINHO ---
// ==========================================
function clearCart() {
    if (confirm("Deseja realmente esvaziar seu deck atual?")) {
        localStorage.removeItem('cart');
        renderCart();
        updateCartCounter();
    }
}

// ==========================================
// --- FINALIZAR COMPRA ---
// ==========================================
function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Seu deck está vazio! Adicione cartas antes de finalizar.");
        return;
    }

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuarioLogado) {
        const usuarioId = usuarioLogado.email || usuarioLogado["e-mail"];
        const chaveColecao = `deck_${usuarioId}`;
        const colecaoAtual = JSON.parse(localStorage.getItem(chaveColecao)) || [];

        cart.forEach(card => {
            const jaTemNaColecao = colecaoAtual.find(c => c.id === card.id);
            if (!jaTemNaColecao) colecaoAtual.push(card);
        });

        localStorage.setItem(chaveColecao, JSON.stringify(colecaoAtual));
    }

    alert("Invocação Completa! Suas cartas foram adquiridas com sucesso.");
    localStorage.removeItem('cart');
    window.location.replace("colecao/colecao.html");
}

// Alias para o botão do HTML
const finalizarCompra = checkout;

// ==========================================
// --- INICIALIZAÇÃO ---
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateCartCounter();
});