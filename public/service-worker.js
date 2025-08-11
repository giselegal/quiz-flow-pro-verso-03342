// Service Worker simples para PWA básico
const CACHE_NAME = "quiz-quest-v1";
const urlsToCache = ["/", "/static/js/bundle.js", "/static/css/main.css"];

self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        console.log("Opened cache");
        return cache.addAll(urlsToCache.filter(url => url));
      })
      .catch(function (error) {
        console.log("Cache addAll failed:", error);
      })
  );
});

self.addEventListener("fetch", function (event) {
  // Apenas responder a requests HTTP/HTTPS
  if (!event.request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
