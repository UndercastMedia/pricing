---
layout: null
sitemap: false
---

var urlsToCache = [];

{% for page in site.pages %}
urlsToCache.push("{{ page.url }}");
{% endfor %}

var CACHE = 'cast-cache-v1';

self.addEventListener('install', function(evt) {
  self.skipWaiting();
  evt.waitUntil(precache());
});

function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(urlsToCache);
  });
}

self.addEventListener('fetch', function(evt) {
  evt.respondWith(fromNetwork(evt.request, 3000).catch(function () {
    return fromCache(evt.request);
  }));
  
  evt.waitUntil(updateCache(evt.request));
});

function fromNetwork(request, timeout) {
  return new Promise(function (fulfill, reject) {
    var timeoutId = setTimeout(reject, timeout);
    fetch(request).then(function (response) {
      clearTimeout(timeoutId);
      fulfill(response);
    }, reject);
  });
}

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

function updateCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}
