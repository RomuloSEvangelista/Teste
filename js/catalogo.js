/**
 * js/catalogo.js
 * Vitrine de todas as cartas existentes no Serratec Collector
 */

const cartasDisponiveis = [
    { id: 1, name: "Prof. Raphael",                  type: "Logica de Programação", img: "../img/Raphael.png",   desc: "Poder especial: Loop Infinito de Conhecimento." },
    { id: 2, name: "Mestre dos Dados (Prof. Romulo)", type: "Banco de Dados",        img: "../img/Romulo.png",    desc: "Habilidade: Aprende enquanto ensina." },
    { id: 3, name: "Ivy",                             type: "Alunos",                img: "../img/ivy.png",       desc: "Habilidade: Comunicação rápida e eficiente." },
    { id: 4, name: "Prof. Breno",                     type: "POO",                   img: "../img/breno.png",     desc: "Mago POO." },
    { id: 5, name: "Prof. Menegueli",                 type: "Front End",             img: "../img/menegueli.png", desc: "Mestre do Front End." }
];

function renderizarTodoCatalogo(listaDeCartas) {
    const containerCatalogo = document.getElementById('card-container-catalogo');
    if (!containerCatalogo) return;
    
    containerCatalogo.innerHTML = "";

    if (listaDeCartas.length === 0) {
        containerCatalogo.innerHTML = `
            <div class="col-12 text-center my-5 text-white">
                <p class="opacity-50">Nenhum card encontrado no grimório.</p>
            </div>`;
        return;
    }

    listaDeCartas.forEach(card => {
        // 1. Definição das cores das badges
        const badges = {
            "Banco de Dados": "bg-success",
            "Alunos": "bg-secondary",
            "POO": "bg-danger",
            "Logica de Programação": "bg-primary",
            "Front End": "bg-info"
        };
        
        const badgeColor = badges[card.type] || "bg-dark";

        // 2. Injeção do HTML com o botão estilizado e destacado
        containerCatalogo.innerHTML += `
            <div class="col">
                <div class="card h-100 card-item shadow-lg border-0 bg-dark text-white overflow-hidden" style="border: 1px solid rgba(255,255,255,0.05) !important;">
                    <img src="${card.img}" class="card-img-top p-2" alt="${card.name}"
                         style="height: 320px; object-fit: contain;"
                         onerror="this.src='https://placehold.co/350x450?text=Card+Em+Breve'">
                    <div class="card-body d-flex flex-column text-center">
                        <span class="badge ${badgeColor} mb-2" style="font-size: 0.65rem; letter-spacing: 1px;">${card.type.toUpperCase()}</span>
                        <h5 class="card-title fw-bold" style="font-family: 'Cinzel', serif; color: #f1c40f;">${card.name}</h5>
                        <p class="small text-light fst-italic mb-4" style="opacity: 0.7;">"${card.desc}"</p>
                        
                        <div class="mt-auto">
                        <a href="../loja/loja.html" class="btn btn-tentar-sorte btn-pulse w-100 py-2">
                            ✨ Tentar a Sorte na Loja
                        </a>
                        </div>
                             </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se o usuário está logado antes de mostrar o catálogo
    if (!localStorage.getItem('usuarioLogado')) {
        window.location.replace("../login/login.html");
        return;
    }

    renderizarTodoCatalogo(cartasDisponiveis);
});







