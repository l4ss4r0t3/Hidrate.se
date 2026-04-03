const CACHE_NAME = 'hidrate-se-v3.1.4';

// O MÍNIMO para o app não abrir em branco (Página inicial + Script Principal)
const PRE_CACHE = [
  '/',
  '/index.html',
  '/styles/body.css',
  '/styles/bottles.css',
  '/styles/fonts.css',
  '/styles/menus.css',
  '/styles/popups.css',
  '/scripts/android.js',
  '/scripts/bottles.js',
  '/scripts/buttons.js',
  '/scripts/config.js',
  '/scripts/firebase.js',
  '/scripts/history.js',
  '/scripts/popups.js',
  '/scripts/reset.js',
  '/scripts/themes.js',
  '/images/svgs/buttons/x.svg',
  '/images/svgs/buttons/burguer.svg',
  '/images/svgs/bottles/one.svg',
  '/images/svgs/bottles/two.svg',
  '/images/svgs/bottles/three.svg'
];

// 1. Instalação: Salva apenas o essencial
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) =>
        Promise.allSettled(PRE_CACHE.map((url) => cache.add(url)))
      )
      .then(() => self.skipWaiting())
  );
});

// 2. Interceptação: Busca no cache, se não tiver, busca na rede e SALVA
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Retorna do cache se existir
      if (cachedResponse) {
        return cachedResponse;
      }

      // Se não estiver no cache, busca na rede
      return fetch(event.request).then((networkResponse) => {
        // Valida se a resposta é válida antes de salvar
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // SALVA dinamicamente no cache para a próxima vez
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});

// 3. Ativação: Limpa caches antigos e toma o controle imediatamente
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // 1. Limpa os caches velhos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log('Removendo cache antigo:', cache);
              return caches.delete(cache);
            }
          })
        );
      }),
      // 2. Toma o controle das abas abertas na hora!
      self.clients.claim()
    ])
  );
});