const CACHE_NAME = 'mertule-school-v3'; // ስሙን ወደ v3 ቀይሬዋለሁ አዲስ ለውጥ እንዲኖር
const assets = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    'https://cdn-icons-png.flaticon.com/512/2997/2997300.png' // የአይኮን ሊንክ
];

// 1. መጫን (Install) - ፋይሎቹን መያዝ
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Mertule App: Caching Assets...');
            return cache.addAll(assets);
        })
    );
    self.skipWaiting(); // አዲሱ ሰርቪስ ወርከር ወዲያው እንዲሰራ
});

// 2. ማጽዳት (Activate) - የቆየውን ዳታ ማጥፋት
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
    return self.clients.claim(); // በቅፅበት ስልኩን እንዲቆጣጠር
});

// 3. ማምጣት (Fetch) - ከሜሞሪ ወይም ከኔትወርክ
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request).catch(() => caches.match('./index.html'));
        })
    );
});
