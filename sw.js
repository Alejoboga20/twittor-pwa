importScripts('./js/sw-utils.js');

const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
	/* './', */
	'./index.html',
	'./css/style.css',
	'./js/app.js',
	'./js/sw-utils.js',
	'./img/favicon.ico',
	'./img/avatars/spiderman.jpg',
	'./img/avatars/ironman.jpg',
	'./img/avatars/wolverine.jpg',
	'./img/avatars/thor.jpg',
	'./img/avatars/hulk.jpg',
];

const APP_SHELL_INMUTABLE = [
	'https://fonts.googleapis.com/css?family=Quicksand:300,400',
	'https://fonts.googleapis.com/css?family=Lato:400,300',
	'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
	'./css/animate.css',
	'./js/libs/jquery.js',
];

self.addEventListener('install', (e) => {
	console.log('[Service Worker] - Installed');

	const staticCache = caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL));
	const inmutableCache = caches
		.open(INMUTABLE_CACHE)
		.then((cache) => cache.addAll(APP_SHELL_INMUTABLE));

	e.waitUntil(Promise.all([staticCache, inmutableCache]));
});

self.addEventListener('activate', (e) => {
	console.log('[Service Worker] - Activated');

	const response = caches.keys().then((keys) => {
		keys.forEach((key) => {
			if (key != STATIC_CACHE && key.includes('static')) {
				return caches.delete(key);
			}
		});
	});

	e.waitUntil(response);
});

self.addEventListener('fetch', (e) => {
	const response = caches.match(e.request).then((resp) => {
		if (resp) return resp;

		return fetch(e.request).then((newResp) =>
			updateDynamicCache(DYNAMIC_CACHE, e.request, newResp)
		);
	});

	e.respondWith(response);
});
