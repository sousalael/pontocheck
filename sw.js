// Service Worker — PontoCheck
// Intercepta todas as requisições e sempre busca a versão mais recente do servidor.
// Nunca serve arquivos do cache.

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    // Limpa todos os caches antigos ao ativar
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key) {
        return caches.delete(key);
      }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  // Sempre busca do servidor, nunca do cache
  event.respondWith(
    fetch(event.request, { cache: 'no-store' }).catch(function() {
      // Se offline, tenta o cache como fallback
      return caches.match(event.request);
    })
  );
});
