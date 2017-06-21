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
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(urlsToCache);
  }));
});

self.addEventListener('fetch', function(event) {
  event.respondWith(

    fetch(event.request)
    .then(function(){
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function (response) {
          return response || fetch(event.request).then(function(response) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    })
    .catch(function() {
      return caches.match(event.request);
    })
    
  );
});
