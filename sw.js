---
layout: null
sitemap: false
---

var urlsToCache = [];

{% for page in site.pages %}
urlsToCache.push("{{ page.url }}");
{% endfor %}

var CACHE_NAME = 'cast-cache-v1';

self.addEventListener('install', function(event) {
  self.skipWaiting();

  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(urlsToCache);
  }));
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request);
      })
    })
  );

  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      cache.match(event.request).then(function (response) {
        response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
        });
      });
    })
  );
});
