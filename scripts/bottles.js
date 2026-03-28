// =============================================================
// ESTADO GLOBAL (Sincronizado com Firebase quando logado)
// Com localStorage como fallback quando deslogado
// =============================================================
window.totalBebido = 0;
window.metaDiaria = 2000;

// =============================================================
// FUNÇÕES DE LOCALSTORAGE
// Gerenciam persistência local dos dados quando deslogado
// =============================================================

/**
 * Carrega dados do localStorage ao iniciar
 * Se não houver dados salvos, usa valores padrão
 */
function carregarDoLocalStorage() {
    const dadosSalvos = localStorage.getItem('hidratese_dados');
    
    if (dadosSalvos) {
        try {
            const dados = JSON.parse(dadosSalvos);
            window.totalBebido = dados.totalBebido || 0;
            window.metaDiaria = dados.metaDiaria || 2000;
            console.log('📦 Dados carregados do localStorage');
        } catch (e) {
            console.error('Erro ao carregar localStorage:', e);
        }
    }
}

/**
 * Salva dados no localStorage
 * Chamado sempre que houver mudança no modo offline
 */
function salvarNoLocalStorage() {
    const dados = {
        totalBebido: window.totalBebido,
        metaDiaria: window.metaDiaria,
        ultimaAtualizacao: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('hidratese_dados', JSON.stringify(dados));
        console.log('💾 Dados salvos no localStorage');
    } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
    }
}

/**
 * Limpa dados do localStorage
 * Chamado ao fazer login (Firebase assume controle)
 */
function limparLocalStorage() {
    localStorage.removeItem('hidratese_dados');
    console.log('🧹 localStorage limpo');
}

// =============================================================
// CARREGAMENTO INICIAL
// Tenta carregar dados salvos do localStorage
// =============================================================
carregarDoLocalStorage();

// =============================================================
// REFERÊNCIAS AOS ELEMENTOS DO DOM
// =============================================================
const inputMl   = document.getElementById('ml-input');
const inputMeta = document.getElementById('meta-input');
const btnBeber  = document.getElementById('btn-beber');
const btnZerar  = document.getElementById('btn-zerar');

const myBottle = document.getElementById('svg-garrafa');
myBottle.addEventListener('load', function() {
    // Acessa o documento interno do SVG
    const svgDoc = myBottle.contentDocument;
    
    // Busca o elemento de água dentro do SVG
    const elementoAgua = svgDoc.getElementById('agua-nivel');

    // =============================================================
    // CONSTANTES DO SVG
    // =============================================================
    const ALTURA_MAX_SVG = 24;
    const POSICAO_BASE_Y = 31;

    // =============================================================
    // FUNÇÃO: ATUALIZAR VISUAL
    // Recalcula o nível da água e atualiza o SVG e o rótulo
    // =============================================================
    window.atualizarVisual = function() {
        // Calcula quantos ml ainda faltam para bater a meta (mínimo 0)
        const restante = Math.max(window.metaDiaria - window.totalBebido, 0);

        // Porcentagem de água restante (entre 0.0 e 1.0)
        const porcentagem = Math.min(Math.max(restante / window.metaDiaria, 0), 1);

        // Altura e posição Y do retângulo de água no SVG
        const novaAltura = porcentagem * ALTURA_MAX_SVG;
        const novoY = POSICAO_BASE_Y - novaAltura;

        // Atualiza os atributos do retângulo SVG que representa a água
        if (elementoAgua) {
            elementoAgua.setAttribute('height', novaAltura);
            elementoAgua.setAttribute('y', novoY);
        }

        // Referências aos elementos de texto do rótulo interno da garrafa
        const txtIngerido  = svgDoc.getElementById('texto-ingerido');
        const txtMeta      = svgDoc.getElementById('texto-meta');
        const linhaFracao  = svgDoc.getElementById('linha-fracao');

        if (txtIngerido && txtMeta) {
            if (porcentagem <= 0) {
                // Meta batida: exibe mensagem de celebração
                txtIngerido.textContent = 'Meta';
                txtMeta.textContent = 'Batida! 🎉';
                if (linhaFracao) linhaFracao.style.display = 'none';
            } else {
                // Meta em andamento: exibe "restante / meta"
                txtIngerido.textContent = `${restante}ml`;
                txtMeta.textContent = `${window.metaDiaria}ml`;
                if (linhaFracao) linhaFracao.style.display = 'block';
            }
        }
    };
    
    // Chama a atualização visual inicial
    window.atualizarVisual();
});

// =============================================================
// EVENTO: BEBER ÁGUA
// Salva no Firebase se logado, ou no localStorage se deslogado
// =============================================================
btnBeber.addEventListener('click', async () => {
    const valor = parseFloat(inputMl.value) || 0;
    const user = window.auth?.currentUser;

    if (valor > 0) {
        if (user) {
            // ✅ MODO ONLINE: incremento atômico no Firestore
            const userRef = window.doc(window.db, "usuarios", user.uid);
            await window.updateDoc(userRef, { totalBebido: window.increment(valor) });
        } else {
            // 💾 MODO OFFLINE: atualiza localStorage
            window.totalBebido += valor;
            salvarNoLocalStorage();  // 🆕 SALVA NO LOCALSTORAGE
            window.atualizarVisual();
        }
        inputMl.value = ''; // Limpa o campo após registrar
        fecharMenuCelular();
    }
});

// =============================================================
// EVENTO: ALTERAR META DIÁRIA
// Salva no Firebase se logado, ou no localStorage se deslogado
// =============================================================
if (inputMeta) {
    inputMeta.addEventListener('change', async () => {
        const novaMeta = parseFloat(inputMeta.value) || 2000;
        const user = window.auth?.currentUser;

        if (user && novaMeta > 0) {
            // ✅ MODO ONLINE: persiste a nova meta no Firestore
            const userRef = window.doc(window.db, "usuarios", user.uid);
            await window.updateDoc(userRef, { metaDiaria: novaMeta });
        } else {
            // 💾 MODO OFFLINE: aplica a meta no localStorage
            window.metaDiaria = novaMeta;
            salvarNoLocalStorage();  // 🆕 SALVA NO LOCALSTORAGE
            window.atualizarVisual();
        }
    });
}

// =============================================================
// EVENTO: ENCHER GARRAFA (ZERAR CONSUMO)
// Salva no Firebase se logado, ou no localStorage se deslogado
// =============================================================
btnZerar.addEventListener('click', async () => {
    const user = window.auth?.currentUser;

    let confirmar = true;

    if (!(window.AndroidBridge)) {
        confirmar = confirm('Deseja encher a garrafa novamente?');
    }

    if (confirmar) {
        if (user) {
            // ✅ MODO ONLINE: zera o campo totalBebido no Firestore
            const userRef = window.doc(window.db, "usuarios", user.uid);
            await window.updateDoc(userRef, { totalBebido: 0 });
        } else {
            // 💾 MODO OFFLINE: zera o localStorage
            window.totalBebido = 0;
            salvarNoLocalStorage();  // 🆕 SALVA NO LOCALSTORAGE
            window.atualizarVisual();
        }
        fecharMenuCelular();
    }
});

// =============================================================
// EXPORTA FUNÇÕES PARA USO PELO FIREBASE
// O index.html precisa chamar estas funções ao logar/deslogar
// =============================================================
window.carregarDoLocalStorage = carregarDoLocalStorage;
window.limparLocalStorage = limparLocalStorage;
window.salvarNoLocalStorage = salvarNoLocalStorage;