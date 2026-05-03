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

    const usuarioId = usuarioLogado.email || usuarioLogado["e-mail"];
    const chaveColecao = `deck_${usuarioId}`;
    const colecaoAtual = JSON.parse(localStorage.getItem(chaveColecao)) || [];

    try {
        // Busca todos os cards disponíveis na API para o sorteio
        const res = await fetch("https://69f60881a72f01a951b91cd8.mockapi.io/cards");
        const todosCards = await res.json();

        let cardsSorteados = [];

        cart.forEach(item => {
            if (item.isBooster) {
                // Sorteia 3 cards por pacote
                const totalSorteios = item.quantity * 3;

                for (let i = 0; i < totalSorteios; i++) {
                    const indiceAleatorio = Math.floor(Math.random() * todosCards.length);
                    const cardSorteado = todosCards[indiceAleatorio];

                    // Evita duplicatas na coleção
                    const jaTemNaColecao = colecaoAtual.find(c => c.id === cardSorteado.id);
                    if (!jaTemNaColecao) {
                        colecaoAtual.push(cardSorteado);
                        cardsSorteados.push(cardSorteado.nome || cardSorteado.name);
                    }
                }
            } else {
                // Card normal (compra direta)
                const jaTemNaColecao = colecaoAtual.find(c => c.id === item.id);
                if (!jaTemNaColecao) colecaoAtual.push(item);
            }
        });

        localStorage.setItem(chaveColecao, JSON.stringify(colecaoAtual));

        // Monta mensagem com os cards sorteados
        const msgSorteio = cardsSorteados.length > 0
            ? `\n\n✨ Cards invocados:\n${cardsSorteados.join('\n')}`
            : "\n\n(Todos os cards sorteados já estavam na sua coleção!)";

        alert("Invocação Completa! Suas cartas foram adquiridas com sucesso!" + msgSorteio);
        localStorage.removeItem('cart');
        window.location.replace("colecao/colecao.html");

    } catch (err) {
        console.error(err);
        alert("Erro ao processar a compra. Tente novamente.");
    }
}




/**
 * js/loja.js
 */

function alterarQtd(valor) {
    const input = document.getElementById('qtd-pacotes');
    if (!input) return;
    let atual = parseInt(input.value);
    atual += valor;
    if (atual < 1) atual = 1;
    input.value = atual;
}

function adicionarPacoteAoCarrinho() {
    const input = document.getElementById('qtd-pacotes');
    const qtd = input ? parseInt(input.value) : 1;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const index = cart.findIndex(item => item.id === "booster-serratec");

    if (index > -1) {
        cart[index].quantity += qtd;
    } else {
        cart.push({
            id: "booster-serratec",
            name: "Pacote de Expansão Serratec",
            price: 5.00,
            quantity: qtd,
            img: "img/pacote.png",
            type: "Pacote",
            isBooster: true
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${qtd} pacote(s) adicionado(s) ao carrinho! ✨`);

    if (typeof updateCartCounter === 'function') updateCartCounter();
}



/**
 * js/loja.js
 */

function alterarQtd(valor) {
    const input = document.getElementById('qtd-pacotes');
    if (!input) return;
    let atual = parseInt(input.value);
    atual += valor;
    if (atual < 1) atual = 1;
    input.value = atual;
}

function getPreco() {
    // Pega o preço exibido na página e converte para número
    const precoElem = document.querySelector('.preco');
    if (!precoElem) return 5.00;
    const texto = precoElem.textContent.replace('R$', '').replace(',', '.').trim();
    return parseFloat(texto) || 5.00;
}

function adicionarPacoteAoCarrinho() {
    const input = document.getElementById('qtd-pacotes');
    const qtd = input ? parseInt(input.value) : 1;
    const preco = getPreco();

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const index = cart.findIndex(item => item.id === "booster-serratec");

    if (index > -1) {
        cart[index].quantity += qtd;
        cart[index].price = preco; // Atualiza o preço também
    } else {
        cart.push({
            id: "booster-serratec",
            name: "Pacote de Expansão Serratec",
            price: preco,
            quantity: qtd,
            img: "img/pacote.png",
            type: "Pacote",
            isBooster: true
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${qtd} pacote(s) adicionado(s) ao carrinho! ✨`);

    if (typeof updateCartCounter === 'function') updateCartCounter();
}