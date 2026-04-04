// =============================================================
// ⚙️ SW.JS - SERVICE WORKER (PWA)
// =============================================================
// Este arquivo controla:
// - Cache dos recursos essenciais na instalação (PRE_CACHE)
// - Estratégia Cache First com fallback para rede
// - Cache dinâmico de recursos novos em tempo real
// - Limpeza de caches antigos na ativação
// =============================================================


// =============================================================
// 🏷️ VERSÃO DO CACHE
// Altere o número ao fazer deploy para forçar atualização
// em todos os dispositivos que já têm o app instalado.
// =============================================================
const CACHE_NAME = 'hidrate-se-v3.1.6';


// =============================================================
// 📦 PRÉ-CACHE — RECURSOS ESSENCIAIS
// Arquivos salvos na instalação do Service Worker.
// Garante que o app abre mesmo sem conexão.
// =============================================================
const PRE_CACHE = [
  '/',
  '/index.html',

  // Estilos
  '/styles/body.css',
  '/styles/bottles.css',
  '/styles/fonts.css',
  '/styles/menus.css',
  '/styles/popups.css',

  // Scripts
  '/scripts/android.js',
  '/scripts/bottles.js',
  '/scripts/buttons.js',
  '/scripts/config.js',
  '/scripts/firebase.js',
  '/scripts/history.js',
  '/scripts/popups.js',
  '/scripts/reset.js',
  '/scripts/sw_config.js',
  '/scripts/themes.js',

  // Imagens
  '/images/svgs/buttons/x.svg',
  '/images/svgs/buttons/burguer.svg',
  '/images/svgs/bottles/one.svg',
  '/images/svgs/bottles/two.svg',
  '/images/svgs/bottles/three.svg',
];


// =============================================================
// 1️⃣ INSTALAÇÃO
// Salva todos os recursos do PRE_CACHE.
// Promise.allSettled garante que uma falha isolada não
// cancela o cache dos outros recursos.
// skipWaiting força o novo SW a assumir imediatamente.
// =============================================================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) =>
        Promise.allSettled(PRE_CACHE.map((url) => cache.add(url)))
      )
      .then(() => {
        console.log('✅ PRE_CACHE concluído:', CACHE_NAME);
        self.skipWaiting();
      })
  );
});


// =============================================================
// 2️⃣ INTERCEPTAÇÃO DE REQUISIÇÕES — CACHE FIRST
// Estratégia: busca no cache primeiro, rede como fallback.
// Recursos novos encontrados na rede são salvos dinamicamente
// para estarem disponíveis offline na próxima visita.
// =============================================================
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {

      // ✅ Cache hit: retorna direto sem ir à rede
      if (cachedResponse) {
        return cachedResponse;
      }

      // 🌐 Cache miss: busca na rede
      return fetch(event.request).then((networkResponse) => {

        // Só salva respostas válidas e do mesmo domínio (type: basic)
        // Respostas opacas (CDN externo) ou com erro não são cacheadas
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== 'basic'
        ) {
          return networkResponse;
        }

        // Clona a resposta antes de consumir — streams só podem ser
        // lidos uma vez: uma cópia vai para o cache, outra para o browser
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
          console.log('💾 Recurso cacheado dinamicamente:', event.request.url);
        });

        return networkResponse;
      });
    })
  );
});


// =============================================================
// 3️⃣ ATIVAÇÃO
// Limpa caches de versões anteriores para liberar espaço e
// evitar conflitos com recursos desatualizados.
// clients.claim() assume o controle das abas abertas imediatamente,
// sem aguardar um reload — funciona em conjunto com skipWaiting.
// =============================================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([

      // Remove todos os caches que não são a versão atual
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log('🗑️ Removendo cache antigo:', cache);
              return caches.delete(cache);
            }
          })
        )
      ),

      // Assume o controle das abas já abertas imediatamente
      self.clients.claim()

    ])
  );
});