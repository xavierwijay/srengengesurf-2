// Optimized Service Worker for Srengenge Website
const CACHE_NAME = "srengenge-v1.1.0";
const STATIC_CACHE = "srengenge-static-v1.1.0";
const DYNAMIC_CACHE = "srengenge-dynamic-v1.1.0";

// Critical resources to cache immediately
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/img/backgroundhero.png",
  "/img/srngengelogoo.png",
  "/img/texthero.png",
];

// Install event - Cache critical resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Caching critical resources");
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Fetch event - Network first for HTML, Cache first for static assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.destination === "document") {
    // Network first strategy for HTML
    event.respondWith(networkFirst(request));
  } else if (request.destination === "image") {
    // Cache first strategy for images
    event.respondWith(cacheFirst(request));
  } else {
    // Stale while revalidate for CSS/JS
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Network first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response("Offline", { status: 503 });
  }
}

// Cache first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    return new Response("Image not available", { status: 404 });
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  const networkResponsePromise = fetch(request).then((response) => {
    const cache = caches.open(DYNAMIC_CACHE);
    cache.then((c) => c.put(request, response.clone()));
    return response;
  });

  return cachedResponse || networkResponsePromise;
}

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
