const CACHE_NAME = 'github-profile-viewer-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles/main.css',
    './styles/variables.css',
    './styles/components.css',
    './scripts/app.js',
    './scripts/core/eventBus.js',
    './scripts/services/githubApi.js',
    './scripts/services/storage.js',
    './scripts/components/search.js',
    './scripts/components/profileCard.js',
    './scripts/components/savedProfiles.js',
    './scripts/utils/debounce.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('fetch', (event) => {
    // Cache-first strategy for static assets
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request)
                .then((response) => response || fetch(event.request))
        );
        return;
    }

    // Network-first strategy for API calls (with dynamic caching if needed, but let's keep it simple)
    // For now, we just let API calls go through to network. 
    // If offline, they will fail, but the static app will load.
    // To support offline API, we'd need to cache API responses.
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
