const CACHE_NAME = 'hidrate-se-v2';

// O MÍNIMO para o app não abrir em branco (Página inicial + Script Principal)
const PRE_CACHE = [
  '/',
  '/index.html',
  '/scripts/config.js',
  '/images/svgs/bottles/two.svg'
];

// 1. Instalação: Salva apenas o essencial
self.addEventListener('install', (event) => {
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