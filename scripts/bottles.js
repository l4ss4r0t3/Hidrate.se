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
// Variáveis compartilhadas com Firebase e localStorage
// =============================================================
window.totalBebido = 0;    // Quantidade de água consumida no dia (ml)
window.metaDiaria  = 2000; // Meta de consumo diário (ml)


// =============================================================
// 💾 FUNÇÕES DE LOCALSTORAGE
// Gerenciam persistência local quando o usuário está deslogado
// =============================================================

/**
 * Carrega dados do localStorage ao iniciar a aplicação.
 * Se não houver dados salvos, mantém os valores padrão.
 */
function carregarDoLocalStorage() {
    const dadosSalvos = localStorage.getItem('hidratese_dados');
    if (!dadosSalvos) return;

    try {
        const dados = JSON.parse(dadosSalvos);
        window.totalBebido = dados.totalBebido || 0;
        window.metaDiaria  = dados.metaDiaria  || 2000;
        console.log('📦 Dados carregados do localStorage');
    } catch (e) {
        console.error('❌ Erro ao carregar localStorage:', e);
    }
}

/**
 * Salva os dados atuais no localStorage.
 * Chamado sempre que houver mudança no modo offline.
 */
function salvarNoLocalStorage() {
    const dados = {
        totalBebido:       window.totalBebido,
        metaDiaria:        window.metaDiaria,
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
 * Limpa os dados do localStorage.
 * Chamado ao fazer login — Firebase assume o controle.
 */
function limparLocalStorage() {
    localStorage.removeItem('hidratese_dados');
    console.log('🧹 localStorage limpo (dados migrados para Firebase)');
}


// =============================================================
// 🌐 SYNC OFFLINE → FIREBASE
// Quando a internet voltar, envia os dados do localStorage
// para o Firebase automaticamente
// =============================================================

/**
 * Tenta sincronizar o localStorage com o Firebase ao voltar online.
 */
async function sincronizarComFirebase() {
    const user = window.auth?.currentUser;
    if (!user) return;

    const dadosSalvos = localStorage.getItem('hidratese_dados');
    if (!dadosSalvos) return;

    try {
        const dados   = JSON.parse(dadosSalvos);
        const userRef = window.doc(window.db, 'usuarios', user.uid);
        await window.updateDoc(userRef, {
            totalBebido: dados.totalBebido,
            metaDiaria:  dados.metaDiaria
        });
        console.log('🔄 Dados sincronizados com Firebase ao voltar online');
    } catch (e) {
        console.error('❌ Erro ao sincronizar com Firebase:', e);
    }
}

// Dispara sync automático ao reconectar à internet
window.addEventListener('online', () => {
    console.log('🌐 Conexão restaurada, sincronizando...');
    sincronizarComFirebase();
});


// =============================================================
// 🚀 CARREGAMENTO INICIAL
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

myBottle.addEventListener('load', function () {
    const svgDoc       = myBottle.contentDocument;
    const elementoAgua = svgDoc.getElementById('agua-nivel');

    // Dimensões fixas que definem a animação do nível de água
    const ALTURA_MAX_SVG = 24; // Altura máxima do retângulo (garrafa cheia)
    const POSICAO_BASE_Y = 31; // Posição Y da base da garrafa

    // =========================================================
    // 🎨 ATUALIZAR VISUAL DA GARRAFA
    // Recalcula o nível da água e atualiza o SVG e os textos.
    // Chamada sempre que totalBebido ou metaDiaria mudam.
    // =========================================================
    window.atualizarVisual = function () {
        const restante    = Math.max(window.metaDiaria - window.totalBebido, 0);
        const porcentagem = Math.min(Math.max(restante / window.metaDiaria, 0), 1);
        const novaAltura  = porcentagem * ALTURA_MAX_SVG;
        const novoY       = POSICAO_BASE_Y - novaAltura;

        if (elementoAgua) {
            elementoAgua.setAttribute('height', novaAltura);
            elementoAgua.setAttribute('y', novoY);
        }

        const txtIngerido = svgDoc.getElementById('texto-ingerido');
        const txtMeta     = svgDoc.getElementById('texto-meta');
        const linhaFracao = svgDoc.getElementById('linha-fracao');

        if (txtIngerido && txtMeta) {
            if (porcentagem <= 0) {
                // 🎉 Meta atingida
                txtIngerido.textContent = 'Meta';
                txtMeta.textContent     = 'Batida! 🎉';
                if (linhaFracao) linhaFracao.style.display = 'none';
            } else {
                // 📊 Meta em andamento
                txtIngerido.textContent = `${restante}ml`;
                txtMeta.textContent     = `${window.metaDiaria}ml`;
                if (linhaFracao) linhaFracao.style.display = 'block';
            }
        }
    };

    window.atualizarVisual();
});


// =============================================================
// 💧 EVENTO: BOTÃO "BEBER ÁGUA"
// Registra consumo de água e salva no Firebase ou localStorage.
// Também persiste o registro individual no histórico do dia.
// =============================================================
btnBeber.addEventListener('click', async () => {
    const valor = parseFloat(inputMl.value) || 0;
    const user  = window.auth?.currentUser;

    // Ignora cliques sem valor válido
    if (valor <= 0) return;

    // Atualiza estado global e persiste no localStorage
    window.totalBebido += valor;
    salvarNoLocalStorage();

    // Monta o registro individual do gole
    const hoje = new Date().toLocaleDateString('pt-BR');
    const registroIndividual = {
        quantidade: valor,
        hora:       new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        timestamp:  new Date().toISOString()
    };

    // Salva o registro individual no localStorage
    const chave     = `hidratese_registros_${hoje}`;
    const registros = JSON.parse(localStorage.getItem(chave)) || [];
    registros.push(registroIndividual);
    localStorage.setItem(chave, JSON.stringify(registros));

    if (user && navigator.onLine) {
        try {
            // ☁️ Incremento atômico do total no Firestore
            const userRef = window.doc(window.db, 'usuarios', user.uid);
            await window.updateDoc(userRef, {
                totalBebido: window.increment(valor)
            });

            // ☁️ Salva o registro individual na subcoleção do dia
            const registroRef = window.doc(
                window.db,
                'usuarios', user.uid,
                'historico', hoje,
                'registros', registroIndividual.timestamp
            );
            await window.setDoc(registroRef, registroIndividual);

            // ☁️ Garante o documento resumo do dia (merge para não sobrescrever)
            const diaRef = window.doc(
                window.db,
                'usuarios', user.uid,
                'historico', hoje
            );
            await window.setDoc(diaRef, {
                data:        hoje,
                totalBebido: window.totalBebido,
                metaDiaria:  window.metaDiaria
            }, { merge: true });

        } catch (e) {
            console.warn('⚠️ Firebase indisponível, salvo só no localStorage:', e);
            window.atualizarVisual();
        }
    } else {
        // 📴 Offline: só localStorage (já salvo acima)
        window.atualizarVisual();
    }

    fecharMenuCelular();
});


// =============================================================
// 🎯 EVENTO: ALTERAR META DIÁRIA
// Atualiza a meta no Firebase ou localStorage
// =============================================================
if (inputMeta) {
    inputMeta.addEventListener('change', async () => {
        const novaMeta = parseFloat(inputMeta.value) || 2000;
        const user     = window.auth?.currentUser;

        if (novaMeta <= 0) return;

        // Atualiza estado global e persiste no localStorage
        window.metaDiaria = novaMeta;
        salvarNoLocalStorage();

        if (user && navigator.onLine) {
            try {
                const userRef = window.doc(window.db, 'usuarios', user.uid);
                await window.updateDoc(userRef, { metaDiaria: novaMeta });
            } catch (e) {
                console.warn('⚠️ Firebase indisponível, meta salva só no localStorage:', e);
            }
        }

        window.atualizarVisual();
    });
}


// =============================================================
// 🔄 EVENTO: BOTÃO "ENCHER GARRAFA" (RESETAR CONSUMO)
// Zera o totalBebido e apaga os registros do dia no histórico
// tanto no Firebase quanto no localStorage
// =============================================================
btnZerar.addEventListener('click', async () => {
    const user = window.auth?.currentUser;

    // Confirmação antes de resetar (exceto no app Android)
    const confirmar = window.AndroidBridge
        ? true
        : confirm('Deseja encher a garrafa novamente? Esta ação também apaga o histórico do dia!');

    if (!confirmar) return;

    // Zera estado global e persiste no localStorage
    window.totalBebido = 0;
    salvarNoLocalStorage();

    // Apaga os registros individuais do dia no localStorage
    const hoje = new Date().toLocaleDateString('pt-BR');
    localStorage.removeItem(`hidratese_registros_${hoje}`);

    // Apaga o resumo do dia no histórico do localStorage
    const historico          = JSON.parse(localStorage.getItem('hidratese_historico')) || [];
    const historicoAtualizado = historico.filter(d => d.data !== hoje);
    localStorage.setItem('hidratese_historico', JSON.stringify(historicoAtualizado));

    if (user && navigator.onLine) {
        try {
            // ☁️ Apaga os registros individuais do dia no Firestore
            const registrosRef = window.collection(
                window.db,
                'usuarios', user.uid,
                'historico', hoje,
                'registros'
            );
            const snapshot = await window.getDocs(registrosRef);
            for (const docSnap of snapshot.docs) {
                await window.deleteDoc(docSnap.ref);
            }

            // ☁️ Apaga o documento resumo do dia no Firestore
            const diaRef = window.doc(
                window.db,
                'usuarios', user.uid,
                'historico', hoje
            );
            await window.deleteDoc(diaRef);

            // ☁️ Zera o totalBebido no documento do usuário
            const userRef = window.doc(window.db, 'usuarios', user.uid);
            await window.updateDoc(userRef, { totalBebido: 0 });

        } catch (e) {
            console.warn('⚠️ Firebase indisponível, zerado só no localStorage:', e);
        }
    }

    window.atualizarVisual();
    fecharMenuCelular();
});


// =============================================================
// 🌍 EXPORTAÇÃO GLOBAL
// Torna as funções acessíveis aos outros scripts
// =============================================================
window.carregarDoLocalStorage = carregarDoLocalStorage;
window.limparLocalStorage     = limparLocalStorage;
window.salvarNoLocalStorage   = salvarNoLocalStorage;