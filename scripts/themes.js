// =============================================================
// 🎨 THEMES.JS - PERSONALIZAÇÃO VISUAL DO APP
// =============================================================
// Este arquivo controla:
// - Alternância entre tema claro e escuro (inverter cores)
// - Imagem de fundo personalizada (upload + persistência)
//   A imagem fica num pseudo-elemento ::after isolado do filtro
//   de inversão, mantendo as cores originais no tema escuro.
// - Troca da garrafa SVG entre os modelos disponíveis
// =============================================================


document.addEventListener('DOMContentLoaded', () => {


    // =============================================================
    // 🌙 TEMA CLARO / ESCURO
    // Alterna a classe 'alt-theme' no body (filtro CSS invert).
    // Preferência persistida no localStorage.
    // =============================================================
    const btnTema = document.getElementById('btn-tema');

    // Restaura o tema salvo ao carregar o app
    if (localStorage.getItem('temaEscuro') === 'true') {
        document.body.classList.add('alt-theme');
    }

    if (btnTema) {
        btnTema.addEventListener('click', () => {
            const ativo = document.body.classList.toggle('alt-theme');
            localStorage.setItem('temaEscuro', ativo);
            console.log('🌙 Tema alternado:', ativo ? 'escuro' : 'claro');
        });
    }


    // =============================================================
    // 🖼️ IMAGEM DE FUNDO PERSONALIZADA
    // Permite ao usuário escolher uma imagem local como fundo.
    // A imagem é convertida em base64 e salva no localStorage.
    // Aplicada via CSS custom property (--bg-url) no body::after,
    // mantendo-a fora do escopo do filtro de inversão do tema.
    // O mesmo botão aplica e remove o fundo.
    // =============================================================
    const btnBg     = document.getElementById('btn-bg');
    const fileInput = document.getElementById('bg-file');

    // Aplica o fundo via CSS custom property no body::after
    function aplicarFundo(src) {
        document.body.style.setProperty('--bg-url', `url("${src}")`);
    }

    // Remove o fundo e limpa o localStorage
    function removerFundo() {
        document.body.style.removeProperty('--bg-url');
        localStorage.removeItem('bg-image');
        if (btnBg) btnBg.textContent = 'Aplicar Fundo';
        console.log('🖼️ Imagem de fundo removida');
    }

    // Restaura o fundo salvo ao carregar o app
    const bgSalvo = localStorage.getItem('bg-image');
    if (bgSalvo) {
        aplicarFundo(bgSalvo);
        if (btnBg) btnBg.textContent = 'Remover Fundo';
    }

    if (btnBg && fileInput) {

        btnBg.addEventListener('click', () => {
            const file     = fileInput.files[0];
            const temFundo = !!document.body.style.getPropertyValue('--bg-url');

            if (file) {
                // ✅ Arquivo selecionado: lê e aplica como fundo
                const reader = new FileReader();

                reader.onload = (e) => {
                    aplicarFundo(e.target.result);
                    localStorage.setItem('bg-image', e.target.result);
                    btnBg.textContent = 'Remover Fundo';
                    console.log('🖼️ Imagem de fundo aplicada');
                };

                reader.readAsDataURL(file);

            } else if (temFundo) {
                // ❌ Nenhum arquivo selecionado e fundo ativo: remove
                removerFundo();
            }
        });

        // Aplica automaticamente ao selecionar o arquivo no input
        fileInput.addEventListener('change', () => btnBg.click());
    }


    // =============================================================
    // 🧴 TROCA DE GARRAFA SVG
    // Alterna entre os três modelos de garrafa disponíveis.
    // O modelo atual é salvo no localStorage e restaurado ao abrir.
    // =============================================================
    const objGarrafa = document.getElementById('svg-garrafa');
    const btnBtl     = document.getElementById('btn-btl');

    // Mapa de modelos disponíveis (chave → caminho do SVG)
    const GARRAFAS = {
        one:   './images/svgs/bottles/one.svg',
        two:   './images/svgs/bottles/two.svg',
        three: './images/svgs/bottles/three.svg',
    };

    // Ordem de rotação entre os modelos
    const ORDEM = ['one', 'two', 'three'];

    if (objGarrafa && btnBtl) {
        let svgAtual = localStorage.getItem('svg-garrafa') || 'one';

        // Atualiza o atributo 'data' do <object> para trocar o SVG
        function atualizarSVG() {
            objGarrafa.setAttribute('data', GARRAFAS[svgAtual]);
            console.log('🧴 Garrafa trocada para:', svgAtual);
        }

        // Restaura o modelo salvo ao carregar o app
        atualizarSVG();

        btnBtl.addEventListener('click', () => {
            // Avança para o próximo modelo em rotação circular
            const indexAtual = ORDEM.indexOf(svgAtual);
            svgAtual         = ORDEM[(indexAtual + 1) % ORDEM.length];

            atualizarSVG();
            localStorage.setItem('svg-garrafa', svgAtual);
        });
    }


});