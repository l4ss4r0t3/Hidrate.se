const CACHE_NAME = 'hidrate-se-v3.0.1';

// O MÍNIMO para o app não abrir em branco (Página inicial + Script Principal)
const PRE_CACHE = [
  '/',
  '/index.html',
  '/styles/body.js',
  '/styles/bottles.js',
  '/styles/fonts.js',
  '/styles/menus.js',
  '/styles/popups.js',
  '/scripts/bottles.js',
  '/scripts/buttons.js',
  '/scripts/config.js',
  '/scripts/popups.js',
  '/scripts/themes.js',
  '/images/svgs/buttons/x.svg',
  '/images/svgs/buttons/burguer.svg',
  '/images/svgs/bottles/one.svg',
  '/images/svgs/bottles/two.svg',
  '/images/svgs/bottles/three.svg'
];

// 1. Instalação: Salva apenas o essencial
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força o SW novo a virar o "chefe" imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRE_CACHE))
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

// 3. Ativação: Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          // Se o cache encontrado não for o atual (v3.0.1), delete-o!
          if (cache !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});