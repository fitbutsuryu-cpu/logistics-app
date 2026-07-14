// ALINCO LOGITIME - Service Worker
// PWA化のためだけの最小構成。オフラインキャッシュは一切行わず、
// 常にネットワークから最新のファイルを取得する（GitHub更新が即座に反映されるように）。

self.addEventListener('install', (event) => {
  // 新しいService Workerをすぐに有効化する
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // 既存のキャッシュがあれば全て削除（念のため）
  event.waitUntil(
    caches.keys().then((names) => Promise.all(names.map((n) => caches.delete(n))))
  );
  self.clients.claim();
});

// フェッチは常にネットワークから取得する（キャッシュを一切使わない = 常に最新版）
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
