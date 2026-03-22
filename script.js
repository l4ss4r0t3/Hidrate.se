const ALTURA_MAX_SVG = 10;
const POSICAO_BASE_Y = 11;

const inputMl = document.getElementById('ml-input');
const inputMeta = document.getElementById('meta-input');
const btnBeber = document.getElementById('btn-beber');
const btnZerar = document.getElementById('btn-zerar');
const elementoAgua = document.getElementById('agua-nivel');

// 1. Carrega dados (Padrão 2000 para evitar divisão por zero)
let totalIngerido = parseFloat(localStorage.getItem('aguaConsumida')) || 0;
let metaDiaria = parseFloat(localStorage.getItem('metaSalva')) || 2000;

if(inputMeta) inputMeta.value = metaDiaria;
atualizarVisual();

// 2. Eventos de Input e Botões
if(inputMeta) {
    inputMeta.addEventListener('input', () => {
    // Se o campo estiver vazio, usamos 2000 como fallback temporário
    const novaMeta = parseFloat(inputMeta.value) || 2000; 
    if (novaMeta > 0) {
        metaDiaria = novaMeta;
        localStorage.setItem('metaSalva', metaDiaria);
        atualizarVisual();
    }
});
}

// BOTÃO BEBER - Unificado
btnBeber.addEventListener('click', () => {
    const valor = parseFloat(inputMl.value) || 0;
    if (valor > 0) {
        totalIngerido += valor;
        localStorage.setItem('aguaConsumida', totalIngerido);
        inputMl.value = ""; 
        atualizarVisual();
        fecharMenuCelular(); // Fecha o menu no mobile
    }
});

// Faz o Enter funcionar no campo de ML
inputMl.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        // Impede o comportamento padrão (evita recarregar a página se houver um form)
        event.preventDefault();
        
        // Simula um clique no botão de beber para rodar a lógica que já existe
        btnBeber.click();
    }
});

// BOTÃO ZERAR - Unificado (Apenas este bloco!)
btnZerar.addEventListener('click', () => {
    if (confirm("Deseja mesmo esvaziar sua garrafa?")) {
        totalIngerido = 0;
        localStorage.setItem('aguaConsumida', 0);
        atualizarVisual();
        fecharMenuCelular();
    }
});

function atualizarVisual() {
    const restante = Math.max(metaDiaria - totalIngerido, 0);
    let porcentagem = Math.min(Math.max(totalIngerido / metaDiaria, 0), 1);
    
    const novaAltura = porcentagem * ALTURA_MAX_SVG;
    const novoY = POSICAO_BASE_Y - novaAltura;

    elementoAgua.setAttribute('height', novaAltura);
    elementoAgua.setAttribute('y', novoY);

    const txtAgua = document.getElementById('texto-agua');
    if (txtAgua) {
        txtAgua.textContent = totalIngerido + "ml";
        txtAgua.setAttribute('y', POSICAO_BASE_Y - (novaAltura / 2) + 0.3);
        txtAgua.style.display = porcentagem > 0.1 ? "block" : "none";
    }

    const txtRestante = document.getElementById('texto-restante');
    if (txtRestante) {
        txtRestante.textContent = restante > 0 ? restante + "ml" : "Meta Batida! 🎉";
        const espacoVazio = 11 - novaAltura;
        txtRestante.setAttribute('y', 1 + (novaAltura < 10 ? (espacoVazio - 1) / 2 : -5)); 
        txtRestante.style.display = (porcentagem < 0.95) ? "block" : "none";
    }
}

function fecharMenuCelular() {
    const menu = document.querySelector('.dropdown-content');
    const dropdownPai = document.querySelector('.dropdown');

    if (menu) {
        menu.classList.add('hidden');
        
        // 1. Remove o foco do campo e fecha o teclado
        if (document.activeElement) document.activeElement.blur();
        if (dropdownPai) dropdownPai.blur();

        // 2. Garante que a tela volte para o topo (corrige o pulo do teclado mobile)
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' // Adiciona um deslize suave em vez de um pulo seco
        });

        setTimeout(() => {
            menu.classList.remove('hidden');
        }, 700); 
    }
}

// --- TEMA E CARREGAMENTO ---
const btnTema = document.getElementById('btn-tema');
if(btnTema) {
    btnTema.addEventListener('click', () => {
        document.body.classList.toggle('alt-theme');
        localStorage.setItem('temaEscuro', document.body.classList.contains('alt-theme'));
    });
}

window.addEventListener('load', () => {
    if (localStorage.getItem('temaEscuro') === 'true') {
        document.body.classList.add('alt-theme');
    }
});