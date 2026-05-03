/**
 * js/cart.js - Lógica do Carrinho de Cards
 */

if (typeof cartasDisponiveis === 'undefined') {
    var cartasDisponiveis = [];
}

function addToCart(cardId) {
    var card = cartasDisponiveis.find(c => c.id_card === cardId);
    if (!card) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const jaExiste = cart.find(c => c.id_card === cardId);
    if (jaExiste) {
        alert(`"${card.nome || card.name}" já está no seu deck!`);
        return;
    }

    cart.push(card);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    alert(`"${card.nome || card.name}" adicionado ao deck!`);
}

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const counter = document.getElementById('cart-count');
    if (counter) counter.innerText = total;
}

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
    let totalItens = 0;

    cart.forEach((item, index) => {
        const qty = item.quantity || 1;
        const priceUnit = parseFloat(item.price) || 0;
        const priceTotal = priceUnit * qty;
        total += priceTotal;
        totalItens += qty;

        const nome = item.nome || item.name || "Item";
        const tipo = item.tipo || item.type || "";
        const imgSrc = (item.img || '').replace('../', '');

        if (item.isBooster) {
            container.innerHTML += `
                <div class="card bg-black border-warning p-3 shadow-sm mb-2">
                    <div class="row align-items-center">
                        <div class="col-3 col-md-2 text-center">
                            <img src="${imgSrc}" class="img-fluid rounded" alt="${nome}"
                                 style="max-height:80px; object-fit:contain;"
                                 onerror="this.src='https://placehold.co/80x80?text=📦'">
                        </div>
                        <div class="col-6 col-md-7">
                            <h5 class="mb-0 text-warning">✨ ${nome}</h5>
                            <small class="text-white-50">3 cartas aleatórias por pacote</small><br>
                            <span class="badge bg-warning text-dark mt-1">${qty} pacote(s)</span>
                        </div>
                        <div class="col-3 col-md-3 text-end">
                            <p class="fw-bold mb-1">R$ ${priceTotal.toFixed(2).replace('.', ',')}</p>
                            <div class="d-flex justify-content-end align-items-center gap-1 mb-1">
                                <button class="btn btn-outline-light btn-sm px-2 py-0" onclick="alterarQtdCarrinho(${index}, -1)">−</button>
                                <span class="px-2">${qty}</span>
                                <button class="btn btn-outline-light btn-sm px-2 py-0" onclick="alterarQtdCarrinho(${index}, 1)">+</button>
                            </div>
                            <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">Remover</button>
                        </div>
                    </div>
                </div>`;
        } else {
            container.innerHTML += `
                <div class="card bg-black border-secondary p-3 shadow-sm mb-2">
                    <div class="row align-items-center">
                        <div class="col-3 col-md-2">
                            <img src="${imgSrc}" class="img-fluid rounded" alt="${nome}"
                                 style="max-height:80px; object-fit:contain;"
                                 onerror="this.src='https://placehold.co/80x80?text=Card'">
                        </div>
                        <div class="col-6 col-md-7">
                            <h5 class="mb-0 text-warning">${nome}</h5>
                            <small class="text-white-50">${tipo}</small>
                        </div>
                        <div class="col-3 col-md-3 text-end">
                            <p class="fw-bold mb-1">R$ ${priceTotal.toFixed(2).replace('.', ',')}</p>
                            <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">Remover</button>
                        </div>
                    </div>
                </div>`;
        }
    });

    if (totalItemsElem) totalItemsElem.innerText = totalItens;
    if (cartTotalElem) cartTotalElem.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function alterarQtdCarrinho(index, valor) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity = (cart[index].quantity || 1) + valor;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCounter();
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCounter();
}

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
async function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Seu deck está vazio! Adicione cartas antes de finalizar.");
        return;
    }

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
        alert("Você precisa estar logado!");
        return;
    }

    try {
        // 1. Busca o usuário atualizado na API
        const resUser = await fetch(`${API_URL}/${usuarioLogado.id}`);
        const usuarioAtual = await resUser.json();

        // 2. Pega o array id_card atual (ou cria vazio)
        const idCardsAtuais = usuarioAtual.id_card || [];
        let cardsSorteados = [];

        // 3. Sorteia cards para cada pacote
        cart.forEach(item => {
            if (item.isBooster) {
                const totalSorteios = (item.quantity || 1) * 3;
                for (let i = 0; i < totalSorteios; i++) {
                    const numeroSorteado = Math.floor(Math.random() * 20) + 1; // 1 a 20
                    idCardsAtuais.push(numeroSorteado);
                    cardsSorteados.push(numeroSorteado);
                }
            }
        });

        // 4. Salva o array atualizado na API via PUT
        const resPut = await fetch(`${API_URL}/${usuarioLogado.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_card: idCardsAtuais })
        });

        if (!resPut.ok) throw new Error("Erro ao salvar cards");

        // 5. Atualiza o localStorage com os novos dados
        usuarioAtual.id_card = idCardsAtuais;
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtual));

        const msgSorteio = cardsSorteados.length > 0
            ? `\n\n✨ IDs sorteados: ${cardsSorteados.join(', ')}`
            : "\n\n(Nenhum card sorteado.)";

        alert("Invocação Completa! Suas cartas foram adquiridas com sucesso!" + msgSorteio);
        localStorage.removeItem('cart');
        window.location.replace("colecao/colecao.html");

    } catch (err) {
        console.error(err);
        alert("Erro ao processar a compra. Tente novamente.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateCartCounter();
});