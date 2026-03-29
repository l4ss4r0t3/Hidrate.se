// =============================================================
// 🌊 BOTTLES.JS - GERENCIAMENTO DA GARRAFA DE ÁGUA
// =============================================================
// Este arquivo controla:
// - Estado global da aplicação (totalBebido, metaDiaria)
// - Persistência de dados (Firebase + localStorage)
// - Atualização visual da garrafa SVG
// - Eventos dos botões (Beber, Encher, Alterar Meta)
// =============================================================

// =============================================================
// 📊 ESTADO GLOBAL DA APLICAÇÃO
// Variáveis compartilhadas com o Firebase e localStorage
// =============================================================
window.totalBebido = 0;      // Quantidade de água consumida no dia (ml)
window.metaDiaria = 2000;    // Meta de consumo diário (ml)

// =============================================================
// 💾 FUNÇÕES DE LOCALSTORAGE
// Gerenciam persistência local quando o usuário está deslogado
// =============================================================

/**
 * Carrega dados do localStorage ao iniciar a aplicação
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
            console.error('❌ Erro ao carregar localStorage:', e);
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
        console.error('❌ Erro ao salvar no localStorage:', e);
    }
}

/**
 * Limpa dados do localStorage
 * Chamado ao fazer login (Firebase assume o controle)
 */
function limparLocalStorage() {
    localStorage.removeItem('hidratese_dados');
    console.log('🧹 localStorage limpo (dados migrados para Firebase)');
}

// =============================================================
// 🚀 CARREGAMENTO INICIAL
// Tenta carregar dados salvos do localStorage
// =============================================================
carregarDoLocalStorage();

// =============================================================
// 🎯 REFERÊNCIAS AOS ELEMENTOS DO DOM
// =============================================================
const inputMl   = document.getElementById('ml-input');   // Campo de quantidade a beber
const inputMeta = document.getElementById('meta-input'); // Campo de meta diária
const btnBeber  = document.getElementById('btn-beber');  // Botão "Beber Água"
const btnZerar  = document.getElementById('btn-zerar');  // Botão "Encher Garrafa"

// =============================================================
// 🧊 MANIPULAÇÃO DO SVG DA GARRAFA
// Aguarda o carregamento completo do SVG antes de manipulá-lo
// =============================================================
const myBottle = document.getElementById('svg-garrafa');
myBottle.addEventListener('load', function() {
    // Acessa o documento interno do SVG
    const svgDoc = myBottle.contentDocument;
    
    // Busca o elemento de água dentro do SVG
    const elementoAgua = svgDoc.getElementById('agua-nivel');

    // =============================================================
    // 📏 CONSTANTES DO SVG
    // Valores fixos que definem as dimensões da animação da água
    // =============================================================
    const ALTURA_MAX_SVG = 24;    // Altura máxima do retângulo de água (garrafa cheia)
    const POSICAO_BASE_Y = 31;    // Posição Y da base da garrafa

    // =============================================================
    // 🎨 FUNÇÃO: ATUALIZAR VISUAL DA GARRAFA
    // Recalcula o nível da água e atualiza o SVG e os textos
    // Chamada sempre que totalBebido ou metaDiaria mudam
    // =============================================================
    window.atualizarVisual = function() {
        // Calcula quantos ml ainda faltam para bater a meta (mínimo 0)
        const restante = Math.max(window.metaDiaria - window.totalBebido, 0);

        // Porcentagem de água restante (entre 0.0 e 1.0)
        // 1.0 = garrafa cheia (meta não atingida)
        // 0.0 = garrafa vazia (meta atingida)
        const porcentagem = Math.min(Math.max(restante / window.metaDiaria, 0), 1);

        // Calcula altura e posição Y do retângulo de água
        const novaAltura = porcentagem * ALTURA_MAX_SVG;
        const novoY = POSICAO_BASE_Y - novaAltura;

        // Atualiza os atributos do retângulo SVG que representa a água
        if (elementoAgua) {
            elementoAgua.setAttribute('height', novaAltura);
            elementoAgua.setAttribute('y', novoY);
        }

        // Referências aos elementos de texto do rótulo interno da garrafa
        const txtIngerido  = svgDoc.getElementById('texto-ingerido');  // Linha superior
        const txtMeta      = svgDoc.getElementById('texto-meta');      // Linha inferior
        const linhaFracao  = svgDoc.getElementById('linha-fracao');    // Traço separador

        if (txtIngerido && txtMeta) {
            if (porcentagem <= 0) {
                // 🎉 META BATIDA: Exibe mensagem de celebração
                txtIngerido.textContent = 'Meta';
                txtMeta.textContent = 'Batida! 🎉';
                if (linhaFracao) linhaFracao.style.display = 'none';
            } else {
                // 📊 META EM ANDAMENTO: Exibe "restante / meta"
                txtIngerido.textContent = `${restante}ml`;
                txtMeta.textContent = `${window.metaDiaria}ml`;
                if (linhaFracao) linhaFracao.style.display = 'block';
            }
        }
    };
    
    // Chama a atualização visual inicial após o SVG carregar
    window.atualizarVisual();
});

