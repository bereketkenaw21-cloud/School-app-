const CACHE_NAME = 'mertule-school-v2';
const assets = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json'
];

// 1. ፋይሎቹን በስልኩ ሜሞሪ ውስጥ መጫን (Install)
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Caching assets...');
            return cache.addAll(assets);
        })
    );
});

// 2. አዲስ የካሽ ስም ሲኖር የቆየውን ማጽዳት (Activate)
// ይህ ተግባር አፑን ስታሻሽለው የቆየው ዳታ ተማሪዎች ጋር እንዳይቀር ይረዳል
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// 3. ፋይሎችን ከካሽ ወይም ከኔትወርክ ማምጣት (Fetch)
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
});
