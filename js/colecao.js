/**
 * js/colecao.js
 * Lógica para renderizar as cartas que o usuário já possui
 */

const baseCartasOficial = [
    { id: "1", name: "Prof. Raphael",   price: 85, img: "../img/Raphael.png",   type: "Logica de Programação" },
    { id: "2", name: "Prof. Romulo",    price: 65, img: "../img/Romulo.png",    type: "Banco de Dados" },
    { id: "3", name: "Ivy",             price: 3,  img: "../img/ivy.png",       type: "Alunos" },
    { id: "4", name: "Prof. Breno",     price: 80, img: "../img/breno.png",     type: "POO" },
    { id: "5", name: "Prof. Menegueli", price: 90, img: "../img/menegueli.png", type: "Front End" }
];

function getCardById(id) {
    return baseCartasOficial.find(c => c.id == id) || null;
}

async function renderizarMinhaColecao() {
    const container = document.getElementById('card-container-colecao');
    const totalPatrimonio = document.getElementById('valor-total-colecao');
    
    // Recupera o usuário atualizado do localStorage
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado || !container) return;

    // IDs salvos no MockAPI do usuário (ex: [1, 4, 4])
    const meusIds = usuarioLogado.colecao || [];
    let somaValores = 0;

    container.innerHTML = "";

    if (meusIds.length === 0) {
        container.innerHTML = `<div class="col-12 text-center text-white-50 my-5">
            <p>Você ainda não possui cartas. Abra um pacote na loja!</p>
        </div>`;
        if (totalPatrimonio) totalPatrimonio.innerText = "R$ 0,00";
        return;
    }

    meusIds.forEach(idDaCarta => {
        const carta = baseCartasOficial.find(c => c.id == idDaCarta);const nome  = card ? card.name  : `Card #${idCard}`;
        const tipo  = card ? card.type  : "Desconhecido";
        const img   = card ? card.img   : "https://placehold.co/350x450?text=Card";
        const price = card ? card.price : 0;

        if (carta) {
            somaValores += carta.price;
            
            container.innerHTML += `
                <div class="col">
                    <div class="card h-100 bg-dark text-white border-warning shadow-sm">
                        <img src="${carta.img}" class="card-img-top p-2" style="height: 200px; object-fit: contain;">
                        <div class="card-body text-center p-2">
                            <h6 class="card-title fw-bold small">${carta.name}</h6>
                            <span class="text-white-50 small">💰 Avaliada em R&#36; ${price.toFixed(2).replace('.', ',')}</span>

                            <p class="fw-bold">R$ ${carta.price.toFixed(2).replace('.', ',')}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    // Atualiza o valor total da coleção do mestre
    if (totalPatrimonio) {
        totalPatrimonio.innerText = `R$ ${somaValores.toFixed(2).replace('.', ',')}`;
    }
}

document.addEventListener('DOMContentLoaded', renderizarMinhaColecao);