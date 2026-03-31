const CACHE_NAME = 'hidrate-se-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.js', // substitua pelos seus nomes de arquivo
  '/manifest.json',
  '/favicon.ico' 
];

// Instalação: Salva os arquivos essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Estratégia: Entrega o cache e atualiza por trás
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});