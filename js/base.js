const container = document.getElementById('card-container');

/**
 * 1. PROTEÇÃO DE ROTA (IIFE)
 * Bloqueia o acesso à vitrine se não houver login ativo.
 */
(function checkAuth() {
    if (!localStorage.getItem('usuarioLogado')) {
        window.location.replace("login.html");
    }
})();

/**
 * 2. FUNÇÃO DE LOGOUT
 * Limpa a sessão e redireciona para o login.
 */
function logoutSerratec() {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('perfil');
    
    alert("Sessão encerrada com sucesso!");
    window.location.replace("login.html");
}

/**
 * 3. BANCO DE DADOS (CARDS)
 * Configurado com seus personagens e artes .png
 */
const cardsData = [
    { 
        id: 1, 
        name: "Prof. Raphael", 
        price: 50.00, 
        type: "Logica de Programação", 
        img: "./img/Raphael.png", 
        desc: "Poder especial: Loop Infinito de Conhecimento." 
    },
    { 
        id: 2, 
        name: "Mestre dos Dados (Prof. Romulo)", 
        price: 45.00, 
        type: "Banco de Dados", 
        img: "./img/Romulo.png", 
        desc: "Habilidade: Aprende enquanto ensina." 
    },
    { 
        id: 3, 
        name: "Ivy", 
        price: 15.00, 
        type: "Alunos", 
        img: "./img/ivy.png", 
        desc: "Habilidade: Comunicação rápida e eficiente." 
    },
    { 
        id: 4, 
        name: "Prof. Breno", 
        price: 15.00, 
        type: "POO", 
        img: "./img/breno.png", 
        desc: "Mago POO. Encapsula erros e herda sabedoria." 
    },
    { 
        id: 4, 
        name: "Prof. Menegueli", 
        price: 15.00, 
        type: "Front End", 
        img: "./img/menegueli.png", 
        desc: "Mago POO. Encapsula erros e herda sabedoria." 
    }

    
];

// Seleção de elementos do DOM
const container = document.getElementById('card-container');
const filterSelect = document.getElementById('filterType');
const searchInput = document.getElementById('searchInput');

/**
 * 4. LÓGICA DE RENDERIZAÇÃO
 * Estilo focado em cartas de Magic (Dark Theme)
 */
function renderCards(products) {
    if(!container) return;
    container.innerHTML = ""; 

    if (products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center my-5 text-white">
                <p class="opacity-50">Nenhum card encontrado no grimório.</p>
            </div>`;
        return;
    }

    products.forEach(card => {
        // Cores temáticas para os Badges
        let badgeColor = "bg-primary"; // Azul (Lógica)
        if(card.type === "Banco de Dados") badgeColor = "bg-success"; // Verde
        if(card.type === "Alunos") badgeColor = "bg-secondary"; // Cinza
        if(card.type === "POO") badgeColor = "bg-danger"; // Vermelho

        container.innerHTML += `
            <div class="col">
                <div class="card h-100 card-item shadow-lg border-0 bg-dark text-white overflow-hidden">
                    <img src="img/${card.img}" class="card-img-top p-2" alt="${card.name}" 
                         style="height: 380px; object-fit: cover;"
                         onerror="this.src='https://via.placeholder.com/350x450?text=Card+Em+Breve'">
                    <div class="card-body d-flex flex-column text-center">
                        <div>
                            <span class="badge ${badgeColor} mb-2">${card.type.toUpperCase()}</span>
                        </div>
                        <h5 class="card-title fw-bold">${card.name}</h5>
                        <p class="small text-muted fst-italic">"${card.desc}"</p>
                        <p class="text-warning fw-bold mt-auto fs-5">R$ ${card.price.toFixed(2).replace('.', ',')}</p>
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
 * 5. FILTROS E BUSCA
 */
function handleFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = filterSelect.value;

    const filtered = cardsData.filter(card => {
        const matchesSearch = card.name.toLowerCase().includes(searchTerm);
        const matchesType = selectedType === "all" || card.type === selectedType;
        return matchesSearch && matchesType;
    });

    renderCards(filtered);
}

/**
 * 6. GESTÃO DO CARRINHO
 */
function addToCart(id) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cardsData.find(p => p.id === id);
    
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    
    alert(`${product.name} foi adicionado ao seu deck!`);
}

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const counter = document.getElementById('cart-count');
    if(counter) counter.innerText = cart.length;
}

/**
 * 7. INICIALIZAÇÃO
 */
document.addEventListener('DOMContentLoaded', () => {
    renderCards(cardsData);
    updateCartCounter();

    // Event listeners para filtros
    if(searchInput) searchInput.addEventListener('input', handleFilters);
    if(filterSelect) filterSelect.addEventListener('change', handleFilters);
});

function addToCart(id) {
    // 1. Pega o carrinho atual ou cria um vazio
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 2. Encontra a carta no seu banco de dados (cardsData)
    const product = cardsData.find(p => p.id === id);
    
    if (product) {
        // 3. Adiciona a cópia da carta ao array
        cart.push(product);
        
        // 4. Salva de volta no localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // 5. Atualiza o número no ícone do carrinho (navbar)
        updateCartCounter();
        
        alert(`${product.name} foi adicionado ao seu deck!`);
    }
}

function addToCart(id) {
    console.log("O botão foi clicado! ID da carta:", id); // ADICIONE ISSO
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 2. Procura a carta pelo ID no seu array cardsData
    const product = cardsData.find(p => p.id === id);
    
    if (product) {
        // 3. Adiciona ao array
        cart.push(product);
        
        // 4. Salva de volta no LocalStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // 5. Atualiza o contador visual
        updateCartCounter();
        
        alert(`${product.name} adicionado com sucesso!`);
    } else {
        console.error("Card não encontrado para o ID:", id);
    }
}

// Função para atualizar o número vermelho na Navbar
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const counter = document.getElementById('cart-count');
    if (counter) {
        counter.innerText = cart.length;
    }
}