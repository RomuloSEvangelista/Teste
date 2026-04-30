/**
 * js/cart.js - Lógica do Carrinho de Cards
 */

const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalElement = document.getElementById('cart-total');
const totalItemsElement = document.getElementById('total-items');

/**
 * Renderiza os itens do localStorage na tela do carrinho
 */
function renderCart() {
    if (!cartItemsContainer) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Caso o carrinho esteja vazio
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center p-5 border border-secondary rounded-4 bg-black opacity-75">
                <p class="fs-4">Seu deck está vazio...</p>
                <a href="index.html" class="btn btn-warning mt-3">Explorar Grimório</a>
            </div>`;
        updateSummary(0, 0);
        return;
    }

    // Limpa o container e inicia a soma
    cartItemsContainer.innerHTML = "";
    let totalValue = 0;

    cart.forEach((item, index) => {
        totalValue += item.price;
        
        cartItemsContainer.innerHTML += `
            <div class="card bg-dark border-secondary text-white shadow-sm mb-2 overflow-hidden card-cart-item">
                <div class="row g-0 align-items-center">
                    <div class="col-3 col-md-2">
                        <img src="img/${item.img}" class="img-fluid p-2" alt="${item.name}" 
                             style="max-height: 100px; object-fit: contain;"
                             onerror="this.src='https://via.placeholder.com/100?text=Card'">
                    </div>
                    <div class="col-6 col-md-7">
                        <div class="card-body py-2">
                            <h5 class="card-title mb-1 fs-6 fw-bold text-warning" style="font-family: 'Cinzel', serif;">${item.name}</h5>
                            <p class="card-text small text-light opacity-75 mb-0">${item.type}</p>
                        </div>
                    </div>
                    <div class="col-3 col-md-3 text-center border-start border-secondary">
                        <p class="fw-bold mb-1">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                        <button onclick="removeFromCart(${index})" class="btn btn-sm text-danger border-0 p-0">Remover</button>
                    </div>
                </div>
            </div>
        `;
    });

    updateSummary(cart.length, totalValue);
}

/**
 * Atualiza os valores do resumo lateral
 */
function updateSummary(count, total) {
    if (totalItemsElement) totalItemsElement.innerText = count;
    if (cartTotalElement) cartTotalElement.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    // Sincroniza o contador da Navbar caso exista na página
    const counter = document.getElementById('cart-count');
    if (counter) counter.innerText = count;
}

/**
 * Remove um item específico pelo índice do array
 */
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1); // Remove 1 elemento na posição index
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart(); // Re-renderiza a lista
}

/**
 * Limpa todo o carrinho
 */
function clearCart() {
    if (confirm("Deseja realmente remover todas as cartas do seu deck?")) {
        localStorage.removeItem('cart');
        renderCart();
    }
}

/**
 * Simula a finalização da compra
 */
function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Seu deck está vazio! Adicione cartas antes de finalizar.");
        return;
    }
    
    alert("Invocação Completa! Suas cartas foram adquiridas com sucesso.");
    localStorage.removeItem('cart');
    window.location.replace("index.html");
}

// Inicializa a renderização ao carregar a página
document.addEventListener('DOMContentLoaded', renderCart);