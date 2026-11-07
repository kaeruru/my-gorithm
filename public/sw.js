// 맘고리즘 Service Worker (PWA 지원 & 캐시 제어)
const CACHE_NAME = 'mamgorithm-app-v1.0.1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png'
];

// 1. 설치 (Install): 핵심 자산 캐싱 & 즉시 활성화 준비
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. 활성화 (Activate): 구버전 캐시 즉시 제거 & 클라이언트 제어 시작
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. 패치 (Fetch):
// HTML/네비게이션은 항상 Network-First로 가져와서 최신 배포본 즉시 반영!
// 네트워크가 끊겼을 때만 캐시 폴백
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // POST나 타 도메인 API 요청은 패스
  if (request.method !== 'GET') return;

  // 네비게이션 요청 (HTML 페이지 요청)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 최신 페이지를 캐시에 업데이트
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          // 오프라인 시 캐시된 index.html 반환
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // 정적 자산(CSS, JS, 이미지, 폰트): Stale-While-Revalidate 또는 Network-First
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
