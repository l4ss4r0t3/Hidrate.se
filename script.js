const ALTURA_MAX_SVG = 10;
const POSICAO_BASE_Y = 11;

const inputMl = document.getElementById('ml-input');
const inputMeta = document.getElementById('meta-input'); // Você precisará criar este ID no HTML
const btnBeber = document.getElementById('btn-beber');
const btnZerar = document.getElementById('btn-zerar');
const elementoAgua = document.getElementById('agua-nivel');

// 1. Carrega o progresso E a meta salva (ou usa 2000 como padrão)
let totalIngerido = parseFloat(localStorage.getItem('aguaConsumida')) || 0;
let metaDiaria = parseFloat(localStorage.getItem('metaSalva')) || 0;

// Inicializa o valor do input da meta na tela
if(inputMeta) inputMeta.value = metaDiaria;

atualizarVisual();

// 2. Escuta mudanças na meta
if(inputMeta) {
    inputMeta.addEventListener('input', () => {
        const novaMeta = parseFloat(inputMeta.value);
        if (novaMeta > 0) {
            metaDiaria = novaMeta;
            localStorage.setItem('metaSalva', metaDiaria);
            atualizarVisual();
        }
    });
}

btnBeber.addEventListener('click', () => {
    const valor = parseFloat(inputMl.value) || 0;
    if (valor > 0) {
        totalIngerido += valor;
        localStorage.setItem('aguaConsumida', totalIngerido);
        inputMl.value = ""; 
        atualizarVisual();
    }
});

btnZerar.addEventListener('click', () => {
    if (confirm("Deseja mesmo esvaziar sua garrafa?")) {
        totalIngerido = 0;
        localStorage.setItem('aguaConsumida', 0);
        atualizarVisual();
    }
});

function atualizarVisual() {
    // Agora usamos metaDiaria (variável) em vez da constante
    const restante = Math.max(metaDiaria - totalIngerido, 0);
    let porcentagem = Math.min(Math.max(totalIngerido / metaDiaria, 0), 1);
    
    const novaAltura = porcentagem * ALTURA_MAX_SVG;
    const novoY = POSICAO_BASE_Y - novaAltura;

    // 1. Atualiza o retângulo da água
    elementoAgua.setAttribute('height', novaAltura);
    elementoAgua.setAttribute('y', novoY);

    // 2. Atualiza o texto da água (Ingerido)
    const txtAgua = document.getElementById('texto-agua');
    if (txtAgua) {
        txtAgua.textContent = totalIngerido + "ml";
        txtAgua.setAttribute('y', POSICAO_BASE_Y - (novaAltura / 2) + 0.3);
        // Só mostra o texto se a garrafa tiver pelo menos 10% de água para não embolar
        txtAgua.style.display = porcentagem > 0.1 ? "block" : "none";
    }

    // 3. Atualiza o texto do restante
    const txtRestante = document.getElementById('texto-restante');
    if (txtRestante) {
        txtRestante.textContent = restante > 0 ? restante + "ml" : "Meta Batida! 🎉";
        const espacoVazio = 11 - novaAltura;
        // Posiciona no centro do espaço branco
        txtRestante.setAttribute('y', 1 + (novaAltura < 10 ? (espacoVazio - 1) / 2 : -5)); 
        // Esconde o "restante" se sobrar menos de 5% de espaço no topo
        txtRestante.style.display = (porcentagem < 0.95) ? "block" : "none";
    }
}

function fecharMenuCelular() {
    const menu = document.querySelector('.dropdown-content');
    if (menu) {
        // 1. Adiciona a classe que força o "display: none"
        menu.classList.add('hidden');

        // 2. Remove a classe após um tempo curto (300ms)
        // Isso permite que o menu possa ser aberto novamente no próximo toque
        setTimeout(() => {
            menu.classList.remove('hidden');
            // Remove o foco do botão para garantir que o menu feche no mobile
            document.activeElement.blur();
        }, 300);
    }
}

// Adicione a chamada nos seus eventos:
btnBeber.addEventListener('click', () => {
    // ... seu código de somar água ...
    atualizarVisual();
    fecharMenuCelular(); // <--- Chama aqui
});

btnZerar.addEventListener('click', () => {
    if (confirm("Deseja mesmo esvaziar sua garrafa?")) {
        // ... seu código de zerar ...
        atualizarVisual();
        fecharMenuCelular(); // <--- Chama aqui
    }
});

const btnTema = document.getElementById('btn-tema');

btnTema.addEventListener('click', () => {
    // toggle adiciona a classe se não tiver, e remove se já tiver
    document.body.classList.toggle('alt-theme');
    
    // Opcional: salvar a preferência no LocalStorage
    const temaAtivo = document.body.classList.contains('alt-theme');
    localStorage.setItem('temaEscuro', temaAtivo);
});

// Ao carregar a página, verificar se o usuário já tinha escolhido o tema
window.addEventListener('load', () => {
    if (localStorage.getItem('temaEscuro') === 'true') {
        document.body.classList.add('alt-theme');
    }
});