// =============================================================
// 💧 EVENTO: BOTÃO "BEBER ÁGUA"
// Registra consumo de água e salva no Firebase ou localStorage
// =============================================================
btnBeber.addEventListener('click', async () => {
    const valor = parseFloat(inputMl.value) || 0;  // Lê valor do input (0 se vazio)
    const user = window.auth?.currentUser;          // Verifica se está logado

    if (valor > 0) {
        if (user) {
            // ✅ MODO ONLINE: Incremento atômico no Firestore
            // O Firebase sincroniza automaticamente com o onSnapshot
            const userRef = window.doc(window.db, "usuarios", user.uid);
            await window.updateDoc(userRef, { 
                totalBebido: window.increment(valor) 
            });
        } else {
            // 💾 MODO OFFLINE: Atualiza localStorage
            window.totalBebido += valor;
            salvarNoLocalStorage();
            window.atualizarVisual();
        }
        
        // Fecha o menu e limpa o campo após registrar
        fecharMenuCelular();
    }
});

// =============================================================
// 🎯 EVENTO: ALTERAR META DIÁRIA
// Atualiza a meta no Firebase ou localStorage
// =============================================================
if (inputMeta) {
    inputMeta.addEventListener('change', async () => {
        const novaMeta = parseFloat(inputMeta.value) || 2000;
        const user = window.auth?.currentUser;

        if (user && novaMeta > 0) {
            // ✅ MODO ONLINE: Persiste a nova meta no Firestore
            const userRef = window.doc(window.db, "usuarios", user.uid);
            await window.updateDoc(userRef, { 
                metaDiaria: novaMeta 
            });
        } else {
            // 💾 MODO OFFLINE: Aplica a meta no localStorage
            window.metaDiaria = novaMeta;
            salvarNoLocalStorage();
            window.atualizarVisual();
        }
    });
}

// =============================================================
// 🔄 EVENTO: BOTÃO "ENCHER GARRAFA" (RESETAR CONSUMO)
// Zera o totalBebido para iniciar um novo dia
// =============================================================
btnZerar.addEventListener('click', async () => {
    const user = window.auth?.currentUser;

    // Confirmação antes de resetar (exceto no app Android)
    let confirmar = true;
    if (!(window.AndroidBridge)) {
        confirmar = confirm('Deseja encher a garrafa novamente?');
    }

    if (confirmar) {
        if (user) {
            // ✅ MODO ONLINE: Zera o campo totalBebido no Firestore
            const userRef = window.doc(window.db, "usuarios", user.uid);
            await window.updateDoc(userRef, { 
                totalBebido: 0 
            });
        } else {
            // 💾 MODO OFFLINE: Zera o localStorage
            window.totalBebido = 0;
            salvarNoLocalStorage();
            window.atualizarVisual();
        }
        
        // Fecha o menu após resetar
        fecharMenuCelular();
    }
});

// =============================================================
// 🌍 EXPORTAÇÃO GLOBAL
// Torna as funções acessíveis ao Firebase (index.html)
// =============================================================
window.carregarDoLocalStorage = carregarDoLocalStorage;
window.limparLocalStorage = limparLocalStorage;
window.salvarNoLocalStorage = salvarNoLocalStorage;