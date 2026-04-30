/**
 * js/catalogo.js
 * Lógica específica para a página "Cartas Disponíveis"
 */

// 1. Redeclaramos o Banco de Dados (Em um sistema real, leríamos de um arquivo comum ou API)
const cartasDisponiveis = [
    { 
        id: 1, 
        name: "Prof. Raphael", 
        price: 50.00, 
        type: "Logica de Programação", 
        img: "Raphael.png", 
        desc: "Poder especial: Loop Infinito de Conhecimento." 
    },
    { 
        id: 2, 
        name: "Mestre dos Dados (Prof. Romulo)", 
        price: 45.00, 
        type: "Banco de Dados", 
        img: "Romulo.png", 
        desc: "Habilidade: Aprende enquanto ensina." 
    },
    { 
        id: 3, 
        name: "Ivy", 
        price: 15.00, 
        type: "Alunos", 
        img: "ivy.png", 
        desc: "Habilidade: Comunicação rápida e eficiente ninguém pergunta nada." 
    },
    { 
        id: 4, 
        name: "Prof. Breno", 
        price: 15.00, 
        type: "POO", 
        img: "breno.png", 
        desc: "Mago POO." 
    }
];

// 2. Seleção de elementos (Usando IDs únicos para esta página)
const containerCatalogo = document.getElementById('card-container-catalogo');
const searchInput = document.getElementById('searchInputCatalogo');
const filterSelect = document.getElementById('filterTypeCatalogo');

/**
 * 3. Função de Renderização (Estilo Magic, igual à do main.js, mas para o novo container)
 */
function renderizarTodoCatalogo(listaDeCartas) {
    if (!containerCatalogo) return;
    containerCatalogo.innerHTML = ""; // Limpa o container

    if (listaDeCartas.length === 0) {
        containerCatalogo.innerHTML = `
            <div class="col-12 text-center my-5 text-white">
                <p class="opacity-50">Nenhum card encontrado no grimório para esta busca.</p>
            </div>`;
        return;
    }

    listaDeCartas.forEach(card => {
        // Cores temáticas para os Badges
        let badgeColor = "bg-primary"; // Azul (Lógica)
        if (card.type === "Banco de Dados") badgeColor = "bg-success"; // Verde
        if (card.type === "Alunos") badgeColor = "bg-secondary"; // Cinza
        if (card.type === "POO") badgeColor = "bg-danger"; // Vermelho

        containerCatalogo.innerHTML += `
            <div class="col">
                <div class="card h-100 card-item shadow-lg border-0 bg-dark text-white overflow-hidden">
                    <img src="img/${card.img}" class="card-img-top p-2" alt="${card.name}" 
                         style="height: 380px; object-fit: cover;"
                         onerror="this.src='https://via.placeholder.com/350x450?text=Card+Em+Breve'">
                    <div class="card-body d-flex flex-column text-center">
                        <div>
                            <span class="badge ${badgeColor} mb-2">${card.type.toUpperCase()}</span>
                        </div>
                        <h5 class="card-title fw-bold" style="font-family: 'Cinzel', serif;">${card.name}</h5>
                        <p class="small text-light fst-italic">"${card.desc}"</p>
                        <p class="text-warning fw-bold mt-auto fs-5">R$ ${card.price.toFixed(2).replace('.', ',')}</p>
                        <!-- Reutilizamos a função addToCart que está no main.js -->
                        <button onclick="addToCart(${card.id})" class="btn btn-outline-light w-100 mt-2">
                            Adicionar ao Deck
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

/**
 * 4. Lógica de Filtros (Cópia da lógica do main.js, adaptada para os novos IDs)
 */
function aplicarFiltrosCatalogo() {
    const termoBusca = searchInput.value.toLowerCase();
    const classeSelecionada = filterSelect.value;

    const cartasFiltradas = cartasDisponiveis.filter(card => {
        const correspondeBusca = card.name.toLowerCase().includes(termoBusca);
        const correspondeClasse = classeSelecionada === "all" || card.type === classeSelecionada;
        return correspondeBusca && correspondeClasse;
    });

    renderizarTodoCatalogo(cartasFiltradas);
}

// 5. Função para atualizar o contador (Cópia da do main.js para funcionar aqui)
function updateCartCounterCatalogo() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const counter = document.getElementById('cart-count');
    if(counter) counter.innerText = cart.length;
}

/**
 * 6. INICIALIZAÇÃO
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Proteção de rota (Opcional, mas boa prática, já que está no main.js também)
    if (!localStorage.getItem('usuarioLogado')) {
        window.location.replace("login.html");
        return;
    }

    // 2. Renderiza tudo inicialmente
    renderizarTodoCatalogo(cartasDisponiveis);
    updateCartCounterCatalogo();

    // 3. Configura ouvintes de eventos
    if (searchInput) searchInput.addEventListener('input', aplicarFiltrosCatalogo);
    if (filterSelect) filterSelect.addEventListener('change', aplicarFiltrosCatalogo);
});