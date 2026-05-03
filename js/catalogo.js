/**
 * js/catalogo.js
 * Vitrine de todas as cartas existentes no Serratec Collector
 */

const cartasDisponiveis = [
    { id: 1,  name: "Prof. Raphael",   type: "Logica de Programação", img: "../img/Raphael.png",   desc: "Poder especial: Loop Infinito de Conhecimento." },
    { id: 2,  name: "Prof. Romulo",    type: "Banco de Dados",        img: "../img/Romulo.png",    desc: "Habilidade: Aprende enquanto ensina." },
    { id: 3,  name: "Ivy",             type: "Alunos",                img: "../img/ivy.png",       desc: "Habilidade: Comunicação rápida e eficiente." },
    { id: 4,  name: "Prof. Breno",     type: "POO",                   img: "../img/breno.png",     desc: "Mago POO." },
    { id: 5,  name: "Prof. Menegueli", type: "Front End",             img: "../img/menegueli.png", desc: "Mestre do Front End." },
    { id: 6,  name: "Leilton",         type: "Alunos",                img: "../img/Leilton.png",   desc: "Aluno dedicado." },
    { id: 7,  name: "Arthut",          type: "Alunos",                img: "../img/Arthur.png",    desc: "Aluno dedicado." },
    { id: 8,  name: "Gabriel",         type: "Alunos",                img: "../img/Gabriel.png",   desc: "Aluna dedicada." },
    { id: 9,  name: "Bruno",           type: "Alunos",                img: "../img/bruno.png",     desc: "Aluno dedicado." },
    { id: 10, name: "Elena",           type: "Alunos",                img: "../img/elena.png",     desc: "Aluna dedicada." },
    { id: 11, name: "Marcos",          type: "Alunos",                img: "../img/marcos.png",    desc: "Aluno dedicado." },
    { id: 12, name: "Profa. Julia",    type: "Alunos",                img: "../img/julia.png",     desc: "Aluna dedicada." },
    { id: 13, name: "Prof. Fabio",     type: "Alunos",                img: "../img/fabio.png",     desc: "Aluno dedicado." },
    { id: 14, name: "Marina",          type: "Alunos",                img: "../img/marina.png",    desc: "Aluna dedicada." },
    { id: 15, name: "Prof. Andre",     type: "Alunos",                img: "../img/andre.png",     desc: "Aluno dedicado." },
    { id: 16, name: "Beatriz",         type: "Alunos",                img: "../img/beatriz.png",   desc: "Aluna dedicada." },
    { id: 17, name: "Prof. Thiago",    type: "Alunos",                img: "../img/thiago.png",    desc: "Aluno dedicado." },
    { id: 18, name: "Sofia",           type: "Alunos",                img: "../img/sofia.png",     desc: "Aluna dedicada." },
    { id: 19, name: "Igor Rocha",      type: "Alunos",                img: "../img/igor.png",      desc: "Aluno dedicado." },
    { id: 20, name: "Leticia Paz",     type: "Alunos",                img: "../img/leticia.png",   desc: "Aluna dedicada." }
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
        const badges = {
            "Banco de Dados":        "bg-success",
            "Alunos":                "bg-secondary",
            "POO":                   "bg-danger",
            "Logica de Programação": "bg-primary",
            "Front End":             "bg-info"
        };
        
        const badgeColor = badges[card.type] || "bg-dark";

        containerCatalogo.innerHTML += `
            <div class="col">
                <div class="card h-100 card-item shadow-lg border-0 bg-dark text-white overflow-hidden">
                    <img src="${card.img}" class="card-img-top p-2" alt="${card.name}"
                         style="height: 320px; object-fit: contain;"
                         onerror="this.src='https://placehold.co/350x450?text=Card+Em+Breve'">
                    <div class="card-body d-flex flex-column text-center">
                        <span class="badge ${badgeColor} mb-2" style="font-size: 0.65rem; letter-spacing: 1px;">${card.type.toUpperCase()}</span>
                        <h5 class="card-title fw-bold" style="font-family: 'Cinzel', serif; color: #f1c40f;">${card.name}</h5>
                        <p class="small text-light fst-italic mb-4" style="opacity: 0.7;">"${card.desc}"</p>
                        <div class="mt-auto">
                            <a href="../loja/loja.html" class="btn btn-warning w-100 py-2 fw-bold">
                                ✨ Tentar a Sorte na Loja
                            </a>
                        </div>
                    </div>
                </div>
            </div>`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('usuarioLogado')) {
        window.location.replace("../login/login.html");
        return;
    }

    renderizarTodoCatalogo(cartasDisponiveis);
});